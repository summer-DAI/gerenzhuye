"use server";

import { redirect } from "next/navigation";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function toFloatOrNull(v: FormDataEntryValue | null) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toUuidOrNull(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  return s ? s : null;
}

export async function createPromptIteration(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const status = String(formData.get("status") ?? "todo");
  const goal = String(formData.get("goal") ?? "").trim() || null;
  const changes = String(formData.get("changes") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  const runIdBefore = toUuidOrNull(formData.get("run_id_before"));
  const runIdAfter = toUuidOrNull(formData.get("run_id_after"));

  const rulePassRateBefore = toFloatOrNull(formData.get("rule_pass_rate_before"));
  const rulePassRateAfter = toFloatOrNull(formData.get("rule_pass_rate_after"));
  const avgJudgeBefore = toFloatOrNull(formData.get("avg_judge_overall_before"));
  const avgJudgeAfter = toFloatOrNull(formData.get("avg_judge_overall_after"));

  const supabase = getSupabaseAdmin();
  await supabase.from("prompt_iterations").insert({
    title,
    status,
    goal,
    changes,
    notes,
    run_id_before: runIdBefore,
    run_id_after: runIdAfter,
    rule_pass_rate_before: rulePassRateBefore,
    rule_pass_rate_after: rulePassRateAfter,
    avg_judge_overall_before: avgJudgeBefore,
    avg_judge_overall_after: avgJudgeAfter,
  });

  redirect("/admin/prompt-iterations");
}

export async function updatePromptIteration(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const status = String(formData.get("status") ?? "todo");
  const title = String(formData.get("title") ?? "").trim();
  const goal = String(formData.get("goal") ?? "").trim() || null;
  const changes = String(formData.get("changes") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  const runIdBefore = toUuidOrNull(formData.get("run_id_before"));
  const runIdAfter = toUuidOrNull(formData.get("run_id_after"));

  const rulePassRateBefore = toFloatOrNull(formData.get("rule_pass_rate_before"));
  const rulePassRateAfter = toFloatOrNull(formData.get("rule_pass_rate_after"));
  const avgJudgeBefore = toFloatOrNull(formData.get("avg_judge_overall_before"));
  const avgJudgeAfter = toFloatOrNull(formData.get("avg_judge_overall_after"));

  const supabase = getSupabaseAdmin();
  await supabase.from("prompt_iterations").update({
    title,
    status,
    goal,
    changes,
    notes,
    run_id_before: runIdBefore,
    run_id_after: runIdAfter,
    rule_pass_rate_before: rulePassRateBefore,
    rule_pass_rate_after: rulePassRateAfter,
    avg_judge_overall_before: avgJudgeBefore,
    avg_judge_overall_after: avgJudgeAfter,
  }).eq("id", id);

  redirect(`/admin/prompt-iterations/${id}`);
}

