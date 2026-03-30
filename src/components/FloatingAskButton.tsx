"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function FloatingAskButton() {
  const pathname = usePathname();
  if (pathname === "/ask") return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="/ask"
        aria-label="问我：自由对话了解更多"
        className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-fuchsia-600 to-orange-500 text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] ring-1 ring-black/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.22)] active:translate-y-0 active:scale-[0.98] dark:ring-white/10"
        title="问我：自由对话了解更多"
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_55%)] opacity-90"
        />
        <span
          aria-hidden
          className="absolute -inset-1 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 blur-xl opacity-0 transition group-hover:opacity-40"
        />
        <span className="relative text-lg font-bold">AI</span>

        <span className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 hidden -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-2xl border border-[var(--border)] bg-[var(--background)]/90 px-3 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm backdrop-blur-md group-hover:flex">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--border)]/60 text-xs text-[var(--muted)]">
            ?
          </span>
          问我：自由对话了解更多
        </span>
      </Link>
    </div>
  );
}

