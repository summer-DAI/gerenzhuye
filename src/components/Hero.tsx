import Image from "next/image";
import Link from "next/link";

import type { Profile } from "@/types/content";

function normalizeXhsHandle(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  return v.startsWith("@") ? v.slice(1) : v;
}

export function Hero({
  profile,
  showProjectExperienceLink = true,
}: {
  profile: Profile;
  /** 无「项目经历」作品时隐藏第四颗按钮 */
  showProjectExperienceLink?: boolean;
}) {
  const greeting = profile.greeting ?? "你好，我是";
  const hasImage = Boolean(profile.heroImage);
  const xhsHandle = profile.xiaohongshu ? normalizeXhsHandle(profile.xiaohongshu) : "";
  const github = profile.links.find((l) => l.label.toLowerCase() === "github")?.href;
  const headline =
    profile.tagline?.trim() ||
    "Bridging Product, Data, and Real‑World Impact";

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
      <div
        className={`mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--card)]/70 p-6 shadow-[0_18px_60px_rgba(11,31,74,0.10)] backdrop-blur-sm sm:p-10 lg:p-12 ${hasImage ? "lg:grid lg:grid-cols-2 lg:items-center lg:gap-14" : ""}`}
      >
        <div className="order-2 lg:order-1">
          <p className="text-sm font-semibold tracking-wide text-[var(--muted)] sm:text-base">
            {greeting}{" "}
            <span className="font-extrabold text-[var(--foreground)]">
              {profile.name}
            </span>
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)] sm:text-sm">
            {profile.title}
          </p>

          <h1 className="mt-6 max-w-xl text-[42px] font-extrabold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-[56px] lg:text-[64px]">
            {headline.split(/\\n+/).map((line, idx) => (
              <span key={idx} className="block">
                {line}
              </span>
            ))}
          </h1>

          {profile.badge ? (
            <p className="mt-5 max-w-xl text-xl font-semibold italic leading-snug text-[var(--accent)] sm:text-2xl">
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
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)]/50 px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--background)]"
            >
              <span aria-hidden>▦</span>
              经历
            </Link>
            {showProjectExperienceLink ? (
              <Link
                href="/projects/project-experience"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)]/50 px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--background)]"
              >
                <span aria-hidden>▦</span>
                项目经历
                <span aria-hidden className="ml-1">
                  →
                </span>
              </Link>
            ) : null}
            <Link
              href="/projects/vibe"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)]/50 px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--background)]"
            >
              <span aria-hidden>{"</>"}</span>
              vibe coding作品
              <span aria-hidden className="ml-1">
                →
              </span>
            </Link>
            <Link
              href="/projects/architecture"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)]/50 px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--background)]"
            >
              <span aria-hidden>▦</span>
              建筑设计作品
              <span aria-hidden className="ml-1">
                →
              </span>
            </Link>
          </div>
        </div>
        {hasImage && profile.heroImage ? (
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-[28px] bg-[var(--border)]/20 shadow-[0_18px_60px_rgba(11,31,74,0.14)] ring-1 ring-black/5 dark:ring-white/10">
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
