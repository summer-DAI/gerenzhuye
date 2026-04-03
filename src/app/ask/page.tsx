import Link from "next/link";

import { ChatPanel } from "@/components/ChatPanel";

export default function AskPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        >
          ← 返回首页
        </Link>
        <h1 className="font-display mt-6 text-3xl font-extrabold tracking-tight text-foreground">
          问我
        </h1>
        <p className="mt-3 leading-relaxed text-muted">
          想聊作品、经历、技能或者合作方式都可以，随便问～我会根据站长在本站公开的简介和资料来回答；资料里没写到的，我会直说「不清楚」，不瞎编。
        </p>
      </div>
      <ChatPanel />
    </div>
  );
}
