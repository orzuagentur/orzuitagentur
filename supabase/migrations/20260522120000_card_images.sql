-- Card cover images for services and portfolio
alter table public.services
  add column if not exists image_url text;

alter table public.portfolio_entries
  add column if not exists image_url text;

comment on column public.services.image_url is 'Public URL for card cover image (Storage or external)';
comment on column public.portfolio_entries.image_url is 'Public URL for card cover image (Storage or external)';

-- Public bucket for CMS card images (upload via service role in dashboard)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media',
  'cms-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "cms-media public read" on storage.objects;
create policy "cms-media public read"
  on storage.objects for select
  using (bucket_id = 'cms-media');
