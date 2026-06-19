-- CarbonTwin AI — Supabase Schema
-- Run in Supabase SQL Editor

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  onboarding_completed boolean default false,
  onboarding_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Carbon Twins
create table if not exists public.carbon_twins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  avatar_description text,
  personality text,
  annual_footprint_kg numeric not null default 0,
  daily_budget_kg numeric not null default 0,
  traits jsonb default '[]',
  created_at timestamptz default now()
);

alter table public.carbon_twins enable row level security;

create policy "Users can manage own twins"
  on public.carbon_twins for all
  using (auth.uid() = user_id);

-- Receipt Analyses
create table if not exists public.receipt_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  image_url text,
  items jsonb default '[]',
  total_carbon_kg numeric default 0,
  summary text,
  created_at timestamptz default now()
);

alter table public.receipt_analyses enable row level security;

create policy "Users can manage own receipts"
  on public.receipt_analyses for all
  using (auth.uid() = user_id);

-- Carbon Budget Log
create table if not exists public.carbon_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount_kg numeric not null,
  source text not null,
  description text,
  logged_at timestamptz default now()
);

alter table public.carbon_log enable row level security;

create policy "Users can manage own carbon log"
  on public.carbon_log for all
  using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
