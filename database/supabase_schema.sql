-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Trips Table
create table public.trips (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  currency text default 'THB',
  exchange_rate numeric default 740,
  total_budget_vnd numeric default 0
);

-- 2. Create Trip Members Table
create table public.trip_members (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  name text not null,
  avatar text not null,
  color text,
  bg text,
  border text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Expenses Table
create table public.expenses (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  payer_id uuid references public.trip_members(id) on delete set null,
  description text not null,
  amount_vnd numeric not null,
  original_amount numeric not null,
  currency text not null,
  type text not null check (type in ('SHARED', 'PERSONAL')),
  category text not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Realtime
alter publication supabase_realtime add table public.trips;
alter publication supabase_realtime add table public.trip_members;
alter publication supabase_realtime add table public.expenses;

-- 5. Row Level Security (RLS)
-- For simplicity in this version, we will allow public read/write access to anyone with the Trip ID.
-- In a production app, you would restrict this to authenticated users.

alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.expenses enable row level security;

-- Policy: Allow anyone to do anything (since we are sharing via URL ID)
create policy "Public Access" on public.trips for all using (true) with check (true);
create policy "Public Access" on public.trip_members for all using (true) with check (true);
create policy "Public Access" on public.expenses for all using (true) with check (true);
