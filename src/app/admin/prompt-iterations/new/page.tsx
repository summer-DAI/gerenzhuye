import Link from "next/link";

import { createPromptIteration } from "@/app/admin/prompt-iterations/actions";

export const dynamic = "force-dynamic";

export default async function NewPromptIterationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        >
          ← 后台首页
        </Link>
        <Link
          href="/admin/prompt-iterations"
          className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        >
          ← 返回清单
        </Link>
      </div>

      <h1 className="font-display mt-6 text-3xl font-extrabold tracking-tight text-foreground">
        新建迭代记录
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        用于记录一次 prompt 迭代的目标、改动点，以及评测 before/after 指标。
      </p>

      <form action={createPromptIteration} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
              状态
            </span>
            <select
              name="status"
              defaultValue="todo"
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
            >
              <option value="todo">todo</option>
              <option value="in_progress">in_progress</option>
              <option value="done">done</option>
            </select>
          </label>
          <label className="block sm:col-span-1">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
              标题
            </span>
            <input
              name="title"
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
              placeholder="例如：v2 强化拒答与对抗"
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
            rows={3}
            className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
            placeholder="本轮希望提升哪些类别，通过率/风格/格式等"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
            改动点（changes）
          </span>
          <textarea
            name="changes"
            rows={4}
            className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
            placeholder="写清楚 system prompt / few-shot / 规则 / 检索 等改了什么"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
              before runId
            </span>
            <input
              name="run_id_before"
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
              placeholder="eval_runs.id（可空）"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
              after runId
            </span>
            <input
              name="run_id_after"
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
              placeholder="eval_runs.id（可空）"
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
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
              placeholder="例如 0.43（可空）"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
              rule pass rate after
            </span>
            <input
              name="rule_pass_rate_after"
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
              placeholder="例如 0.72（可空）"
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
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
              placeholder="例如 7.86（可空）"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
              avg judge after
            </span>
            <input
              name="avg_judge_overall_after"
              className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
              placeholder="例如 8.30（可空）"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
            备注（notes）
          </span>
          <textarea
            name="notes"
            rows={3}
            className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
            placeholder="可写总结、风险、下一步"
          />
        </label>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-accent-foreground shadow-chunky-sm transition hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-chunky active:translate-y-0.5"
        >
          创建
        </button>
      </form>
    </div>
  );
}

