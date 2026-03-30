import Link from "next/link";

import { ChatPanel } from "@/components/ChatPanel";

export default function AskPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        >
          ← 返回首页
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)]">
          问我
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          回答由大模型根据你仓库中的知识库生成；修改{" "}
          <code className="rounded bg-[var(--border)] px-1 py-0.5 text-xs">
            content/knowledge.md
          </code>{" "}
          后重新部署即可更新。
        </p>
      </div>
      <ChatPanel />
    </div>
  );
}
