-- Blocks app: migration 02 — skills table + missing RLS policies + realtime.
-- Run this in the Supabase SQL editor AFTER schema.sql.
-- Safe to run once; re-running will error on "already exists" (harmless).

-- Skills: separate from interest tags. direction = what you're offering
-- (teach) vs what you're after (learn); level is a rough self-rating.
create table skills (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete cascade,
  label text not null,
  direction text check (direction in ('teach', 'learn')) not null,
  level text check (level in ('beginner', 'intermediate', 'advanced')),
  created_at timestamptz default now()
);

alter table skills enable row level security;

create policy "skills are publicly readable" on skills for select using (true);
create policy "users can insert their own skills" on skills for insert with check (
  exists (select 1 from profiles p where p.id = profile_id and p.auth_user_id = auth.uid())
);
create policy "users can delete their own skills" on skills for delete using (
  exists (select 1 from profiles p where p.id = profile_id and p.auth_user_id = auth.uid())
);

-- profiles: schema.sql never added an update policy, so profile editing
-- (the "Edit profile" feature) would silently no-op against a live DB.
create policy "users can update their own profile" on profiles for update using (
  auth.uid() = auth_user_id
) with check (auth.uid() = auth_user_id);

-- tags: schema.sql only had a select policy — no way to insert/remove tags.
create policy "users can insert their own tags" on tags for insert with check (
  exists (select 1 from profiles p where p.id = profile_id and p.auth_user_id = auth.uid())
);
create policy "users can delete their own tags" on tags for delete using (
  exists (select 1 from profiles p where p.id = profile_id and p.auth_user_id = auth.uid())
);

-- connections: RLS was enabled with zero policies, which blocks everything.
create policy "participants can view their connections" on connections for select using (
  exists (select 1 from profiles p where p.id = requester_id and p.auth_user_id = auth.uid())
  or exists (select 1 from profiles p where p.id = recipient_id and p.auth_user_id = auth.uid())
);
create policy "users can send connection requests" on connections for insert with check (
  exists (select 1 from profiles p where p.id = requester_id and p.auth_user_id = auth.uid())
);
-- Either side can update the row: recipient accepts/declines, requester
-- sets their private nickname for the other person.
create policy "participants can update their connection" on connections for update using (
  exists (select 1 from profiles p where p.id = requester_id and p.auth_user_id = auth.uid())
  or exists (select 1 from profiles p where p.id = recipient_id and p.auth_user_id = auth.uid())
) with check (
  exists (select 1 from profiles p where p.id = requester_id and p.auth_user_id = auth.uid())
  or exists (select 1 from profiles p where p.id = recipient_id and p.auth_user_id = auth.uid())
);

-- messages: RLS was enabled with zero policies too.
create policy "participants can view messages" on messages for select using (
  exists (
    select 1 from connections c
    join profiles p on p.id = c.requester_id or p.id = c.recipient_id
    where c.id = connection_id and p.auth_user_id = auth.uid()
  )
);
create policy "participants can send messages" on messages for insert with check (
  exists (select 1 from profiles p where p.id = sender_id and p.auth_user_id = auth.uid())
  and exists (
    select 1 from connections c
    join profiles p on p.id = c.requester_id or p.id = c.recipient_id
    where c.id = connection_id and p.auth_user_id = auth.uid() and c.status = 'accepted'
  )
);

-- need_posts: schema.sql only had a select policy.
create policy "users can insert their own need posts" on need_posts for insert with check (
  exists (select 1 from profiles p where p.id = profile_id and p.auth_user_id = auth.uid())
);

-- Turn on Realtime change streaming for chat.
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table connections;
