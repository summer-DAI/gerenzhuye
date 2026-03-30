"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { ExperienceItem } from "@/types/content";

type Tab = "education" | "internship";

function kindLabel(kind: ExperienceItem["kind"]) {
  if (kind === "education") return "教育";
  if (kind === "campus") return "校园";
  return "实习";
}

function kindChipClass(kind: ExperienceItem["kind"]) {
  if (kind === "education") {
    return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200";
  }
  if (kind === "campus") {
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200";
  }
  return "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200";
}

function timelineIcon(kind: ExperienceItem["kind"]) {
  if (kind === "education") return "学";
  if (kind === "campus") return "校";
  return "职";
}

export function ExperienceSection({ items }: { items: ExperienceItem[] }) {
  const [tab, setTab] = useState<Tab>("education");

  const { educationItems, internshipItems } = useMemo(() => {
    const educationItems = items.filter(
      (i) => i.kind === "education" || i.kind === "campus"
    );
    const internshipItems = items.filter((i) => i.kind === "internship");

    // 简单倒序（基于字符串，建议 dateRange 统一格式）
    const sortDesc = (a: ExperienceItem, b: ExperienceItem) =>
      b.dateRange.localeCompare(a.dateRange, "zh");

    educationItems.sort(sortDesc);
    internshipItems.sort(sortDesc);

    return { educationItems, internshipItems };
  }, [items]);

  const list = tab === "education" ? educationItems : internshipItems;
  if (list.length === 0) return null;

  return (
    <section
      id="experience"
      className="scroll-mt-20 border-t border-[var(--border)] bg-[var(--card)]/30 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
              经历
            </h2>
            <p className="mt-2 text-[var(--muted)]">教育与实习（时间轴）</p>
          </div>
          <div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--card)] p-1">
            <button
              type="button"
              onClick={() => setTab("education")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === "education"
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "text-[var(--muted)] hover:bg-[var(--border)]/40 hover:text-[var(--foreground)]"
              }`}
            >
              教育
            </button>
            <button
              type="button"
              onClick={() => setTab("internship")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === "internship"
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "text-[var(--muted)] hover:bg-[var(--border)]/40 hover:text-[var(--foreground)]"
              }`}
            >
              实习
            </button>
          </div>
        </div>

        <ol className="relative">
          <div className="absolute bottom-0 left-[108px] top-0 hidden w-px bg-[var(--border)] sm:block" />
          <div className="space-y-8">
            {list.map((item, idx) => (
              <li key={`${item.organization}-${idx}`} className="relative">
                <div className="grid gap-4 sm:grid-cols-[96px_24px_1fr] sm:items-start">
                  <p className="text-sm font-medium text-[var(--muted)] sm:text-right">
                    {item.dateRange}
                  </p>

                  <div className="hidden sm:flex sm:flex-col sm:items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--muted)]">
                      {timelineIcon(item.kind)}
                    </div>
                    <div className="mt-2 flex-1" />
                  </div>

                  <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {item.logo ? (
                          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-[var(--border)]/50 ring-1 ring-black/5 dark:ring-white/10">
                            <Image
                              src={item.logo}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                        ) : null}
                        <div>
                          <h3 className="text-lg font-semibold text-[var(--foreground)]">
                            {item.organization}
                          </h3>
                          <p className="mt-0.5 text-sm font-medium text-[var(--foreground)]/90">
                            {item.role}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${kindChipClass(
                          item.kind
                        )}`}
                      >
                        {kindLabel(item.kind)}
                      </span>
                    </div>

                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
                      {item.bullets.map((b, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--muted)]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    {item.href ? (
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline"
                      >
                        查看更多
                        <span aria-hidden>→</span>
                      </Link>
                    ) : null}
                  </article>
                </div>
              </li>
            ))}
          </div>
        </ol>
      </div>
    </section>
  );
}
