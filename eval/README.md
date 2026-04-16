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

