-- Redirects, AI assistant drafts, analytics settings and extended design tokens
create table if not exists public.redirect_rules (
  id uuid primary key default gen_random_uuid(),
  source_path text not null unique,
  target_url text not null,
  status_code int not null default 301 check (status_code in (301, 302)),
  enabled boolean not null default true,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_drafts (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('content', 'seo', 'translation', 'lead_summary', 'assistant')),
  prompt text not null,
  output text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_by text,
  created_at timestamptz not null default now()
);

alter table public.redirect_rules enable row level security;
alter table public.ai_drafts enable row level security;

create policy "Redirects: public read enabled" on public.redirect_rules
  for select using (enabled = true);

insert into public.site_settings (key, value)
values
  ('sitemap', '{"includeStatic": true, "includePortfolio": true, "includeDynamicPages": true, "defaultChangeFrequency": "weekly"}'::jsonb),
  ('analytics', '{"heatmapProvider": "", "heatmapProjectId": "", "heatmapEnabled": false, "trackCtaClicks": true, "trackScrollDepth": true, "trackWebVitals": true}'::jsonb)
on conflict (key) do nothing;
