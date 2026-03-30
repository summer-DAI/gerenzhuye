import Image from "next/image";
import Link from "next/link";

import type { Profile } from "@/types/content";

function normalizeXhsHandle(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  return v.startsWith("@") ? v.slice(1) : v;
}

export function Hero({ profile }: { profile: Profile }) {
  const greeting = profile.greeting ?? "你好，我是";
  const hasImage = Boolean(profile.heroImage);
  const xhsHandle = profile.xiaohongshu ? normalizeXhsHandle(profile.xiaohongshu) : "";
  const github = profile.links.find((l) => l.label.toLowerCase() === "github")?.href;

  return (
    <section className="border-b border-[var(--border)] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div
        className={`mx-auto grid max-w-6xl gap-10 lg:items-center ${hasImage ? "lg:grid-cols-2 lg:gap-14" : ""}`}
      >
        <div className="order-2 lg:order-1">
          <p className="text-lg text-[var(--muted)] sm:text-xl">
            {greeting}{" "}
            <span className="font-bold text-[var(--foreground)]">
              {profile.name}
            </span>
          </p>
          <p className="mt-1 text-sm font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
            {profile.title}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
            {profile.tagline}
          </h1>
          {profile.badge ? (
            <p className="mt-6 inline-block max-w-xl rounded-xl bg-neutral-900 px-4 py-2.5 text-sm leading-snug text-white shadow-sm dark:bg-white dark:text-neutral-900">
              {profile.badge}
            </p>
          ) : null}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            {profile.bio}
          </p>
          <div id="contact" className="mt-6 flex flex-wrap gap-2">
            {profile.phone ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)]">
                <span aria-hidden>☎</span>
                {profile.phone}
              </span>
            ) : null}
            {profile.showEmail && profile.email ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)]">
                <span aria-hidden>✉</span>
                {profile.email}
              </span>
            ) : null}
            {github ? (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <span aria-hidden>⌂</span>
                GitHub
              </a>
            ) : null}
            {xhsHandle ? (
              <a
                href={profile.xiaohongshuUrl || "https://www.xiaohongshu.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <span aria-hidden>⧉</span>
                小红书 @{xhsHandle}
              </a>
            ) : null}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#experience"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-800 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-700 dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-white"
            >
              <span aria-hidden>▦</span>
              经历
            </Link>
            <Link
              href="/#vibe"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600"
            >
              <span aria-hidden>{"</>"}</span>
              vibe coding作品
            </Link>
            <Link
              href="/#architecture"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700"
            >
              <span aria-hidden>▦</span>
              建筑设计作品
            </Link>
          </div>
        </div>
        {hasImage && profile.heroImage ? (
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-[var(--border)]/40 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
              <Image
                src={profile.heroImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 400px"
                priority
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
