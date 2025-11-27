-- Migration v4: Add category field to restaurants
ALTER TABLE restaurants 
ADD COLUMN category TEXT;

-- Update the comment to reflect the new schema
COMMENT ON TABLE restaurants IS 'Stores restaurant recommendations for trips, including category.';
