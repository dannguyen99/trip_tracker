-- Add user_id to trip_members
ALTER TABLE public.trip_members ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Enable RLS on trip_members
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;

-- Policies for trip_members

-- 1. View members: Users can view members of trips they are part of OR trips they own
CREATE POLICY "Users can view members of their trips" ON public.trip_members
  FOR SELECT USING (
    trip_id IN (
      SELECT id FROM public.trips WHERE owner_id = auth.uid()
    )
    OR
    trip_id IN (
      SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid()
    )
  );

-- 2. Insert members: Only trip owners can add members (for now)
CREATE POLICY "Trip owners can add members" ON public.trip_members
  FOR INSERT WITH CHECK (
    trip_id IN (
      SELECT id FROM public.trips WHERE owner_id = auth.uid()
    )
  );

-- 3. Update members: Only trip owners can update members
CREATE POLICY "Trip owners can update members" ON public.trip_members
  FOR UPDATE USING (
    trip_id IN (
      SELECT id FROM public.trips WHERE owner_id = auth.uid()
    )
  );

-- 4. Delete members: Only trip owners can remove members
CREATE POLICY "Trip owners can remove members" ON public.trip_members
  FOR DELETE USING (
    trip_id IN (
      SELECT id FROM public.trips WHERE owner_id = auth.uid()
    )
  );

-- 5. Update trips policy to allow members to view
DROP POLICY IF EXISTS "Users can view their own trips" ON public.trips;

CREATE POLICY "Users can view trips they own or are members of" ON public.trips
  FOR SELECT USING (
    auth.uid() = owner_id
    OR
    id IN (
      SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid()
    )
  );
