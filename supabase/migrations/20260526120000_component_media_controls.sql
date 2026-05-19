-- Component-level card controls and media pipeline baseline
alter table public.services
  add column if not exists icon_name text,
  add column if not exists tags text[] not null default '{}'::text[],
  add column if not exists cta_label text,
  add column if not exists animation_preset text,
  add column if not exists enable_3d boolean not null default true,
  add column if not exists video_url text;

alter table public.portfolio_entries
  add column if not exists icon_name text,
  add column if not exists tags text[] not null default '{}'::text[],
  add column if not exists cta_label text,
  add column if not exists animation_preset text,
  add column if not exists enable_3d boolean not null default true,
  add column if not exists video_url text;

comment on column public.services.icon_name is 'Admin-controlled icon key for service cards';
comment on column public.services.tags is 'Admin-controlled tags for service cards';
comment on column public.services.video_url is 'Optional card video URL or uploaded video URL';
comment on column public.portfolio_entries.icon_name is 'Admin-controlled icon key for portfolio cards';
comment on column public.portfolio_entries.tags is 'Admin-controlled tags for portfolio cards';
comment on column public.portfolio_entries.video_url is 'Optional portfolio video URL or uploaded video URL';

update storage.buckets
set
  file_size_limit = 26214400,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/svg+xml',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
where id = 'cms-media';
