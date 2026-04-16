import Link from "next/link";

import { adminLogin } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string; error?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const next = sp.next || "/admin/conversations";
  const error = sp.error || "";

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
      >
        ← 返回首页
      </Link>

      <h1 className="font-display mt-6 text-3xl font-extrabold tracking-tight text-foreground">
        管理员登录
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        输入 ADMIN_TOKEN 进入对话列表（仅自己查看）。
      </p>

      {error ? (
        <div className="mt-4 rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {error === "missing_token"
            ? "服务器未配置 ADMIN_TOKEN。请先在环境变量中设置。"
            : "Token 不正确。"}
        </div>
      ) : null}

      <form action={adminLogin} className="mt-6 space-y-3">
        <input type="hidden" name="next" value={next} />
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
            ADMIN_TOKEN
          </span>
          <input
            name="token"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
            placeholder="请输入 token"
            required
          />
        </label>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-2xl bg-accent px-5 py-3 text-sm font-bold text-accent-foreground shadow-chunky-sm transition hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-chunky active:translate-y-0.5"
        >
          进入后台
        </button>
      </form>
    </div>
  );
}

