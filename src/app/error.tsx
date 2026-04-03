"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
        页面出错了
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        你可以重试一次。如果持续出现，请把控制台/终端报错发我。
      </p>
      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
        >
          重试
        </button>
        <Link
          href="/"
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--border)]/40"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}

