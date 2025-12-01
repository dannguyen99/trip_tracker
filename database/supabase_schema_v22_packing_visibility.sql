-- Migration v22: Add privacy controls to packing items

-- 1. Add is_private column
ALTER TABLE packing_items ADD COLUMN is_private BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN packing_items.is_private IS 'If true, item is only visible to the assigned user.';

-- 2. Update RLS Policies

-- Drop existing policies to redefine them
DROP POLICY IF EXISTS "Enable read access for all users" ON packing_items;
DROP POLICY IF EXISTS "Enable insert access for all users" ON packing_items;
DROP POLICY IF EXISTS "Enable update access for all users" ON packing_items;
DROP POLICY IF EXISTS "Enable delete access for all users" ON packing_items;

-- Re-enable RLS (just in case)
ALTER TABLE packing_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is the assignee
-- We need to link auth.uid() -> trip_members.user_id -> packing_items.assigned_to
-- packing_items.assigned_to references trip_members(id)

-- Policy: SELECT
-- Visible if:
-- 1. is_private is FALSE (Public/Group item)
-- 2. OR is_private is TRUE AND current user is the assignee
CREATE POLICY "packing_items_select_policy" ON packing_items FOR SELECT USING (
  (is_private = FALSE) OR
  (
    is_private = TRUE AND
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.id = packing_items.assigned_to
      AND trip_members.user_id = auth.uid()
    )
  )
);

-- Policy: INSERT
-- Allow insert if user has access to the trip (handled by parent RLS usually, but here we check trip_id)
-- For simplicity, we allow insert if user is a member of the trip.
-- We can reuse the `can_access_trip` function if available, or just check membership.
CREATE POLICY "packing_items_insert_policy" ON packing_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM trip_members
    WHERE trip_members.trip_id = packing_items.trip_id
    AND trip_members.user_id = auth.uid()
  )
);

-- Policy: UPDATE
-- Allow update if:
-- 1. User is the assignee
-- 2. OR Item is public (is_private = FALSE) AND User is a member of the trip
-- 3. OR User is the Trip Owner (can manage everything)
CREATE POLICY "packing_items_update_policy" ON packing_items FOR UPDATE USING (
  -- Is Assignee
  (
    assigned_to IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.id = packing_items.assigned_to
      AND trip_members.user_id = auth.uid()
    )
  ) OR
  -- Is Public Item (and user is member)
  (
    is_private = FALSE AND
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = packing_items.trip_id
      AND trip_members.user_id = auth.uid()
    )
  ) OR
  -- Is Trip Owner
  (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = packing_items.trip_id
      AND trips.owner_id = auth.uid()
    )
  )
);

-- Policy: DELETE
-- Same as Update
CREATE POLICY "packing_items_delete_policy" ON packing_items FOR DELETE USING (
  -- Is Assignee
  (
    assigned_to IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.id = packing_items.assigned_to
      AND trip_members.user_id = auth.uid()
    )
  ) OR
  -- Is Public Item (and user is member)
  (
    is_private = FALSE AND
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = packing_items.trip_id
      AND trip_members.user_id = auth.uid()
    )
  ) OR
  -- Is Trip Owner
  (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = packing_items.trip_id
      AND trips.owner_id = auth.uid()
    )
  )
);
