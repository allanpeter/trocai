-- ============================================================
-- trocai.app — Matching RPC
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- find_matches(user_id, album_id, city, limit)
--
-- Returns other users ranked by overlap_score:
--   they_have_you_need  = stickers they have (have/duplicate) that you need
--   you_have_they_need  = stickers you have (have/duplicate) that they need
--   overlap_score       = sum of both (higher = better match)
--
-- Filters:
--   • Excludes the calling user
--   • If city is provided, only returns users in that city (optional)
--   • Requires at least 1 overlap in each direction

create or replace function public.find_matches(
  p_user_id uuid,
  p_album_id uuid,
  p_city     text    default null,
  p_limit    int     default 20
)
returns table (
  user_id           uuid,
  username          text,
  city              text,
  state             text,
  avatar_url        text,
  rating            numeric,
  trades_count      int,
  they_have_you_need int,
  you_have_they_need int,
  overlap_score     int
)
language sql stable security definer
as $$
  with
    -- stickers the caller needs
    my_needs as (
      select us.sticker_id
      from   public.user_stickers us
      join   public.stickers      s  on s.id = us.sticker_id
      where  us.user_id  = p_user_id
        and  s.album_id  = p_album_id
        and  us.status   = 'need'
    ),
    -- stickers the caller can offer (have or duplicate)
    my_haves as (
      select us.sticker_id
      from   public.user_stickers us
      join   public.stickers      s  on s.id = us.sticker_id
      where  us.user_id  = p_user_id
        and  s.album_id  = p_album_id
        and  us.status  in ('have', 'duplicate')
    ),
    -- for every other user in same album, count overlaps
    candidates as (
      select
        other.user_id,
        count(distinct case when other.status in ('have','duplicate') and mn.sticker_id is not null then other.sticker_id end)::int as they_have_you_need,
        count(distinct case when other.status = 'need'               and mh.sticker_id is not null then other.sticker_id end)::int as you_have_they_need
      from public.user_stickers other
      join public.stickers      s  on s.id = other.sticker_id and s.album_id = p_album_id
      left join my_needs        mn on mn.sticker_id = other.sticker_id
      left join my_haves        mh on mh.sticker_id = other.sticker_id
      where other.user_id <> p_user_id
      group by other.user_id
    )
  select
    p.id                          as user_id,
    p.username,
    p.city,
    p.state,
    p.avatar_url,
    p.rating,
    p.trades_count,
    c.they_have_you_need,
    c.you_have_they_need,
    (c.they_have_you_need + c.you_have_they_need) as overlap_score
  from candidates   c
  join public.profiles p on p.id = c.user_id
  where c.they_have_you_need > 0
    and c.you_have_they_need > 0
    and (p_city is null or p.city ilike p_city)
  order by overlap_score desc
  limit p_limit;
$$;

-- Grant execute to authenticated users
grant execute on function public.find_matches(uuid, uuid, text, int) to authenticated;
