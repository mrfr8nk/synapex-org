-- Create sponsors table for displaying current sponsors on the site
create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  tier text default 'community',
  description text,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.sponsors enable row level security;

-- Public read policy
create policy "sponsors_public_read" on public.sponsors
  for select using (visible = true);

-- Admin write policy (service role bypasses RLS, anon uses this for admin panel)
create policy "sponsors_admin_all" on public.sponsors
  for all using (true) with check (true);

-- Also ensure sponsor_applications has proper policies
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'sponsor_applications' and policyname = 'sponsor_applications_insert'
  ) then
    create policy "sponsor_applications_insert" on public.sponsor_applications
      for insert with check (true);
  end if;
end$$;

-- Events: ensure anon can insert contact-style things if needed
-- (Events are admin-only inserts, public reads handled by existing policy)
