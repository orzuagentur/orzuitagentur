alter table public.services
  add column if not exists body_de text,
  add column if not exists category_de text,
  add column if not exists project_url text;

insert into public.services (slug, title_de, description_de, category_de, sort_order, published)
values (
  's5',
  'Schnittstellen & Integration',
  'APIs, ERP-Anbindungen und Datenflüsse zwischen bestehenden Systemen — stabil, dokumentiert und wartbar.',
  'Integration • APIs',
  5,
  true
)
on conflict (slug) do nothing;
