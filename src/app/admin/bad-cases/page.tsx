import Link from "next/link";

import { adminLogout } from "@/app/admin/login/actions";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { markBadCaseDone } from "@/app/admin/bad-cases/actions";

export const dynamic = "force-dynamic";

type BadCaseRow = {
  id: string;
  created_at: string;
  status: "open" | "done";
  conversation_id: string;
  conversation_title_snapshot: string | null;
  conversation_updated_at_snapshot: string | null;
  reason: string | null;
};

function fmt(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString("zh-CN", { hour12: false });
}

export default async function AdminBadCasesPage() {
  let items: BadCaseRow[] = [];
  let errorMessage: string | null = null;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("bad_cases")
      .select(
        "id,created_at,status,conversation_id,conversation_title_snapshot,conversation_updated_at_snapshot,reason"
      )
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) errorMessage = error.message;
    items = (data ?? []) as BadCaseRow[];
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "读取 Supabase 失败";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            Bad cases
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            从线上对话勾选记录的 bad case，用于回归与评测集维护。
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
          {items.length === 0 ? (
            <li className="p-6 text-sm text-muted">暂无 bad case。</li>
          ) : (
            items.map((it) => (
              <li key={it.id} className="p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          it.status === "done"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                            : "bg-border/40 text-muted"
                        }`}
                      >
                        {it.status}
                      </span>
                      <Link
                        href={`/admin/conversations/${it.conversation_id}`}
                        className="truncate font-display text-base font-extrabold text-foreground hover:text-accent"
                      >
                        {it.conversation_title_snapshot || "（未命名对话）"}
                      </Link>
                    </div>
                    <div className="mt-1 text-xs font-semibold text-muted">
                      记录：{fmt(it.created_at)}
                      {it.conversation_updated_at_snapshot
                        ? ` · 对话更新：${fmt(it.conversation_updated_at_snapshot)}`
                        : null}
                    </div>
                    {it.reason ? (
                      <div className="mt-3 whitespace-pre-wrap text-sm text-foreground">
                        {it.reason}
                      </div>
                    ) : (
                      <div className="mt-3 text-sm text-muted">（未填写原因）</div>
                    )}
                  </div>

                  {it.status !== "done" ? (
                    <form action={markBadCaseDone} className="shrink-0">
                      <input type="hidden" name="id" value={it.id} />
                      <button
                        type="submit"
                        className="rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                      >
                        标记 done
                      </button>
                    </form>
                  ) : null}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

