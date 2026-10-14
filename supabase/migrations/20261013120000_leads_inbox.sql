-- supabase/migrations/20261013120000_leads_inbox.sql
-- Durable lead inbox: har bir ariza delivery'dan OLDIN shu yerga yoziladi.

create table if not exists public.leads_inbox (
  id uuid primary key default gen_random_uuid(),
  event_id text unique not null,
  payload jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'delivered', 'failed', 'dead')),
  telegram_ok boolean not null default false,
  amocrm_ok boolean not null default false,
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_inbox_status_idx on public.leads_inbox (status, created_at);

-- Faqat service-role (RLS yoqilgan, policy yo'q = anon/auth uchun to'liq deny).
alter table public.leads_inbox enable row level security;
