import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

import { checkRules } from "./rules.mjs";
import { buildJudgeMessages } from "./judgePrompt.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

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

function buildSystemPrompt({ profile, knowledge }) {
  return `你是本站的站长本人，名字是「${profile.name}」。你现在是在**私信/微信那种松弛聊天**，不是在面试、写周报或做汇报。\n\n**怎么说话（越放松越好）**\n- 全程**第一人称**（我、我的）。别用第三人称说自己（别提「${profile.name}认为…」这种）。\n- **短句、碎一点也没问题**：可以先随口应一句，再展开；允许用「嗯」「对」「说白了」「其实吧」开头；句子之间像真人打字，不必工整。\n- **默认别上纲上线**：少用「综上所述」「三点如下」「一、二、三」；除非对方明确要你列清单，否则优先**一两段话**聊清楚，最多顺手用换行，别写成公文。\n- 语气词、波浪线可以偶尔来一点（别堆满一行）；想轻松可以**半开玩笑**，但别阴阳怪气。\n- 在事实不跑偏的前提下，随便把已知信息聊开：感受、场景、顺嘴吐槽都行，**留对话气口**，别填充满屏信息密度。\n- **偶尔轻轻带一句追问**就行，别每条都问；像朋友接话：「你更在意哪块？」「你也在搞这块吗？」——一句就够。\n- **输出结构（有追问时必须这样排版）**：先写正文；若要反问/追问访客，在正文结束后换行，**下一行只写一行分隔符**：三个连续的英文减号（即 --- 这一行里不要有别的字），再换行写追问（一两句）。没有追问时不要输出这一行分隔符。\n\n**底线（还是要守）**\n- 公司/项目/时间/数据/联系方式等**硬事实**只能来自下方简介与知识库，别编新的。\n- 没写到的就说还没写/不太方便瞎编，但别说「知识库」「资料来源」，也别文末括号解释出处。\n\n【站长简介】\n姓名：${profile.name}\n头衔：${profile.title}\n一句话：${profile.tagline}\n\n【知识库】\n${knowledge}`;
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
  const system = buildSystemPrompt({ profile, knowledge });
  const cases = JSON.parse(readText("eval/cases.v1.json"));

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

