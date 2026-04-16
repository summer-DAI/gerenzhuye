/**
 * One-off helper: insert a row into prompt_iterations (uses .env.local).
 * Usage:
 *   node eval/recordPromptIteration.mjs
 */
import path from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(repoRoot, ".env.local") });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(2);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const row = {
  status: "done",
  title: "Ask prompt ask-v2：口径与 --- 规则对齐评测集",
  goal:
    "提高 deterministic rule 通过率：点分日期/部门名称、拒答用语、敏感词不复述、--- 仅用于追问。",
  changes:
    "新增 eval/askSystemPrompt.mjs，与 src/app/api/chat/route.ts、eval/run.mjs 共用同一套 system prompt。",
  run_id_before: "a9f5e34a-6b40-49f8-947e-fac50f265908",
  run_id_after: "af2f27ba-c1e9-4e87-9bd0-6fc93d9bb543",
  rule_pass_rate_before: 0.43333333333333335,
  rule_pass_rate_after: 0.6666666666666666,
  avg_judge_overall_before: 7.866666666666666,
  avg_judge_overall_after: 8.166666666666666,
  notes:
    "Before：历史评测 a9f5e34a（runner 旧 prompt）。After：af2f27ba，prompt_version=ask-v2，knowledge_hash 未变。",
};

async function main() {
  let payload = { ...row };
  const { data, error } = await supabase.from("prompt_iterations").insert(payload).select("id").single();
  if (error?.code === "23503" || error?.message?.includes("foreign key")) {
    payload = { ...row, run_id_before: null };
    const second = await supabase.from("prompt_iterations").insert(payload).select("id").single();
    if (second.error) {
      console.error(second.error);
      process.exit(1);
    }
    console.log("Inserted (run_id_before cleared — FK):", second.data);
    return;
  }
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log("Inserted:", data);
}

main();
