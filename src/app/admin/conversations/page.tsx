import Link from "next/link";

import { adminLogout } from "@/app/admin/login/actions";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type ConversationRow = {
  id: string;
  title: string | null;
  updated_at: string;
  created_at: string;
};

function fmt(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString("zh-CN", { hour12: false });
}

export default async function AdminConversationsPage() {
  let conversations: ConversationRow[] = [];
  let errorMessage: string | null = null;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("conversations")
      .select("id,title,updated_at,created_at")
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) errorMessage = error.message;
    conversations = (data ?? []) as ConversationRow[];
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "读取 Supabase 失败";
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            对话列表
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            最近 100 条会话（按更新时间倒序）。点击可查看详情。
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

      <div className="mt-8 overflow-hidden rounded-3xl border-2 border-border bg-card shadow-chunky-sm">
        <ul className="divide-y divide-border/70">
          {conversations.length === 0 ? (
            <li className="p-6 text-sm text-muted">暂无会话。</li>
          ) : (
            conversations.map((c) => (
              <li key={c.id} className="p-5 sm:p-6">
                <Link
                  href={`/admin/conversations/${c.id}`}
                  className="group block"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="truncate font-display text-base font-extrabold text-foreground group-hover:text-accent">
                        {c.title || "（未命名）"}
                      </div>
                      <div className="mt-1 truncate text-xs font-semibold text-muted">
                        {c.id}
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-muted">
                      更新：{fmt(c.updated_at)} · 创建：{fmt(c.created_at)}
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

