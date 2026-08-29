-- Blocks app schema for Supabase (Postgres)
-- Run this in the Supabase SQL editor.

create extension if not exists "uuid-ossp";

create table profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  username text unique not null,
  neighborhood text,
  offering text, -- "can teach" free text
  seeking text,  -- "want to learn" free text
  created_at timestamptz default now()
);

create table tags (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete cascade,
  label text not null,
  type text check (type in ('hobby', 'culture', 'language')) not null
);

create table connections (
  id uuid primary key default uuid_generate_v4(),
  requester_id uuid references profiles(id) on delete cascade,
  recipient_id uuid references profiles(id) on delete cascade,
  status text check (status in ('pending', 'accepted', 'declined')) default 'pending',
  nickname text, -- set by requester, private to them
  created_at timestamptz default now(),
  unique(requester_id, recipient_id)
);

create table messages (
  id uuid primary key default uuid_generate_v4(),
  connection_id uuid references connections(id) on delete cascade,
  sender_id uuid references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

create table need_posts (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete cascade,
  need_text text not null,
  created_at timestamptz default now()
);

-- Row Level Security: enable and add policies before going live.
alter table profiles enable row level security;
alter table tags enable row level security;
alter table connections enable row level security;
alter table messages enable row level security;
alter table need_posts enable row level security;

-- Example starter policies (tighten before real deployment):
create policy "profiles are publicly readable" on profiles for select using (true);
create policy "users can insert their own profile" on profiles for insert with check (auth.uid() = auth_user_id);
create policy "tags are publicly readable" on tags for select using (true);
create policy "need posts are publicly readable" on need_posts for select using (true);
