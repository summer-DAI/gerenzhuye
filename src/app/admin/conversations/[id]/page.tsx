import Link from "next/link";
import { notFound } from "next/navigation";

import { adminLogout } from "@/app/admin/login/actions";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

type MessageRow = {
  idx: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

function fmt(ts: string) {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString("zh-CN", { hour12: false });
}

export default async function AdminConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();

  let supabase: ReturnType<typeof getSupabaseAdmin> | null = null;
  try {
    supabase = getSupabaseAdmin();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "读取 Supabase 失败";
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border-2 border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          读取 Supabase 失败：{msg}
        </div>
      </div>
    );
  }

  const { data: convo, error: convoErr } = await supabase
    .from("conversations")
    .select("id,title,created_at,updated_at")
    .eq("id", id)
    .maybeSingle();

  if (convoErr) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-3xl border-2 border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          读取会话失败：{convoErr.message}
        </div>
      </div>
    );
  }
  if (!convo) return notFound();

  const { data: messages, error } = await supabase
    .from("conversation_messages")
    .select("idx,role,content,created_at")
    .eq("conversation_id", id)
    .order("idx", { ascending: true })
    .limit(500);

  const list = (messages ?? []) as MessageRow[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <Link
            href="/admin/conversations"
            className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            ← 返回列表
          </Link>
          <h1 className="font-display mt-6 truncate text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {convo.title || "（未命名）"}
          </h1>
          <p className="mt-2 text-xs font-semibold text-muted">
            {convo.id}
          </p>
          <p className="mt-2 text-xs font-semibold text-muted">
            创建：{fmt(convo.created_at)} · 更新：{fmt(convo.updated_at)}
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

      {error ? (
        <div className="mt-6 rounded-3xl border-2 border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          读取消息失败：{error.message}
        </div>
      ) : null}

      <div className="mt-8 space-y-4">
        {list.length === 0 ? (
          <div className="rounded-3xl border-2 border-border bg-card p-6 text-sm text-muted shadow-chunky-sm">
            暂无消息。
          </div>
        ) : (
          list.map((m) => (
            <div
              key={m.idx}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[92%] whitespace-pre-wrap rounded-3xl border-2 px-4 py-3 text-sm leading-relaxed shadow-chunky-sm ${
                  m.role === "user"
                    ? "border-accent/30 bg-accent text-accent-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.12em] opacity-80">
                  <span>{m.role}</span>
                  <span className="truncate">{fmt(m.created_at)}</span>
                </div>
                {m.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

