import OpenAI from "openai";

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
    !("messages" in body) ||
    !Array.isArray((body as { messages: unknown }).messages)
  ) {
    return Response.json({ error: "缺少 messages 数组" }, { status: 400 });
  }

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

  const system = `你是个人主页站点的问答助手。请**仅**根据下方「知识库」与「站长简介」回答访客问题。若资料中没有相关信息，请用简短中文明确说明「提供的资料中没有提到」，不要编造事实或臆测隐私。

【站长简介】
姓名：${profile.name}
头衔：${profile.title}
一句话：${profile.tagline}

【知识库】
${knowledge}`;

  const openai = new OpenAI({
    apiKey: key,
    ...(process.env.OPENAI_BASE_URL
      ? { baseURL: process.env.OPENAI_BASE_URL }
      : {}),
  });

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [{ role: "system", content: system }, ...messages],
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (err) {
          controller.error(err);
          return;
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
