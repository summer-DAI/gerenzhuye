## Eval runner (prompt evaluation)

This repository ships a small evaluation harness:

- Cases: `eval/cases.v1.json`
- Rules: `eval/rules.mjs`
- Judge prompt: `eval/judgePrompt.mjs`
- Runner: `eval/run.mjs`

### What it does

For each case:

1. Calls the **target model** with the same style/system prompt as `/api/chat`
2. Checks the output with deterministic **rules**
3. Optionally calls an **LLM judge** to score and explain
4. Writes a report to `eval/reports/{runId}.json`
5. Optionally writes results to Supabase (`eval_runs`, `eval_case_results`)

### Required env vars (local)

- `OPENAI_API_KEY`
- (optional) `OPENAI_BASE_URL`
- (optional) `OPENAI_MODEL`

To write results into Supabase:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Commands

Dry run (rules only; no judge; no DB):

```bash
node eval/run.mjs --no-judge --prompt-version=v1 --target=gpt-4o-mini
```

Full run (rules + judge) and write to Supabase:

```bash
node eval/run.mjs --prompt-version=v1 --target=gpt-4o-mini --judge=gpt-4o-mini --write-supabase
```

Add notes:

```bash
node eval/run.mjs --prompt-version=v1 --notes=\"tweak refusal wording\" --write-supabase
```

### Smoke vs full runs

The runner also supports a `--cases` flag so you can run a **small smoke set** before running the full suite:

- Default cases file: `eval/cases.v1.json`
- Optional smoke set: `eval/cases.smoke.json` (10 high‑signal cases)

Example smoke run (rules + judge, write to Supabase):

```bash
node eval/run.mjs --prompt-version=ask-v2.4 --cases=eval/cases.smoke.json --write-supabase
```

Then run the full 30‑case suite for the same prompt version:

```bash
node eval/run.mjs --prompt-version=ask-v2.4 --write-supabase
```

