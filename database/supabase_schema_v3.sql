-- Add rich data columns to restaurants table
ALTER TABLE restaurants 
ADD COLUMN cuisine TEXT,
ADD COLUMN price_range TEXT, -- $, $$, $$$
ADD COLUMN rating NUMERIC, -- 1.0 to 5.0
ADD COLUMN location TEXT,
ADD COLUMN description TEXT,
ADD COLUMN image_url TEXT;

-- Update RLS policies if needed (existing ones should cover updates, but good to double check)
-- The existing policies are "true" for all, so no changes needed for RLS.
