import Link from "next/link";
import { notFound } from "next/navigation";

import { adminLogout } from "@/app/admin/login/actions";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { updatePromptIteration } from "@/app/admin/prompt-iterations/actions";

export const dynamic = "force-dynamic";

type IterRow = {
  id: string;
  created_at: string;
  updated_at: string;
  status: "todo" | "in_progress" | "done";
  title: string;
  goal: string | null;
  changes: string | null;
  run_id_before: string | null;
  run_id_after: string | null;
  rule_pass_rate_before: number | null;
  rule_pass_rate_after: number | null;
  avg_judge_overall_before: number | null;
  avg_judge_overall_after: number | null;
  notes: string | null;
};

function fmt(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString("zh-CN", { hour12: false });
}

export default async function PromptIterationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();

  let row: IterRow | null = null;
  let errorMessage: string | null = null;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("prompt_iterations")
      .select(
        "id,created_at,updated_at,status,title,goal,changes,run_id_before,run_id_after,rule_pass_rate_before,rule_pass_rate_after,avg_judge_overall_before,avg_judge_overall_after,notes"
      )
      .eq("id", id)
      .maybeSingle();
    if (error) errorMessage = error.message;
    row = (data ?? null) as IterRow | null;
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "读取 Supabase 失败";
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border-2 border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          读取失败：{errorMessage}
        </div>
      </div>
    );
  }
  if (!row) return notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <Link
            href="/admin/prompt-iterations"
            className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            ← 返回清单
          </Link>
          <h1 className="font-display mt-6 truncate text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {row.title}
          </h1>
          <p className="mt-2 text-xs font-semibold text-muted">
            更新：{fmt(row.updated_at)} · 创建：{fmt(row.created_at)}
          </p>
        </div>
        <form action={adminLogout} className="flex items-center gap-2">
          <Link
            href="/admin/evals"
            className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            ← 评测
          </Link>
          <button
            type="submit"
            className="rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            退出
          </button>
        </form>
      </div>

      <form action={updatePromptIteration} className="mt-8 space-y-4">
        <input type="hidden" name="id" value={row.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
              状态
            </span>
            <select
              name="status"
              defaultValue={row.status}
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
            >
              <option value="todo">todo</option>
              <option value="in_progress">in_progress</option>
              <option value="done">done</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
              标题
            </span>
            <input
              name="title"
              defaultValue={row.title}
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
              required
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
            目标（goal）
          </span>
          <textarea
            name="goal"
            defaultValue={row.goal ?? ""}
            rows={3}
            className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
            改动点（changes）
          </span>
          <textarea
            name="changes"
            defaultValue={row.changes ?? ""}
            rows={4}
            className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
              before runId
            </span>
            <input
              name="run_id_before"
              defaultValue={row.run_id_before ?? ""}
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
              after runId
            </span>
            <input
              name="run_id_after"
              defaultValue={row.run_id_after ?? ""}
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
              rule pass rate before
            </span>
            <input
              name="rule_pass_rate_before"
              defaultValue={row.rule_pass_rate_before ?? ""}
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
              rule pass rate after
            </span>
            <input
              name="rule_pass_rate_after"
              defaultValue={row.rule_pass_rate_after ?? ""}
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
              avg judge before
            </span>
            <input
              name="avg_judge_overall_before"
              defaultValue={row.avg_judge_overall_before ?? ""}
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
              avg judge after
            </span>
            <input
              name="avg_judge_overall_after"
              defaultValue={row.avg_judge_overall_after ?? ""}
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
            备注（notes）
          </span>
          <textarea
            name="notes"
            defaultValue={row.notes ?? ""}
            rows={3}
            className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
          />
        </label>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-accent-foreground shadow-chunky-sm transition hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-chunky active:translate-y-0.5"
        >
          保存
        </button>
      </form>
    </div>
  );
}

