-- Migration v10: Add assignment to packing items
ALTER TABLE packing_items ADD COLUMN assigned_to UUID REFERENCES trip_members(id) ON DELETE SET NULL;

-- Comment
COMMENT ON COLUMN packing_items.assigned_to IS 'The trip member responsible for this item.';
