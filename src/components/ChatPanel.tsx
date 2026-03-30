"use client";

import { useCallback, useRef, useState } from "react";

type Role = "user" | "assistant";

export function ChatPanel() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: Role; content: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    setInput("");
    const userMessage: { role: Role; content: string } = {
      role: "user",
      content: text,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `请求失败（${res.status}）`);
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("无法读取回复流");
      }

      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages([...nextMessages, { role: "assistant", content: "" }]);

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
      const msg = e instanceof Error ? e.message : "请求失败";
      setError(msg);
      setMessages(nextMessages);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setMessages([]);
    setError(null);
    setInput("");
  };

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <div className="max-h-[min(420px,50vh)] space-y-4 overflow-y-auto p-4 sm:p-6">
        {messages.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            在下方输入问题。回答仅依据你在{" "}
            <code className="rounded bg-[var(--border)] px-1 py-0.5 text-xs">
              content/knowledge.md
            </code>{" "}
            与{" "}
            <code className="rounded bg-[var(--border)] px-1 py-0.5 text-xs">
              content/profile.json
            </code>{" "}
            中的内容。
          </p>
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
              {m.content || (m.role === "assistant" && loading ? "…" : null)}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error ? (
        <div className="border-t border-[var(--border)] px-4 py-2 text-sm text-red-600 dark:text-red-400 sm:px-6">
          {error}
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
