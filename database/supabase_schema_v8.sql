-- Migration v8: Add location coordinates to restaurants
ALTER TABLE restaurants 
ADD COLUMN latitude NUMERIC,
ADD COLUMN longitude NUMERIC;

-- Comment
COMMENT ON COLUMN restaurants.latitude IS 'Latitude of the restaurant location';
COMMENT ON COLUMN restaurants.longitude IS 'Longitude of the restaurant location';
