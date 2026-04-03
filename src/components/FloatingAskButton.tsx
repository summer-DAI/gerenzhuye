"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const MotionLink = motion(Link);

export function FloatingAskButton() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const storageKey = "ask_fab_hint_dismissed_at";
  const hintTtlMs = 7 * 24 * 60 * 60 * 1000;
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const dismissedAt = raw ? Number(raw) : 0;
      const now = Date.now();
      if (
        !dismissedAt ||
        Number.isNaN(dismissedAt) ||
        now - dismissedAt > hintTtlMs
      ) {
        setShowHint(true);
      }
    } catch {
      setShowHint(true);
    }
  }, [hintTtlMs]);

  const dismissHint = () => {
    setShowHint(false);
    try {
      window.localStorage.setItem(storageKey, String(Date.now()));
    } catch {
      // ignore
    }
  };

  if (pathname === "/ask") return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <MotionLink
        href="/ask"
        aria-label="问我：自由对话了解更多"
        className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent via-emerald-500 to-warm text-white shadow-[0_14px_36px_rgba(24,160,88,0.45)] ring-2 ring-white/25 drop-shadow-sm dark:ring-white/10"
        title="问我：自由对话了解更多"
        onClick={dismissHint}
        whileHover={
          reduceMotion ? undefined : { y: -4, scale: 1.06, rotate: -2 }
        }
        whileTap={reduceMotion ? undefined : { scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_55%)] opacity-90"
        />
        <span
          aria-hidden
          className="absolute -inset-1 rounded-full bg-gradient-to-br from-accent via-emerald-400 to-warm blur-xl opacity-0 transition group-hover:opacity-45"
        />
        <span className="relative font-display text-lg font-extrabold">AI</span>

        <span className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 hidden -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-2xl border-2 border-border bg-background/95 px-3 py-2 text-sm font-bold text-foreground shadow-chunky-sm backdrop-blur-md group-hover:flex">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
            ?
          </span>
          问我：自由对话了解更多
        </span>
      </MotionLink>

      {showHint ? (
        <div className="absolute bottom-16 right-0 w-[260px] rounded-3xl border-2 border-border bg-background/98 p-3 text-sm text-foreground shadow-chunky backdrop-blur-md">
          <div className="flex items-start justify-between gap-2">
            <div className="font-bold">可以问我任何问题</div>
            <button
              type="button"
              onClick={dismissHint}
              className="rounded-xl px-2 py-1 text-xs font-bold text-muted hover:bg-border/40 hover:text-foreground"
              aria-label="关闭提示"
            >
              ×
            </button>
          </div>
          <div className="mt-2 space-y-1 text-xs leading-relaxed text-muted">
            <div>例如：作品亮点 / 实习做了什么 / 擅长什么</div>
            <div className="hidden sm:block">把鼠标移上按钮也能看到提示。</div>
          </div>
          <div
            aria-hidden
            className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 border-b-2 border-r-2 border-border bg-background/98"
          />
        </div>
      ) : null}
    </div>
  );
}
