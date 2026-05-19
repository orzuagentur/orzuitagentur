alter table public.portfolio_entries
  add column if not exists project_url text;

comment on column public.portfolio_entries.project_url is
  'External project website URL (Besuchen button on portfolio flip card).';
