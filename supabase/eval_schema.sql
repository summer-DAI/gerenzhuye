-- Run this in Supabase SQL Editor (in addition to supabase/schema.sql).

create table if not exists eval_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  prompt_version text not null,
  knowledge_hash text not null,
  target_model text not null,
  judge_model text not null,
  notes text
);

create table if not exists eval_case_results (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references eval_runs(id) on delete cascade,
  case_id text not null,
  category text not null,
  expected_behavior text not null,
  user_input text not null,
  assistant_output text not null,
  rule_pass boolean not null,
  rule_fail_reasons jsonb,
  judge_score_overall double precision,
  judge_scores jsonb,
  judge_rationale text,
  latency_ms integer,
  created_at timestamptz not null default now(),
  unique (run_id, case_id)
);

create index if not exists eval_case_results_run_id_idx
  on eval_case_results(run_id);

create index if not exists eval_runs_created_at_idx
  on eval_runs(created_at desc);

