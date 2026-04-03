"use client";

import Link from "next/link";

import "./globals.css";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="text-2xl font-bold tracking-tight">应用出错了</h1>
          <p className="mt-3 text-sm text-muted">
            你可以重试一次。如果持续出现，请把控制台/终端报错发我。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-2xl bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-chunky-sm"
            >
              重试
            </button>
            <Link
              href="/"
              className="rounded-2xl border-2 border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground shadow-chunky-sm"
            >
              返回首页
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
