-- Normalize homes category and add listing_type for top-level navigation
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS listing_type VARCHAR(20) NOT NULL DEFAULT 'homes';

UPDATE listings SET category = 'homes', listing_type = 'homes'
  WHERE category IN ('stays', 'homes');

UPDATE listings SET listing_type = 'services'
  WHERE category IN ('chef', 'spa', 'cleaning', 'photography', 'pets', 'wellness', 'catering');

CREATE INDEX IF NOT EXISTS idx_listings_listing_type ON listings(listing_type);
