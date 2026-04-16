import Link from "next/link";

import { adminLogout } from "@/app/admin/login/actions";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type ConversationRow = { id: string; title: string | null; updated_at: string };
type EvalRunRow = { id: string; created_at: string; prompt_version: string; target_model: string };
type IterRow = { id: string; updated_at: string; status: string; title: string };
type BadCaseRow = { id: string; created_at: string; status: string };

function fmt(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString("zh-CN", { hour12: false });
}

export default async function AdminHomePage() {
  let errorMessage: string | null = null;
  let conversations: ConversationRow[] = [];
  let runs: EvalRunRow[] = [];
  let iterations: IterRow[] = [];
  let badCases: BadCaseRow[] = [];

  try {
    const supabase = getSupabaseAdmin();
    const [c1, c2, c3, c4] = await Promise.all([
      supabase
        .from("conversations")
        .select("id,title,updated_at")
        .order("updated_at", { ascending: false })
        .limit(3),
      supabase
        .from("eval_runs")
        .select("id,created_at,prompt_version,target_model")
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("prompt_iterations")
        .select("id,updated_at,status,title")
        .order("updated_at", { ascending: false })
        .limit(3),
      supabase
        .from("bad_cases")
        .select("id,created_at,status")
        .order("created_at", { ascending: false })
        .limit(3),
    ]);
    if (c1.error) errorMessage = c1.error.message;
    if (c2.error) errorMessage = errorMessage ?? c2.error.message;
    if (c3.error) errorMessage = errorMessage ?? c3.error.message;
    if (c4.error) errorMessage = errorMessage ?? c4.error.message;
    conversations = (c1.data ?? []) as ConversationRow[];
    runs = (c2.data ?? []) as EvalRunRow[];
    iterations = (c3.data ?? []) as IterRow[];
    badCases = (c4.data ?? []) as BadCaseRow[];
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "读取 Supabase 失败";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            后台
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            对话、评测、prompt 迭代的统一入口。
          </p>
        </div>
        <form action={adminLogout} className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            ← 首页
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

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/conversations"
          className="group rounded-3xl border-2 border-border bg-card p-6 shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-chunky"
        >
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Conversations
          </div>
          <div className="mt-2 font-display text-xl font-extrabold text-foreground group-hover:text-accent">
            对话列表
          </div>
          <div className="mt-2 text-sm text-muted">查看与回放历史对话。</div>
        </Link>

        <Link
          href="/admin/evals"
          className="group rounded-3xl border-2 border-border bg-card p-6 shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-chunky"
        >
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Evals
          </div>
          <div className="mt-2 font-display text-xl font-extrabold text-foreground group-hover:text-accent">
            评测 Runs
          </div>
          <div className="mt-2 text-sm text-muted">查看每次评测的结果与失败原因。</div>
        </Link>

        <Link
          href="/admin/prompt-iterations"
          className="group rounded-3xl border-2 border-border bg-card p-6 shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-chunky"
        >
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Prompt Iterations
          </div>
          <div className="mt-2 font-display text-xl font-extrabold text-foreground group-hover:text-accent">
            迭代清单
          </div>
          <div className="mt-2 text-sm text-muted">记录每次 prompt 改动与指标变化。</div>
        </Link>
      </div>

      <div className="mt-4">
        <Link
          href="/admin/bad-cases"
          className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        >
          → Bad cases（回流池）
          {badCases.length ? (
            <span className="ml-1 rounded-full bg-border/50 px-2 py-0.5 text-xs font-extrabold text-foreground">
              {badCases.filter((b) => b.status === "open").length} open
            </span>
          ) : null}
        </Link>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border-2 border-border bg-card p-6 shadow-chunky-sm">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            最近对话（最新 3 条）
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {conversations.length === 0 ? (
              <li className="text-muted">暂无数据</li>
            ) : (
              conversations.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-3">
                  <span className="min-w-0 truncate font-semibold text-foreground">
                    {c.title || "（未命名）"}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-muted">
                    {fmt(c.updated_at)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-3xl border-2 border-border bg-card p-6 shadow-chunky-sm">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            最近评测（最新 3 条）
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {runs.length === 0 ? (
              <li className="text-muted">暂无数据</li>
            ) : (
              runs.map((r) => (
                <li key={r.id} className="flex items-start justify-between gap-3">
                  <span className="min-w-0 truncate font-semibold text-foreground">
                    {r.prompt_version} · {r.target_model}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-muted">
                    {fmt(r.created_at)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-3xl border-2 border-border bg-card p-6 shadow-chunky-sm">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            最近迭代（最新 3 条）
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {iterations.length === 0 ? (
              <li className="text-muted">暂无数据</li>
            ) : (
              iterations.map((it) => (
                <li key={it.id} className="flex items-start justify-between gap-3">
                  <span className="min-w-0 truncate font-semibold text-foreground">
                    {it.status} · {it.title}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-muted">
                    {fmt(it.updated_at)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

