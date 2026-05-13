-- ============================================================
-- trocai.app — Location Upgrade
-- Run AFTER 003_seed_stickers.sql
-- ============================================================

-- ── PostGIS ──────────────────────────────────────────────────
create extension if not exists postgis;

-- ── Profiles: add structured location columns ─────────────────
alter table public.profiles
  add column if not exists city_id    text,
  add column if not exists city_name  text,
  add column if not exists state_code text,
  add column if not exists state_name text,
  add column if not exists lat        double precision,
  add column if not exists lng        double precision,
  add column if not exists location   geography(POINT, 4326);

create index if not exists profiles_location_gist
  on public.profiles using gist(location)
  where location is not null;

-- Trigger: keep location in sync with lat/lng changes
create or replace function public.sync_profile_location()
returns trigger language plpgsql security definer as $$
begin
  if new.lat is not null and new.lng is not null then
    new.location = ST_SetSRID(ST_MakePoint(new.lng, new.lat), 4326)::geography;
  else
    new.location = null;
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_location_change on public.profiles;
create trigger on_profile_location_change
  before insert or update of lat, lng on public.profiles
  for each row execute procedure public.sync_profile_location();

-- ── Cities (reference table — seeded separately) ──────────────
create table if not exists public.cities (
  id         text primary key,           -- código IBGE (ex: "3550308")
  name       text not null,             -- "São Paulo"
  state_code text not null,             -- "SP"
  state_name text not null,             -- "São Paulo"
  lat        double precision not null,
  lng        double precision not null,
  location   geography(POINT, 4326) generated always as (
               ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
             ) stored,
  population int,
  is_capital boolean not null default false
);

create index if not exists cities_location_gist on public.cities using gist(location);
create index if not exists cities_name_pattern  on public.cities (name text_pattern_ops);
create index if not exists cities_state_code    on public.cities (state_code);

-- ── Trade spots ───────────────────────────────────────────────
create table if not exists public.trade_spots (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  type       text not null check (type in (
               'shopping', 'praca', 'parque', 'cafeteria',
               'universidade', 'biblioteca', 'mercado', 'evento', 'outro'
             )),
  address    text,
  city_id    text references public.cities(id),
  city_name  text not null,
  state_code text not null,
  lat        double precision not null,
  lng        double precision not null,
  location   geography(POINT, 4326),
  verified   boolean not null default false,
  created_by uuid references auth.users(id),
  popularity int not null default 0,
  osm_id     text,
  created_at timestamptz not null default now()
);

create index if not exists trade_spots_location_gist on public.trade_spots using gist(location)
  where location is not null;
create index if not exists trade_spots_city_id  on public.trade_spots(city_id);
create index if not exists trade_spots_verified on public.trade_spots(verified);

create or replace function public.sync_trade_spot_location()
returns trigger language plpgsql security definer as $$
begin
  new.location = ST_SetSRID(ST_MakePoint(new.lng, new.lat), 4326)::geography;
  return new;
end;
$$;

drop trigger if exists on_trade_spot_location_change on public.trade_spots;
create trigger on_trade_spot_location_change
  before insert or update of lat, lng on public.trade_spots
  for each row execute procedure public.sync_trade_spot_location();

-- ── User favourite spots ──────────────────────────────────────
create table if not exists public.user_favorite_spots (
  user_id    uuid not null references auth.users(id)      on delete cascade,
  spot_id    uuid not null references public.trade_spots(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, spot_id)
);

-- ── RLS ───────────────────────────────────────────────────────
alter table public.cities              enable row level security;
alter table public.trade_spots         enable row level security;
alter table public.user_favorite_spots enable row level security;

create policy "cities_public_read"
  on public.cities for select using (true);

create policy "trade_spots_public_read"
  on public.trade_spots for select using (true);

create policy "trade_spots_auth_insert"
  on public.trade_spots for insert
  with check (auth.uid() is not null and auth.uid() = created_by);

create policy "user_fav_spots_owner_select"
  on public.user_favorite_spots for select
  using (auth.uid() = user_id);

create policy "user_fav_spots_owner_insert"
  on public.user_favorite_spots for insert
  with check (auth.uid() = user_id);

create policy "user_fav_spots_owner_delete"
  on public.user_favorite_spots for delete
  using (auth.uid() = user_id);

-- ── Seed: trade spots for top 5 Brazilian capitals ────────────
-- Spots are inserted with lat/lng; trigger sets the location column.

insert into public.trade_spots (name, type, address, city_name, state_code, lat, lng, verified, popularity)
values
  -- São Paulo
  ('Shopping Ibirapuera',     'shopping',     'Av. Ibirapuera, 3103 — Moema, SP',               'São Paulo',       'SP', -23.6039, -46.6659, true, 50),
  ('Shopping JK Iguatemi',    'shopping',     'R. Presidente Juscelino Kubitschek, 2041 — SP',   'São Paulo',       'SP', -23.5981, -46.6891, true, 40),
  ('Parque Ibirapuera',       'parque',       'Av. Pedro Álvares Cabral — Vila Mariana, SP',     'São Paulo',       'SP', -23.5874, -46.6576, true, 60),
  -- Rio de Janeiro
  ('Shopping Rio Sul',        'shopping',     'R. Lauro Müller, 116 — Botafogo, RJ',            'Rio de Janeiro',  'RJ', -22.9498, -43.1792, true, 45),
  ('Parque Lage',             'parque',       'R. Jardim Botânico, 414 — Jardim Botânico, RJ',  'Rio de Janeiro',  'RJ', -22.9711, -43.2132, true, 35),
  -- Belo Horizonte
  ('Shopping Diamond Mall',   'shopping',     'Av. Olegário Maciel, 1600 — Lourdes, BH',        'Belo Horizonte',  'MG', -19.9350, -43.9476, true, 30),
  ('Parque Municipal',        'parque',       'Av. Afonso Pena — Centro, BH',                   'Belo Horizonte',  'MG', -19.9233, -43.9373, true, 25),
  -- Curitiba
  ('Shopping Palladium',      'shopping',     'Av. Presidente Kennedy, 4121 — Portão, Curitiba','Curitiba',        'PR', -25.4651, -49.3098, true, 28),
  ('Jardim Botânico de Curitiba','parque',    'R. Eng. Ostoja Roguski — Curitiba',              'Curitiba',        'PR', -25.4393, -49.2358, true, 32),
  -- Porto Alegre
  ('Shopping Iguatemi PoA',   'shopping',     'Av. João Wallig, 1800 — Passo da Areia, PoA',    'Porto Alegre',    'RS', -30.0284, -51.1658, true, 22),
  ('Parque Marinha do Brasil', 'parque',      'Av. Edvaldo Pereira Paiva — Centro, PoA',        'Porto Alegre',    'RS', -30.0420, -51.2228, true, 20)
on conflict do nothing;
