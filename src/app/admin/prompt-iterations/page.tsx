import Link from "next/link";

import { adminLogout } from "@/app/admin/login/actions";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type IterRow = {
  id: string;
  created_at: string;
  updated_at: string;
  status: "todo" | "in_progress" | "done";
  title: string;
  rule_pass_rate_before: number | null;
  rule_pass_rate_after: number | null;
  avg_judge_overall_before: number | null;
  avg_judge_overall_after: number | null;
};

function fmt(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString("zh-CN", { hour12: false });
}

function badge(status: IterRow["status"]) {
  if (status === "done")
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200";
  if (status === "in_progress")
    return "bg-warm/20 text-foreground dark:bg-warm/25";
  return "bg-border/40 text-muted";
}

export default async function PromptIterationsPage() {
  let items: IterRow[] = [];
  let errorMessage: string | null = null;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("prompt_iterations")
      .select(
        "id,created_at,updated_at,status,title,rule_pass_rate_before,rule_pass_rate_after,avg_judge_overall_before,avg_judge_overall_after"
      )
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) errorMessage = error.message;
    items = (data ?? []) as IterRow[];
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "读取 Supabase 失败";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            Prompt 迭代清单
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            记录每次迭代目标、改动点，以及评测指标的 before/after。
          </p>
        </div>
        <form action={adminLogout} className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            ← 后台首页
          </Link>
          <Link
            href="/admin/evals"
            className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            ← 评测 Runs
          </Link>
          <Link
            href="/admin/prompt-iterations/new"
            className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-chunky-sm transition hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-chunky"
          >
            + 新建
          </Link>
          <button
            type="submit"
            className="rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            退出
          </button>
        </form>
      </div>

      {errorMessage ? (
        <div className="mt-6 rounded-3xl border-2 border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          读取 Supabase 失败：{errorMessage}
        </div>
      ) : null}

      <div className="mt-8 overflow-hidden rounded-3xl border-2 border-border bg-card shadow-chunky-sm">
        <ul className="divide-y divide-border/70">
          {items.length === 0 ? (
            <li className="p-6 text-sm text-muted">暂无迭代记录。</li>
          ) : (
            items.map((it) => (
              <li key={it.id} className="p-5 sm:p-6">
                <Link
                  href={`/admin/prompt-iterations/${it.id}`}
                  className="group block"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badge(
                            it.status
                          )}`}
                        >
                          {it.status}
                        </span>
                        <div className="truncate font-display text-base font-extrabold text-foreground group-hover:text-accent">
                          {it.title}
                        </div>
                      </div>
                      <div className="mt-1 text-xs font-semibold text-muted">
                        更新：{fmt(it.updated_at)} · 创建：{fmt(it.created_at)}
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-muted">
                      <div>
                        rule: {it.rule_pass_rate_before ?? "-"} →{" "}
                        {it.rule_pass_rate_after ?? "-"}
                      </div>
                      <div className="mt-1">
                        judge: {it.avg_judge_overall_before ?? "-"} →{" "}
                        {it.avg_judge_overall_after ?? "-"}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

