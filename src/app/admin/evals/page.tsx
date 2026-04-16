import Link from "next/link";

import { adminLogout } from "@/app/admin/login/actions";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type EvalRunRow = {
  id: string;
  created_at: string;
  prompt_version: string;
  knowledge_hash: string;
  target_model: string;
  judge_model: string;
  notes: string | null;
};

function fmt(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString("zh-CN", { hour12: false });
}

export default async function AdminEvalsPage() {
  let runs: EvalRunRow[] = [];
  let errorMessage: string | null = null;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("eval_runs")
      .select(
        "id,created_at,prompt_version,knowledge_hash,target_model,judge_model,notes"
      )
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) errorMessage = error.message;
    runs = (data ?? []) as EvalRunRow[];
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "读取 Supabase 失败";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            评测 Runs
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            最近 50 次评测（CLI 运行后写入）。点击进入查看详情。
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
            href="/admin/conversations"
            className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            ← 对话列表
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
          {runs.length === 0 ? (
            <li className="p-6 text-sm text-muted">暂无评测记录。</li>
          ) : (
            runs.map((r) => (
              <li key={r.id} className="p-5 sm:p-6">
                <Link href={`/admin/evals/${r.id}`} className="group block">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="truncate font-display text-base font-extrabold text-foreground group-hover:text-accent">
                        {r.prompt_version} · {r.target_model}
                      </div>
                      <div className="mt-1 text-xs font-semibold text-muted">
                        {fmt(r.created_at)}
                      </div>
                      <div className="mt-1 text-[11px] font-semibold text-muted">
                        runId: {r.id}
                      </div>
                      {r.notes ? (
                        <div className="mt-2 line-clamp-2 text-xs text-muted">
                          {r.notes}
                        </div>
                      ) : null}
                    </div>
                    <div className="text-xs font-semibold text-muted">
                      <div>judge: {r.judge_model}</div>
                      <div className="mt-1">knowledge: {r.knowledge_hash.slice(0, 8)}…</div>
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

