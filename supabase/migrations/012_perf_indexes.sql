-- Performance indexes
-- trade_spots: filter by state_code (chat and matches pages both use this)
create index if not exists trade_spots_state_code on public.trade_spots(state_code);

-- user_stickers: composite index for find_matches_v2 candidates CTE
-- The CTE joins user_stickers on sticker_id and groups by user_id
create index if not exists user_stickers_sticker_status_user
  on public.user_stickers(sticker_id, status, user_id);
