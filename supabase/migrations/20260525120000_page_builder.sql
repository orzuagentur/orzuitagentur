-- Page Builder sections and blocks for dynamic pages
create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  title_de text not null default 'Neue Sektion',
  section_key text not null default 'section',
  visible boolean not null default true,
  sort_order integer not null default 0,
  layout jsonb not null default '{}'::jsonb,
  responsive jsonb not null default '{}'::jsonb,
  animation jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.page_blocks (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.page_sections(id) on delete cascade,
  block_type text not null check (
    block_type in (
      'hero',
      'features',
      'services',
      'portfolio',
      'testimonials',
      'faq',
      'pricing',
      'cta',
      'stats',
      'team',
      'ai',
      'contact',
      'timeline',
      'markdown',
      'custom_html',
      'react'
    )
  ),
  title_de text not null default 'Neuer Block',
  content_de text,
  visible boolean not null default true,
  sort_order integer not null default 0,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists page_sections_page_id_idx on public.page_sections(page_id);
create index if not exists page_blocks_section_id_idx on public.page_blocks(section_id);

alter table public.page_sections enable row level security;
alter table public.page_blocks enable row level security;

drop policy if exists "Public can read sections for published pages" on public.page_sections;
create policy "Public can read sections for published pages"
on public.page_sections for select
using (
  exists (
    select 1
    from public.pages p
    where p.id = page_sections.page_id
      and (
        p.status = 'published'
        or (p.status = 'scheduled' and p.scheduled_at is not null and p.scheduled_at <= now())
      )
  )
);

drop policy if exists "Public can read blocks for published pages" on public.page_blocks;
create policy "Public can read blocks for published pages"
on public.page_blocks for select
using (
  exists (
    select 1
    from public.page_sections s
    join public.pages p on p.id = s.page_id
    where s.id = page_blocks.section_id
      and (
        p.status = 'published'
        or (p.status = 'scheduled' and p.scheduled_at is not null and p.scheduled_at <= now())
      )
  )
);
