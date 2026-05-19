-- Alt text for service and portfolio card cover images
alter table public.services
  add column if not exists image_alt text;

alter table public.portfolio_entries
  add column if not exists image_alt text;

comment on column public.services.image_alt is 'Accessible alt text for the service card image';
comment on column public.portfolio_entries.image_alt is 'Accessible alt text for the portfolio card image';
