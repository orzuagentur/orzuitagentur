alter table public.portfolio_entries
  add column if not exists body_de text;

update public.portfolio_entries
set body_de = summary_de
where body_de is null and summary_de is not null;
