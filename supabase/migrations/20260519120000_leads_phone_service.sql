-- Optional contact fields for service interest and phone
alter table public.leads
  add column if not exists phone text,
  add column if not exists service_interest text;

comment on column public.leads.phone is 'Contact phone from website form';
comment on column public.leads.service_interest is 'Selected service / interest from website form';
