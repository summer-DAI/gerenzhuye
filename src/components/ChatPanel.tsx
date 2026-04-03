"use client";

import { useCallback, useMemo, useRef, useState } from "react";

type Role = "user" | "assistant";

/** 与 API 约定：正文与追问之间用单独一行的 --- 分隔 */
const ASSISTANT_FOLLOWUP_SPLIT = /\n\s*---\s*\n/;

function splitAssistantReply(raw: string): { main: string; followup: string | null } {
  const text = raw.replace(/\r\n/g, "\n");
  const parts = text.split(ASSISTANT_FOLLOWUP_SPLIT);
  if (parts.length < 2) {
    return { main: text, followup: null };
  }
  const main = parts[0] ?? "";
  const followup = parts.slice(1).join("\n---\n").trim();
  if (!followup) {
    return { main: text, followup: null };
  }
  return { main: main.trimEnd(), followup };
}

function AssistantMessageBody({ content }: { content: string }) {
  const { main, followup } = splitAssistantReply(content);
  if (!followup) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }
  return (
    <div>
      <div className="whitespace-pre-wrap">{main}</div>
      <div className="mt-3 border-t border-[var(--border)]/80 pt-3">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          接一句
        </p>
        <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--muted)]">
          {followup}
        </p>
      </div>
    </div>
  );
}

export function ChatPanel() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: Role; content: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastUserTextRef = useRef<string>("");
  const lastUserMessagesRef = useRef<{ role: Role; content: string }[]>([]);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const friendlyError = useCallback((msg: string) => {
    const m = msg || "请求失败";
    if (m.includes("OPENAI_API_KEY")) return "服务器未配置接口密钥，请先配置环境变量。";
    if (m.includes("401")) return "鉴权失败（401）。请检查 API Key / Base URL / 模型配置。";
    if (m.includes("429")) return "请求太频繁（429）。稍后再试。";
    if (m.toLowerCase().includes("timeout")) return "请求超时。请检查网络后重试。";
    return m;
  }, []);

  const sendText = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || loading) return;

      setError(null);
      setInput("");
      const userMessage: { role: Role; content: string } = {
        role: "user",
        content: text,
      };
      const nextMessages = [...messages, userMessage];
      lastUserTextRef.current = text;
      lastUserMessagesRef.current = nextMessages;
      setMessages(nextMessages);
      setLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextMessages }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(data.error || `请求失败（${res.status}）`);
        }

        const reader = res.body?.getReader();
        if (!reader) {
          throw new Error("无法读取回复流");
        }

        const decoder = new TextDecoder();
        let assistantText = "";

        setMessages([...nextMessages, { role: "assistant", content: "" }]);
        scrollToBottom();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantText += decoder.decode(value, { stream: true });
          setMessages([
            ...nextMessages,
            { role: "assistant", content: assistantText },
          ]);
          scrollToBottom();
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") {
          // 用户中止：保留已生成内容，不显示错误
          return;
        }
        const msg = e instanceof Error ? e.message : "请求失败";
        setError(friendlyError(msg));
        setMessages(nextMessages);
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [friendlyError, loading, messages, scrollToBottom]
  );

  const send = async () => {
    await sendText(input);
  };

  const clear = () => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setInput("");
  };

  const stop = () => {
    abortRef.current?.abort();
  };

  const retry = () => {
    const text = lastUserTextRef.current;
    if (!text || loading) return;
    setMessages(lastUserMessagesRef.current);
    setError(null);
    void sendText(text);
  };

  const prompts = useMemo(
    () => [
      "用 3 句话总结你自己",
      "挑一个 vibe coding 项目讲亮点与难点",
      "建筑作品里你最满意的是哪个？为什么？",
      "你的实习主要负责什么？产出是什么？",
      "你最擅长的 3 个能力是什么？",
      "如果我想和你合作，应该怎么开始？",
    ],
    []
  );

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <div className="max-h-[min(420px,50vh)] space-y-4 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[var(--foreground)]">
                想聊啥都行：作品亮点、经历细节、技能栈、合作方式……随便点下面一句也行。
              </p>
              <p className="text-sm text-[var(--muted)]">
                我会主要依据站长在本站公开的简介和整理好的资料来答；没写到的细节我可能帮不上，提前说声抱歉啦～
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {prompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  disabled={loading}
                  onClick={() => void sendText(p)}
                  className="rounded-full border border-[var(--border)] bg-[var(--background)]/50 px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--background)] disabled:opacity-60"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {messages.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--border)]/60 text-[var(--foreground)]"
              }`}
            >
              {m.role === "user" ? (
                <span className="whitespace-pre-wrap">{m.content}</span>
              ) : !m.content && loading ? (
                "…"
              ) : (
                <AssistantMessageBody content={m.content} />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error ? (
        <div className="border-t border-[var(--border)] px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={retry}
                disabled={loading || !lastUserTextRef.current}
                className="rounded-lg border border-[var(--border)] bg-[var(--background)]/60 px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] transition hover:bg-[var(--background)] disabled:opacity-50"
              >
                重试
              </button>
              <button
                type="button"
                onClick={() => setError(null)}
                disabled={loading}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--muted)] hover:bg-[var(--border)]/40 disabled:opacity-50"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-[var(--border)] p-4 sm:flex-row sm:items-end sm:p-6">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          placeholder="输入你的问题…（Enter 发送，Shift+Enter 换行）"
          rows={3}
          disabled={loading}
          className="min-h-[88px] flex-1 resize-y rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-60"
        />
        <div className="flex shrink-0 gap-2 sm:flex-col">
          <button
            type="button"
            onClick={() => void send()}
            disabled={loading || !input.trim()}
            className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "生成中…" : "发送"}
          </button>
          <button
            type="button"
            onClick={stop}
            disabled={!loading}
            className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--border)]/50 disabled:opacity-50"
          >
            停止
          </button>
          <button
            type="button"
            onClick={clear}
            disabled={loading}
            className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--border)]/50 disabled:opacity-50"
          >
            清空对话
          </button>
        </div>
      </div>
    </div>
  );
}
