-- Run this in Supabase SQL Editor (after supabase/schema.sql).
-- This table is used for tracking prompt iteration outcomes.

create table if not exists prompt_iterations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  title text not null,
  goal text,
  changes text,
  run_id_before uuid references eval_runs(id) on delete set null,
  run_id_after uuid references eval_runs(id) on delete set null,
  rule_pass_rate_before double precision,
  rule_pass_rate_after double precision,
  avg_judge_overall_before double precision,
  avg_judge_overall_after double precision,
  notes text
);

create index if not exists prompt_iterations_updated_at_idx
  on prompt_iterations(updated_at desc);

-- Optional: auto-update updated_at
create or replace function set_prompt_iterations_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists prompt_iterations_set_updated_at on prompt_iterations;
create trigger prompt_iterations_set_updated_at
before update on prompt_iterations
for each row execute function set_prompt_iterations_updated_at();

