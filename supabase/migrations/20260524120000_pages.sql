-- Dynamic page system for admin-managed pages
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.pages(id) on delete set null,
  slug text not null,
  title_de text not null,
  title_en text,
  locale text not null default 'de' check (locale in ('de', 'en')),
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled')),
  template text not null default 'blank' check (template in ('landing', 'legal', 'blank')),
  excerpt_de text,
  body_de text,
  meta_description_de text,
  scheduled_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pages_slug_locale_unique unique (slug, locale)
);

create index if not exists pages_parent_id_idx on public.pages(parent_id);
create index if not exists pages_status_idx on public.pages(status);
create index if not exists pages_locale_idx on public.pages(locale);

alter table public.pages enable row level security;

drop policy if exists "Public can read published pages" on public.pages;
create policy "Public can read published pages"
on public.pages for select
using (
  status = 'published'
  or (status = 'scheduled' and scheduled_at is not null and scheduled_at <= now())
);
