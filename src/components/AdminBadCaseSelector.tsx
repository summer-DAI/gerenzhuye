"use client";

import { useMemo, useState } from "react";

import { createBadCases } from "@/app/admin/bad-cases/actions";

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

export function AdminBadCaseSelector({ conversations }: { conversations: ConversationRow[] }) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [reason, setReason] = useState("");

  const selectedIds = useMemo(
    () => Object.entries(selected).filter(([, v]) => v).map(([k]) => k),
    [selected]
  );

  const allChecked = conversations.length > 0 && selectedIds.length === conversations.length;

  return (
    <div className="mt-6 rounded-3xl border-2 border-border bg-card p-5 shadow-chunky-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Bad case 回流
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            勾选会话后可一键记录到 bad_cases（用于后续整理评测用例）。
          </p>
        </div>

        <div className="text-sm font-semibold text-muted">
          已选 {selectedIds.length}/{conversations.length}
        </div>
      </div>

      <form
        action={async (fd) => {
          // Inject selected ids into form data.
          for (const id of selectedIds) fd.append("conversationIds", id);
          fd.set("reason", reason);
          await createBadCases(fd);
          setSelected({});
          setReason("");
        }}
        className="mt-4 space-y-3"
      >
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm text-foreground shadow-chunky-sm outline-none transition focus:border-accent"
          placeholder="（可选）统一原因：例如“拒答没写资料中未提及 / 编造了 URL / 该不该用 --- 不稳定”等"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex select-none items-center gap-2 text-sm font-bold text-muted">
            <input
              type="checkbox"
              checked={allChecked}
              onChange={(e) => {
                const next = e.target.checked;
                const map: Record<string, boolean> = {};
                for (const c of conversations) map[c.id] = next;
                setSelected(map);
              }}
              className="h-4 w-4 rounded border-border"
            />
            全选
          </label>

          <button
            type="submit"
            disabled={selectedIds.length === 0}
            className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-chunky-sm transition hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-chunky disabled:cursor-not-allowed disabled:opacity-50"
          >
            记录为 bad case
          </button>
        </div>

        <div className="mt-2 overflow-hidden rounded-2xl border-2 border-border/70">
          <ul className="divide-y divide-border/70">
            {conversations.map((c) => (
              <li key={c.id} className="flex items-start gap-3 bg-card px-4 py-3">
                <input
                  type="checkbox"
                  checked={Boolean(selected[c.id])}
                  onChange={(e) => setSelected((s) => ({ ...s, [c.id]: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-border"
                />
                <div className="min-w-0">
                  <div className="truncate font-display text-sm font-extrabold text-foreground">
                    {c.title || "（未命名）"}
                  </div>
                  <div className="mt-1 truncate text-xs font-semibold text-muted">{c.id}</div>
                  <div className="mt-1 text-[11px] font-semibold text-muted">
                    更新：{fmt(c.updated_at)} · 创建：{fmt(c.created_at)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </form>
    </div>
  );
}

