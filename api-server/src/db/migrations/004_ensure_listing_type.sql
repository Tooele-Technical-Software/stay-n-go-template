-- Ensure listing_type column exists (safe to re-run)
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS listing_type VARCHAR(20) NOT NULL DEFAULT 'homes';

UPDATE listings SET category = 'homes', listing_type = 'homes'
  WHERE category IN ('stays', 'homes');

UPDATE listings SET listing_type = 'services'
  WHERE category IN ('chef', 'spa', 'cleaning', 'photography', 'pets', 'wellness', 'catering');

UPDATE listings SET listing_type = 'experiences'
  WHERE category IN ('food_tour', 'hiking', 'wine_tasting', 'surf_lesson', 'art_class', 'live_music');

CREATE INDEX IF NOT EXISTS idx_listings_listing_type ON listings(listing_type);
