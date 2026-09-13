-- supabase/migrations/20260904120000_affiliates.sql

create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  telegram_username text,
  promo_code text unique not null,
  access_token text unique not null,
  created_at timestamptz not null default now()
);
create index if not exists affiliates_promo_code_idx on public.affiliates (promo_code);
create index if not exists affiliates_access_token_idx on public.affiliates (access_token);
create index if not exists affiliates_phone_idx on public.affiliates (phone);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  amocrm_lead_id bigint,
  lead_name text not null,
  lead_phone text not null,
  service_hint text,
  status text not null default 'new' check (status in ('new', 'won', 'lost')),
  created_at timestamptz not null default now(),
  won_at timestamptz
);
create index if not exists referrals_affiliate_id_idx on public.referrals (affiliate_id);
create index if not exists referrals_amocrm_lead_id_idx on public.referrals (amocrm_lead_id);

create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid unique not null references public.referrals(id) on delete cascade,
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  service text not null,
  amount integer not null,
  paid boolean not null default false,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists payouts_affiliate_id_idx on public.payouts (affiliate_id);
create index if not exists payouts_paid_idx on public.payouts (paid);

-- RLS: anon/authenticated uchun hech qanday policy yo'q — faqat service-role kirishi mumkin.
alter table public.affiliates enable row level security;
alter table public.referrals enable row level security;
alter table public.payouts enable row level security;
