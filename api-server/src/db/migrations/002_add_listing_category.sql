-- Add category for stays vs on-trip services
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS category VARCHAR(40) NOT NULL DEFAULT 'stays';

CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
