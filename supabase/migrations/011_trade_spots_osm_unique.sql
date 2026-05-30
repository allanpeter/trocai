-- Remove duplicate OSM spots (keep the most recently created for each osm_id)
DELETE FROM public.trade_spots
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY osm_id ORDER BY created_at DESC) AS rn
    FROM public.trade_spots
    WHERE osm_id IS NOT NULL
  ) ranked
  WHERE rn > 1
);

-- Add unique constraint so future upserts on osm_id work correctly
ALTER TABLE public.trade_spots
  ADD CONSTRAINT trade_spots_osm_id_unique UNIQUE (osm_id);
