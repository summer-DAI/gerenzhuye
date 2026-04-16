"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function createBadCases(formData: FormData) {
  const ids = formData.getAll("conversationIds").map((x) => String(x)).filter(Boolean);
  const reason = String(formData.get("reason") ?? "").trim();

  if (!ids.length) return;

  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();

  // Best-effort: snapshot title/updated_at for convenience.
  const { data: convos } = await supabase
    .from("conversations")
    .select("id,title,updated_at")
    .in("id", ids);

  const rows =
    (convos ?? []).map((c: any) => ({
      conversation_id: c.id,
      conversation_title_snapshot: c.title ?? null,
      conversation_updated_at_snapshot: c.updated_at ?? null,
      reason: reason || null,
      status: "open",
      created_at: now,
    })) ?? [];

  if (!rows.length) return;

  await supabase.from("bad_cases").insert(rows);

  revalidatePath("/admin/conversations");
  revalidatePath("/admin/bad-cases");
  revalidatePath("/admin");
}

export async function markBadCaseDone(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  const supabase = getSupabaseAdmin();
  await supabase.from("bad_cases").update({ status: "done" }).eq("id", id);
  revalidatePath("/admin/bad-cases");
}

