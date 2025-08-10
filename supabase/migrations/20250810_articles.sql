-- Reset and recreate articles schema (idempotent)
-- DANGER: This drops and recreates the articles table and related objects.

-- Drop policy (if exists) before dropping table
drop policy if exists articles_read_published on articles;

-- Drop trigger and function if they already exist
drop trigger if exists trg_articles_updated_at on articles;
drop function if exists set_updated_at();

-- Drop the table last
drop table if exists articles cascade;

-- Ensure extension for UUIDs
create extension if not exists pgcrypto; -- for gen_random_uuid

-- Recreate table
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null unique,
  source text not null,
  published_at timestamptz,
  summary text,
  content_html text,
  tags text[] default '{}',
  featured boolean default false,
  status text not null default 'published', -- 'new'|'published'|'archived'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_articles_published_at on articles (published_at desc nulls last);
create index if not exists idx_articles_source_published on articles (source, published_at desc nulls last);

-- Trigger to touch updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_articles_updated_at
before update on articles
for each row execute function set_updated_at();

-- RLS: public read only for published
alter table articles enable row level security;

create policy articles_read_published on articles
for select
using (status = 'published');

-- No insert/update/delete for anon by default
