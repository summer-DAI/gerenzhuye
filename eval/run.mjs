import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

import { checkRules } from "./rules.mjs";
import { buildJudgeMessages } from "./judgePrompt.mjs";
import { buildAskSystemPrompt } from "./askSystemPrompt.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

// Load local env (Next.js loads this automatically, but plain Node does not).
dotenv.config({ path: path.join(repoRoot, ".env.local") });

function readText(rel) {
  return fs.readFileSync(path.join(repoRoot, rel), "utf-8");
}

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf-8").digest("hex");
}

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const [k, v] = a.slice(2).split("=");
    out[k] = v ?? true;
  }
  return out;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function getSupabaseAdminFromEnv() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function judgeOne({ openai, judgeModel, caseDef, assistantOutput, knowledgeText }) {
  const messages = buildJudgeMessages({ caseDef, assistantOutput, knowledgeText });
  const resp = await openai.chat.completions.create({
    model: judgeModel,
    messages,
    temperature: 0,
  });
  const text = resp.choices[0]?.message?.content ?? "";
  const trimmed = text.trim();
  // Best-effort JSON parse
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  const jsonText = start >= 0 && end >= 0 ? trimmed.slice(start, end + 1) : trimmed;
  const parsed = JSON.parse(jsonText);
  return parsed;
}

async function main() {
  const args = parseArgs(process.argv);
  const promptVersion = String(args["prompt-version"] ?? "v1");
  const targetModel = String(args["target"] ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini");
  const judgeModel = String(args["judge"] ?? targetModel);
  const writeSupabase = Boolean(args["write-supabase"]);
  const noJudge = Boolean(args["no-judge"]);
  const casesFile = String(args["cases"] ?? "eval/cases.v1.json");

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    console.error("Missing OPENAI_API_KEY");
    process.exit(2);
  }
  const openai = new OpenAI({
    apiKey: openaiKey,
    ...(process.env.OPENAI_BASE_URL ? { baseURL: process.env.OPENAI_BASE_URL } : {}),
  });

  const knowledge = readText("content/knowledge.md");
  const knowledgeHash = sha256(knowledge);
  const profile = JSON.parse(readText("content/profile.json"));
  const system = buildAskSystemPrompt(profile, knowledge);
  const cases = JSON.parse(readText(casesFile));

  const runId = crypto.randomUUID();
  const startedAt = Date.now();

  const supabase = writeSupabase ? getSupabaseAdminFromEnv() : null;
  if (writeSupabase && !supabase) {
    console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
    process.exit(2);
  }

  if (supabase) {
    const { error } = await supabase.from("eval_runs").insert({
      id: runId,
      prompt_version: promptVersion,
      knowledge_hash: knowledgeHash,
      target_model: targetModel,
      judge_model: noJudge ? "(disabled)" : judgeModel,
      notes: args["notes"] ? String(args["notes"]) : null,
    });
    if (error) {
      console.error("Failed to insert eval_runs:", error.message);
      process.exit(2);
    }
  }

  const results = [];

  for (const caseDef of cases) {
    const t0 = Date.now();
    const resp = await openai.chat.completions.create({
      model: targetModel,
      messages: [
        { role: "system", content: system },
        { role: "user", content: caseDef.user_input },
      ],
      temperature: 0.2,
    });
    const assistantOutput = resp.choices[0]?.message?.content ?? "";
    const latencyMs = Date.now() - t0;

    const rule = checkRules({ caseDef, output: assistantOutput });

    let judge = null;
    if (!noJudge) {
      try {
        judge = await judgeOne({
          openai,
          judgeModel,
          caseDef,
          assistantOutput,
          knowledgeText: knowledge,
        });
      } catch (e) {
        judge = {
          overall: null,
          factuality: null,
          style: null,
          format: null,
          rationale: "Judge 解析失败",
          error: e instanceof Error ? e.message : String(e),
        };
      }
    }

    const row = {
      run_id: runId,
      case_id: caseDef.id,
      category: caseDef.category,
      expected_behavior: caseDef.expected_behavior,
      user_input: caseDef.user_input,
      assistant_output: assistantOutput,
      rule_pass: rule.pass,
      rule_fail_reasons: rule.pass ? null : rule.failReasons,
      judge_score_overall: judge?.overall ?? null,
      judge_scores: judge
        ? {
            factuality: judge.factuality ?? null,
            style: judge.style ?? null,
            format: judge.format ?? null,
          }
        : null,
      judge_rationale: judge?.rationale ?? null,
      latency_ms: latencyMs,
    };

    results.push(row);

    if (supabase) {
      const { error } = await supabase.from("eval_case_results").upsert(row);
      if (error) {
        console.error(`Failed to upsert case ${caseDef.id}:`, error.message);
      }
    }

    process.stdout.write(
      `${caseDef.id} ${rule.pass ? "PASS" : "FAIL"} (${latencyMs}ms)` +
        (judge?.overall != null ? ` judge=${judge.overall}` : "") +
        "\n"
    );
  }

  const passCount = results.filter((r) => r.rule_pass).length;
  const avgJudge =
    results
      .map((r) => (typeof r.judge_score_overall === "number" ? r.judge_score_overall : null))
      .filter((x) => x != null)
      .reduce((a, b) => a + b, 0) /
    Math.max(
      1,
      results.filter((r) => typeof r.judge_score_overall === "number").length
    );

  const summary = {
    runId,
    prompt_version: promptVersion,
    knowledge_hash: knowledgeHash,
    target_model: targetModel,
    judge_model: noJudge ? null : judgeModel,
    total: results.length,
    rule_pass: passCount,
    rule_pass_rate: passCount / Math.max(1, results.length),
    avg_judge_overall: Number.isFinite(avgJudge) ? avgJudge : null,
    elapsed_ms: Date.now() - startedAt,
  };

  ensureDir(path.join(repoRoot, "eval", "reports"));
  const reportPath = path.join(repoRoot, "eval", "reports", `${runId}.json`);
  fs.writeFileSync(reportPath, JSON.stringify({ summary, results }, null, 2), "utf-8");

  process.stdout.write("\n=== SUMMARY ===\n");
  process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
  process.stdout.write(`Report: ${path.relative(repoRoot, reportPath)}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

