-- Run this in Supabase SQL Editor (after supabase/schema.sql).
-- Store admin-curated "bad cases" for eval set curation / regression.

create table if not exists bad_cases (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'open' check (status in ('open', 'done')),

  conversation_id uuid not null references conversations(id) on delete cascade,
  conversation_title_snapshot text,
  conversation_updated_at_snapshot timestamptz,

  reason text
);

create index if not exists bad_cases_created_at_idx
  on bad_cases(created_at desc);

create index if not exists bad_cases_conversation_id_idx
  on bad_cases(conversation_id);

