-- Street address and home property type (homes only)

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS address VARCHAR(255),
  ADD COLUMN IF NOT EXISTS home_type VARCHAR(40);
