create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamptz default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "anyone can subscribe" on public.newsletter_subscribers
  for insert with check (true);

create policy "admin read subscribers" on public.newsletter_subscribers
  for select using (true);
