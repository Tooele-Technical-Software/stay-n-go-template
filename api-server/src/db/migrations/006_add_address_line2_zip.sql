-- Second address line and postal code for listings

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS address_line_2 VARCHAR(255),
  ADD COLUMN IF NOT EXISTS zip_code VARCHAR(20);
