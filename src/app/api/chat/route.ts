import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

import { buildAskSystemPrompt } from "../../../../eval/askSystemPrompt.mjs";
import { loadKnowledgeText, loadProfile } from "@/lib/content";

export const maxDuration = 60;

const MAX_MESSAGES = 24;
const MAX_CONTENT_LENGTH = 8000;

export async function POST(req: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return Response.json(
      {
        error:
          "服务器未配置 OPENAI_API_KEY。请在本地创建 .env.local，或在 Vercel 环境变量中设置。",
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "请求体不是有效的 JSON" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("conversationId" in body) ||
    typeof (body as { conversationId?: unknown }).conversationId !== "string" ||
    !(body as { conversationId: string }).conversationId.trim() ||
    !("messages" in body) ||
    !Array.isArray((body as { messages: unknown }).messages)
  ) {
    return Response.json(
      { error: "缺少 conversationId 或 messages 数组" },
      { status: 400 }
    );
  }

  const conversationId = (body as { conversationId: string }).conversationId.trim();
  const rawMessages = (body as { messages: { role?: string; content?: string }[] })
    .messages;

  if (rawMessages.length === 0) {
    return Response.json({ error: "messages 不能为空" }, { status: 400 });
  }
  if (rawMessages.length > MAX_MESSAGES) {
    return Response.json({ error: "对话条数过多，请清空后重试" }, { status: 400 });
  }

  const messages: { role: "user" | "assistant"; content: string }[] = [];
  for (const m of rawMessages) {
    if (m.role !== "user" && m.role !== "assistant") {
      return Response.json({ error: "仅支持 user / assistant 角色" }, { status: 400 });
    }
    if (typeof m.content !== "string") {
      return Response.json({ error: "消息 content 无效" }, { status: 400 });
    }
    if (m.content.length > MAX_CONTENT_LENGTH) {
      return Response.json({ error: "单条消息过长" }, { status: 400 });
    }
    messages.push({ role: m.role, content: m.content });
  }

  const knowledge = loadKnowledgeText();
  const profile = loadProfile();

  const system = buildAskSystemPrompt(profile, knowledge);

  const openai = new OpenAI({
    apiKey: key,
    ...(process.env.OPENAI_BASE_URL
      ? { baseURL: process.env.OPENAI_BASE_URL }
      : {}),
  });

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase =
      supabaseUrl && supabaseServiceKey
        ? createClient(supabaseUrl, supabaseServiceKey, {
            auth: { persistSession: false, autoRefreshToken: false },
          })
        : null;

    const firstUser = messages[0];
    const title =
      messages.length === 1 && firstUser?.role === "user"
        ? firstUser.content.trim().slice(0, 20)
        : null;

    // Persist the latest user message (best-effort).
    const last = messages[messages.length - 1];
    if (supabase && last?.role === "user") {
      await supabase.from("conversations").upsert({
        id: conversationId,
        ...(title ? { title } : {}),
      });

      await supabase.from("conversation_messages").upsert({
        conversation_id: conversationId,
        idx: messages.length - 1,
        role: "user",
        content: last.content,
      });

      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);
    }

    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "system", content: system }, ...messages],
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let assistantText = "";
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (!text) continue;
            assistantText += text;
            controller.enqueue(encoder.encode(text));
          }
        } catch (err) {
          controller.error(err);
          return;
        }
        if (supabase && assistantText) {
          try {
            await supabase.from("conversations").upsert({ id: conversationId });
            await supabase.from("conversation_messages").upsert({
              conversation_id: conversationId,
              idx: messages.length,
              role: "assistant",
              content: assistantText,
            });
            await supabase
              .from("conversations")
              .update({ updated_at: new Date().toISOString() })
              .eq("id", conversationId);
          } catch {
            // best-effort; ignore logging failures
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "调用语言模型失败，请稍后重试。";
    return Response.json({ error: message }, { status: 502 });
  }
}
