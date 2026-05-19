-- Admin roles, security settings, audit logs and per-page SEO controls
create table if not exists public.admin_roles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null default 'viewer' check (role in ('owner', 'admin', 'editor', 'designer', 'ai_operator', 'viewer')),
  permissions text[] not null default '{}'::text[],
  two_factor_required boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_security_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_email text,
  action text not null,
  target_type text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.site_seo
  add column if not exists canonical_url text,
  add column if not exists robots_index boolean not null default true,
  add column if not exists schema_json jsonb not null default '{}'::jsonb,
  add column if not exists og_generated_prompt text,
  add column if not exists sitemap_enabled boolean not null default true;

alter table public.pages
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists canonical_url text,
  add column if not exists robots_index boolean not null default true,
  add column if not exists schema_json jsonb not null default '{}'::jsonb,
  add column if not exists og_image_url text,
  add column if not exists og_generated_prompt text,
  add column if not exists sitemap_enabled boolean not null default true;

insert into public.admin_security_settings (key, value)
values
  ('admin_route', '{"alias": "/dashboard", "enabled": false}'::jsonb),
  ('two_factor', '{"required": false, "issuer": "OrzuIT"}'::jsonb),
  ('session_policy', '{"maxAgeHours": 12, "showDeviceList": true}'::jsonb),
  ('ip_geo', '{"allowlist": [], "blockedCountries": []}'::jsonb),
  ('rate_limit', '{"enabled": true, "requestsPerMinute": 60, "botProtection": true}'::jsonb)
on conflict (key) do nothing;

alter table public.admin_roles enable row level security;
alter table public.admin_security_settings enable row level security;
alter table public.audit_logs enable row level security;
