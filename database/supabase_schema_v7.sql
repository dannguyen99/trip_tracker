-- Migration v7: Add rich fields to activities table
ALTER TABLE activities 
ADD COLUMN icon TEXT,
ADD COLUMN tag TEXT,
ADD COLUMN tag_color TEXT, -- 'blue', 'red', 'orange', 'green', 'purple', 'yellow'
ADD COLUMN tips TEXT,
ADD COLUMN rating NUMERIC,
ADD COLUMN images TEXT[]; -- Array of image URLs

-- Comment
COMMENT ON COLUMN activities.icon IS 'Phosphor icon class name (e.g., ph-star)';
COMMENT ON COLUMN activities.tag IS 'Custom label for the activity (e.g., Must Try)';
COMMENT ON COLUMN activities.tag_color IS 'Color theme for the tag';
COMMENT ON COLUMN activities.tips IS 'Helpful tips for the activity';
