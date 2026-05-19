-- Final architecture and scaling foundation
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  site_id uuid,
  source_type text not null default 'cms',
  source_id text,
  url text not null,
  alt text,
  mime_type text,
  size_bytes bigint,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.theme_presets (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  tokens jsonb not null default '{}'::jsonb,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.animation_presets (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  settings jsonb not null default '{}'::jsonb,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  site_id uuid,
  label text not null,
  href text not null,
  location text not null default 'header',
  visible boolean not null default true,
  sort_order int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.permission_rules (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  resource text not null,
  action text not null,
  allowed boolean not null default true,
  created_at timestamptz not null default now(),
  unique (role, resource, action)
);

create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  primary_domain text,
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_dashboards (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references public.sites(id) on delete cascade,
  client_name text not null,
  contact_email text,
  status text not null default 'draft' check (status in ('draft', 'active', 'paused')),
  modules text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_connections (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  label text not null,
  status text not null default 'planned' check (status in ('planned', 'active', 'paused')),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.billing_accounts (
  id uuid primary key default gen_random_uuid(),
  client_dashboard_id uuid references public.client_dashboards(id) on delete set null,
  stripe_customer_id text,
  portal_url text,
  status text not null default 'planned' check (status in ('planned', 'active', 'paused')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.automation_pipelines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  trigger_type text not null default 'manual',
  status text not null default 'draft' check (status in ('draft', 'active', 'paused')),
  steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.media_assets enable row level security;
alter table public.theme_presets enable row level security;
alter table public.animation_presets enable row level security;
alter table public.navigation_items enable row level security;
alter table public.permission_rules enable row level security;
alter table public.sites enable row level security;
alter table public.client_dashboards enable row level security;
alter table public.crm_connections enable row level security;
alter table public.billing_accounts enable row level security;
alter table public.automation_pipelines enable row level security;

insert into public.sites (name, slug, primary_domain)
values ('OrzuIT', 'orzuit', null)
on conflict (slug) do nothing;

insert into public.theme_presets (name, tokens, active)
values ('OrzuIT Luxury Dark', '{"accent":"#7dd3fc","accent2":"#a78bfa","background":"#030712"}'::jsonb, true)
on conflict (name) do nothing;

insert into public.animation_presets (name, settings, active)
values ('Cinematic Smooth', '{"motionPreset":"cinematic","framerPreset":"smooth","scrollRevealIntensity":"medium"}'::jsonb, true)
on conflict (name) do nothing;
