-- ============================================================
-- trocai.app — find_matches_v2
-- Run AFTER 004_location_upgrade.sql
-- ============================================================

-- find_matches_v2(user_id, album_id, radius_km, limit)
--
-- Extends find_matches with:
--   distance_km   = geodesic distance between users (null if either has no location)
--   match_score   = composite score: 60% overlap + 25% proximity + 15% reputation
--                   (falls back to 75% overlap + 25% reputation when location missing)
--
-- p_radius_km = null → no distance filter (global search)

create or replace function public.find_matches_v2(
  p_user_id   uuid,
  p_album_id  uuid,
  p_radius_km double precision default null,
  p_limit     int              default 20
)
returns table (
  user_id            uuid,
  username           text,
  city_name          text,
  state_code         text,
  avatar_url         text,
  rating             numeric,
  trades_count       int,
  they_have_you_need int,
  you_have_they_need int,
  overlap_score      int,
  distance_km        double precision,
  match_score        double precision
)
language sql stable security definer
as $$
  with
    my_loc as (
      select location from public.profiles where id = p_user_id
    ),
    my_needs as (
      select us.sticker_id
      from   public.user_stickers us
      join   public.stickers      s  on s.id = us.sticker_id
      where  us.user_id = p_user_id
        and  s.album_id = p_album_id
        and  us.status  = 'need'
    ),
    my_haves as (
      select us.sticker_id
      from   public.user_stickers us
      join   public.stickers      s  on s.id = us.sticker_id
      where  us.user_id = p_user_id
        and  s.album_id = p_album_id
        and  us.status in ('have', 'duplicate')
    ),
    candidates as (
      select
        other.user_id,
        count(distinct case
          when other.status in ('have', 'duplicate') and mn.sticker_id is not null
          then other.sticker_id end)::int as they_have_you_need,
        count(distinct case
          when other.status = 'need' and mh.sticker_id is not null
          then other.sticker_id end)::int as you_have_they_need
      from public.user_stickers other
      join public.stickers      s  on s.id = other.sticker_id and s.album_id = p_album_id
      left join my_needs        mn on mn.sticker_id = other.sticker_id
      left join my_haves        mh on mh.sticker_id = other.sticker_id
      where other.user_id <> p_user_id
      group by other.user_id
    )
  select
    p.id                                                            as user_id,
    p.username,
    coalesce(p.city_name, p.city)                                  as city_name,
    coalesce(p.state_code, p.state)                                as state_code,
    p.avatar_url,
    p.rating,
    p.trades_count,
    c.they_have_you_need,
    c.you_have_they_need,
    (c.they_have_you_need + c.you_have_they_need)                  as overlap_score,
    case
      when p.location is not null and ml.location is not null
        then round((ST_Distance(ml.location, p.location) / 1000.0)::numeric, 1)::double precision
      else null
    end                                                            as distance_km,
    case
      when p.location is not null and ml.location is not null and p_radius_km is not null
        then (
          0.60 * (c.they_have_you_need + c.you_have_they_need)::double precision / 30.0
          + 0.25 * greatest(0.0, 1.0 - ST_Distance(ml.location, p.location) / 1000.0 / p_radius_km)
          + 0.15 * (p.rating::double precision / 5.0)
        )
      else (
        0.75 * (c.they_have_you_need + c.you_have_they_need)::double precision / 30.0
        + 0.25 * (p.rating::double precision / 5.0)
      )
    end                                                            as match_score
  from candidates     c
  join public.profiles p  on p.id = c.user_id
  cross join my_loc   ml
  where c.they_have_you_need > 0
    and c.you_have_they_need > 0
    and (
      p_radius_km is null
      or ml.location is null
      or p.location is null
      or ST_DWithin(ml.location, p.location, p_radius_km * 1000.0)
    )
  order by match_score desc
  limit p_limit;
$$;

grant execute on function public.find_matches_v2(uuid, uuid, double precision, int) to authenticated;
