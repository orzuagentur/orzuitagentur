-- OrzuIT initial schema (PostgreSQL / Supabase)
-- Run in Supabase SQL editor or via supabase db push

create extension if not exists "pgcrypto";

-- ── Profiles (linked to auth.users) ───────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles: select own" on public.profiles
  for select using (auth.uid() = id);

create policy "Profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- ── Leads (contact form) — server inserts via service role only ─────────────
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  privacy_accepted boolean not null default false,
  source text not null default 'website',
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- No anon/authenticated policies: access only via service role (server actions).

-- ── Services (CMS-ready) ────────────────────────────────────────────────────
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_de text not null,
  description_de text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "Services: public read published" on public.services
  for select using (published = true);

-- ── Portfolio ───────────────────────────────────────────────────────────────
create table if not exists public.portfolio_entries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_de text not null,
  summary_de text,
  category_de text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_entries enable row level security;

create policy "Portfolio: public read published" on public.portfolio_entries
  for select using (published = true);

-- ── Testimonials ────────────────────────────────────────────────────────────
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote_de text not null,
  author_de text not null,
  role_de text,
  org_de text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create policy "Testimonials: public read published" on public.testimonials
  for select using (published = true);

-- ── Settings & SEO (key/value JSON) ─────────────────────────────────────────
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "Settings: public read" on public.site_settings
  for select using (true);

create table if not exists public.site_seo (
  path text primary key,
  title_de text,
  description_de text,
  og_image_url text,
  updated_at timestamptz not null default now()
);

alter table public.site_seo enable row level security;

create policy "SEO: public read" on public.site_seo
  for select using (true);

-- ── Analytics (simple append-only events) ─────────────────────────────────────
create table if not exists public.analytics_events (
  id bigserial primary key,
  event_name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_name_idx on public.analytics_events (event_name);

alter table public.analytics_events enable row level security;

-- Optional: allow insert from authenticated admin only via service role in practice.

comment on table public.leads is 'Contact form submissions; insert from backend only.';
comment on table public.site_settings is 'Global CMS-style settings blobs.';
