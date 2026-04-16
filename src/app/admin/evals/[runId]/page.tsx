import Link from "next/link";
import { notFound } from "next/navigation";

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

type EvalCaseRow = {
  case_id: string;
  category: string;
  expected_behavior: string;
  user_input: string;
  assistant_output: string;
  rule_pass: boolean;
  rule_fail_reasons: unknown;
  judge_score_overall: number | null;
  judge_scores: any;
  judge_rationale: string | null;
  latency_ms: number | null;
};

function fmt(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString("zh-CN", { hour12: false });
}

function pct(n: number) {
  return `${Math.round(n * 1000) / 10}%`;
}

export default async function AdminEvalRunPage({
  params,
  searchParams,
}: {
  params: Promise<{ runId: string }>;
  searchParams?: Promise<{ category?: string }>;
}) {
  const { runId } = await params;
  if (!runId) return notFound();
  const sp = (await searchParams) ?? {};
  const categoryFilter = sp.category?.trim() || "";

  let supabase: ReturnType<typeof getSupabaseAdmin>;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "读取 Supabase 失败";
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border-2 border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          读取 Supabase 失败：{msg}
        </div>
      </div>
    );
  }

  const { data: run, error: runErr } = await supabase
    .from("eval_runs")
    .select("id,created_at,prompt_version,knowledge_hash,target_model,judge_model,notes")
    .eq("id", runId)
    .maybeSingle();

  if (runErr) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border-2 border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          读取 Run 失败：{runErr.message}
        </div>
      </div>
    );
  }
  if (!run) return notFound();

  let query = supabase
    .from("eval_case_results")
    .select(
      "case_id,category,expected_behavior,user_input,assistant_output,rule_pass,rule_fail_reasons,judge_score_overall,judge_scores,judge_rationale,latency_ms"
    )
    .eq("run_id", runId)
    .order("case_id", { ascending: true })
    .limit(200);
  if (categoryFilter) query = query.eq("category", categoryFilter);

  const { data: rows, error } = await query;
  const cases = (rows ?? []) as EvalCaseRow[];

  const total = cases.length;
  const passed = cases.filter((c) => c.rule_pass).length;
  const avgJudge = (() => {
    const nums = cases
      .map((c) => (typeof c.judge_score_overall === "number" ? c.judge_score_overall : null))
      .filter((x): x is number => x !== null);
    if (!nums.length) return null;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  })();

  const runRow = run as EvalRunRow;

  const categories = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <Link
            href="/admin/evals"
            className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            ← 返回 Runs
          </Link>
          <h1 className="font-display mt-6 truncate text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {runRow.prompt_version} · {runRow.target_model}
          </h1>
          <p className="mt-2 text-xs font-semibold text-muted">
            runId: {runRow.id}
          </p>
          <p className="mt-2 text-xs font-semibold text-muted">
            时间：{fmt(runRow.created_at)} · judge：{runRow.judge_model} · knowledge：
            {runRow.knowledge_hash.slice(0, 12)}…
          </p>
          {runRow.notes ? (
            <p className="mt-3 text-sm text-muted">{runRow.notes}</p>
          ) : null}
        </div>
        <form action={adminLogout} className="flex items-center gap-2">
          <Link
            href="/admin/conversations"
            className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            ← 对话
          </Link>
          <button
            type="submit"
            className="rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            退出
          </button>
        </form>
      </div>

      {error ? (
        <div className="mt-6 rounded-3xl border-2 border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          读取用例结果失败：{error.message}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky-sm">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Rule Pass
          </div>
          <div className="mt-2 font-display text-2xl font-extrabold text-foreground">
            {passed}/{total}
          </div>
          <div className="mt-1 text-xs font-semibold text-muted">
            {total ? pct(passed / total) : "-"}
          </div>
        </div>
        <div className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky-sm">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Avg Judge
          </div>
          <div className="mt-2 font-display text-2xl font-extrabold text-foreground">
            {avgJudge === null ? "-" : avgJudge.toFixed(2)}
          </div>
          <div className="mt-1 text-xs font-semibold text-muted">
            0–10（overall）
          </div>
        </div>
        <div className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky-sm">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Filter
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={`/admin/evals/${runId}`}
              className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold shadow-chunky-sm transition ${
                !categoryFilter
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : "border-border bg-background/70 text-muted hover:border-accent/40 hover:text-accent"
              }`}
            >
              全部
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/admin/evals/${runId}?category=${c}`}
                className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold shadow-chunky-sm transition ${
                  categoryFilter === c
                    ? "border-accent/50 bg-accent/10 text-accent"
                    : "border-border bg-background/70 text-muted hover:border-accent/40 hover:text-accent"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky-sm">
        <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
          Categories（A–F 代表什么）
        </div>
        <div className="mt-3 grid gap-3 text-sm text-foreground sm:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
            <div className="font-bold">A · 基础事实</div>
            <div className="mt-1 text-xs text-muted">
              姓名/职位/联系方式/GitHub/账号等硬信息是否准确。
            </div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
            <div className="font-bold">B · 知识库命中</div>
            <div className="mt-1 text-xs text-muted">
              知识库里“可答但容易漏”的细节能否被稳定提取并回答。
            </div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
            <div className="font-bold">C · 不可答拒答</div>
            <div className="mt-1 text-xs text-muted">
              知识库没写到时，是否明确说“资料中未提及/不清楚”，不瞎编。
            </div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
            <div className="font-bold">D · 对抗诱导</div>
            <div className="mt-1 text-xs text-muted">
              用户诱导/塞入不存在经历时，是否能拒绝或纠正，不顺着编。
            </div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
            <div className="font-bold">E · 追问协议</div>
            <div className="mt-1 text-xs text-muted">
              需要追问时是否使用 `---` 单行分隔（且次数正确）。
            </div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
            <div className="font-bold">F · 风格控制</div>
            <div className="mt-1 text-xs text-muted">
              是否更像私信聊天（短句、少公文化），避免“综上所述/本报告”等官话。
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {cases.length === 0 ? (
          <div className="rounded-3xl border-2 border-border bg-card p-6 text-sm text-muted shadow-chunky-sm">
            暂无用例结果。
          </div>
        ) : (
          cases.map((c) => (
            <div
              key={c.case_id}
              className="rounded-3xl border-2 border-border bg-card p-5 shadow-chunky-sm"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        c.rule_pass
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                          : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
                      }`}
                    >
                      {c.rule_pass ? "PASS" : "FAIL"}
                    </span>
                    <span className="rounded-full bg-border/40 px-2.5 py-0.5 text-xs font-bold text-muted">
                      {c.case_id} · {c.category}
                    </span>
                    <span className="rounded-full bg-accent/12 px-2.5 py-0.5 text-xs font-bold text-foreground dark:bg-accent/18">
                      {c.expected_behavior}
                    </span>
                    {typeof c.judge_score_overall === "number" ? (
                      <span className="rounded-full bg-warm/15 px-2.5 py-0.5 text-xs font-bold text-foreground">
                        judge {c.judge_score_overall}
                      </span>
                    ) : null}
                    {typeof c.latency_ms === "number" ? (
                      <span className="text-xs font-semibold text-muted">
                        {c.latency_ms}ms
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-3 text-sm font-bold text-foreground">
                    Q: {c.user_input}
                  </div>
                </div>
                {c.judge_scores ? (
                  <div className="text-xs font-semibold text-muted">
                    <div>factuality: {c.judge_scores.factuality ?? "-"}</div>
                    <div>style: {c.judge_scores.style ?? "-"}</div>
                    <div>format: {c.judge_scores.format ?? "-"}</div>
                  </div>
                ) : null}
              </div>

              {!c.rule_pass && c.rule_fail_reasons ? (
                <pre className="mt-4 overflow-auto rounded-2xl border border-border/70 bg-background/70 p-3 text-xs text-muted">
                  {JSON.stringify(c.rule_fail_reasons, null, 2)}
                </pre>
              ) : null}

              {c.judge_rationale ? (
                <div className="mt-4 rounded-2xl border border-border/70 bg-background/70 p-3 text-xs text-muted">
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                    Judge
                  </div>
                  {c.judge_rationale}
                </div>
              ) : null}

              <details className="mt-4">
                <summary className="cursor-pointer text-xs font-bold text-accent">
                  展开模型输出
                </summary>
                <div className="mt-3 whitespace-pre-wrap rounded-2xl border border-border/70 bg-background/80 p-4 text-sm text-foreground">
                  {c.assistant_output}
                </div>
              </details>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

