-- Secure API key registry baseline. Values are stored encrypted by application code.
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  label text not null,
  encrypted_value text,
  masked_value text,
  status text not null default 'empty' check (status in ('empty', 'configured', 'rotating', 'disabled')),
  last_rotated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint api_keys_provider_unique unique (provider)
);

alter table public.api_keys enable row level security;

comment on table public.api_keys is 'Masked/encrypted API key registry for admin UI';
comment on column public.api_keys.encrypted_value is 'Application-encrypted secret value; never expose in UI';
comment on column public.api_keys.masked_value is 'Display-only masked value such as sk-...abcd';
