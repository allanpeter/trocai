-- ============================================================
-- trocai.app — Initial Schema
-- Run this in your Supabase SQL editor (or via supabase db push)
-- ============================================================

-- Enable pgcrypto for UUID generation (already enabled on Supabase)
-- create extension if not exists "pgcrypto";

-- ── Albums ───────────────────────────────────────────────────────────
create table if not exists public.albums (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  year           int  not null,
  total_stickers int  not null,
  cover_url      text,
  created_at     timestamptz not null default now()
);

-- ── Stickers ─────────────────────────────────────────────────────────
-- One row per sticker slot in an album.
create table if not exists public.stickers (
  id        uuid primary key default gen_random_uuid(),
  album_id  uuid not null references public.albums(id) on delete cascade,
  number    int  not null,
  name      text,
  team      text,
  is_rare   boolean not null default false,
  unique (album_id, number)
);

create index if not exists stickers_album_id_idx on public.stickers(album_id);

-- ── Profiles ─────────────────────────────────────────────────────────
-- Extended user data; id matches auth.users.id 1-to-1.
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text not null unique,
  full_name    text,
  city         text,
  state        text,
  avatar_url   text,
  bio          text,
  rating       numeric(3,2) not null default 0,
  trades_count int          not null default 0,
  created_at   timestamptz  not null default now()
);

-- ── User stickers ─────────────────────────────────────────────────────
-- Records what a user has / needs / has duplicate of.
create type sticker_status as enum ('have', 'duplicate', 'need');

create table if not exists public.user_stickers (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid          not null references auth.users(id)      on delete cascade,
  sticker_id uuid          not null references public.stickers(id) on delete cascade,
  status     sticker_status not null,
  quantity   int            not null default 1 check (quantity >= 1),
  updated_at timestamptz   not null default now(),
  unique (user_id, sticker_id)
);

create index if not exists user_stickers_user_id_idx    on public.user_stickers(user_id);
create index if not exists user_stickers_sticker_id_idx on public.user_stickers(sticker_id);
create index if not exists user_stickers_status_idx     on public.user_stickers(status);

-- ── Chats ────────────────────────────────────────────────────────────
create table if not exists public.chats (
  id              uuid primary key default gen_random_uuid(),
  user1_id        uuid        not null references auth.users(id) on delete cascade,
  user2_id        uuid        not null references auth.users(id) on delete cascade,
  last_message_at timestamptz not null default now(),
  unique (user1_id, user2_id),
  check (user1_id <> user2_id)
);

create index if not exists chats_user1_idx on public.chats(user1_id);
create index if not exists chats_user2_idx on public.chats(user2_id);

-- ── Messages ─────────────────────────────────────────────────────────
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  chat_id    uuid        not null references public.chats(id) on delete cascade,
  sender_id  uuid        not null references auth.users(id)   on delete cascade,
  content    text        not null,
  read       boolean     not null default false,
  created_at timestamptz not null default now()
);

create index if not exists messages_chat_id_idx on public.messages(chat_id);

-- ── Ratings ──────────────────────────────────────────────────────────
create table if not exists public.ratings (
  id         uuid primary key default gen_random_uuid(),
  rater_id   uuid        not null references auth.users(id) on delete cascade,
  rated_id   uuid        not null references auth.users(id) on delete cascade,
  trade_id   uuid,                           -- future: link to a trades table
  score      smallint    not null check (score between 1 and 5),
  comment    text,
  created_at timestamptz not null default now(),
  unique (rater_id, rated_id, trade_id)     -- one rating per trade
);

create index if not exists ratings_rated_id_idx on public.ratings(rated_id);

-- ── Trigger: update profile rating + trades_count after rating insert ──
create or replace function public.update_profile_rating()
returns trigger language plpgsql security definer as $$
begin
  update public.profiles
  set
    rating       = (select round(avg(score)::numeric, 2) from public.ratings where rated_id = new.rated_id),
    trades_count = (select count(*)                      from public.ratings where rated_id = new.rated_id)
  where id = new.rated_id;
  return new;
end;
$$;

drop trigger if exists on_rating_insert on public.ratings;
create trigger on_rating_insert
  after insert on public.ratings
  for each row execute procedure public.update_profile_rating();

-- ── Trigger: bump chat.last_message_at on new message ──────────────
create or replace function public.update_chat_last_message()
returns trigger language plpgsql security definer as $$
begin
  update public.chats set last_message_at = new.created_at where id = new.chat_id;
  return new;
end;
$$;

drop trigger if exists on_message_insert on public.messages;
create trigger on_message_insert
  after insert on public.messages
  for each row execute procedure public.update_chat_last_message();

-- ── Trigger: auto-create profile on auth.users insert ──────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Row Level Security ────────────────────────────────────────────────
alter table public.profiles      enable row level security;
alter table public.albums        enable row level security;
alter table public.stickers      enable row level security;
alter table public.user_stickers enable row level security;
alter table public.chats         enable row level security;
alter table public.messages      enable row level security;
alter table public.ratings       enable row level security;

-- albums + stickers: public read
create policy "albums_public_read"   on public.albums   for select using (true);
create policy "stickers_public_read" on public.stickers for select using (true);

-- profiles: public read; owner write
create policy "profiles_public_read"  on public.profiles for select using (true);
create policy "profiles_owner_update" on public.profiles for update using (auth.uid() = id);

-- user_stickers: public read (so matching works); owner write
create policy "user_stickers_public_read"   on public.user_stickers for select using (true);
create policy "user_stickers_owner_insert"  on public.user_stickers for insert with check (auth.uid() = user_id);
create policy "user_stickers_owner_update"  on public.user_stickers for update using (auth.uid() = user_id);
create policy "user_stickers_owner_delete"  on public.user_stickers for delete using (auth.uid() = user_id);

-- chats: participants only
create policy "chats_participant_read"
  on public.chats for select
  using (auth.uid() = user1_id or auth.uid() = user2_id);

create policy "chats_participant_insert"
  on public.chats for insert
  with check (auth.uid() = user1_id or auth.uid() = user2_id);

-- messages: chat participants only
create policy "messages_participant_read"
  on public.messages for select
  using (
    exists (
      select 1 from public.chats
      where id = chat_id and (user1_id = auth.uid() or user2_id = auth.uid())
    )
  );

create policy "messages_sender_insert"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "messages_sender_update"
  on public.messages for update
  using (auth.uid() = sender_id);

-- ratings: public read; authenticated insert (rater = self)
create policy "ratings_public_read"
  on public.ratings for select using (true);

create policy "ratings_owner_insert"
  on public.ratings for insert
  with check (auth.uid() = rater_id);

-- ── Seed: Copa do Mundo 2026 album ───────────────────────────────────
-- Paste real sticker data here, or use migration 003 for bulk insert.
insert into public.albums (id, name, year, total_stickers)
values ('00000000-0000-0000-0000-000000000001', 'Copa do Mundo 2026', 2026, 640)
on conflict do nothing;
