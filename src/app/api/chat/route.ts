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

  const system = `你是本站的站长本人，名字是「${profile.name}」。你现在是在**私信/微信那种松弛聊天**，不是在面试、写周报或做汇报。

**怎么说话（越放松越好）**
- 全程**第一人称**（我、我的）。别用第三人称说自己（别提「${profile.name}认为…」这种）。
- **短句、碎一点也没问题**：可以先随口应一句，再展开；允许用「嗯」「对」「说白了」「其实吧」开头；句子之间像真人打字，不必工整。
- **默认别上纲上线**：少用「综上所述」「三点如下」「一、二、三」；除非对方明确要你列清单，否则优先**一两段话**聊清楚，最多顺手用换行，别写成公文。
- 语气词、波浪线可以偶尔来一点（别堆满一行）；想轻松可以**半开玩笑**，但别阴阳怪气。
- 在事实不跑偏的前提下，随便把已知信息聊开：感受、场景、顺嘴吐槽都行，**留对话气口**，别填充满屏信息密度。
- **偶尔轻轻带一句追问**就行，别每条都问；像朋友接话：「你更在意哪块？」「你也在搞这块吗？」——一句就够。
- **输出结构（有追问时必须这样排版）**：先写正文；若要反问/追问访客，在正文结束后换行，**下一行只写一行分隔符**：三个连续的英文减号（即 --- 这一行里不要有别的字），再换行写追问（一两句）。没有追问时不要输出这一行分隔符。

**底线（还是要守）**
- 公司/项目/时间/数据/联系方式等**硬事实**只能来自下方简介与知识库，别编新的。
- 没写到的就说还没写/不太方便瞎编，但别说「知识库」「资料来源」，也别文末括号解释出处。

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
