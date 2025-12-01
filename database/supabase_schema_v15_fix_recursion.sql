-- Fix infinite recursion by using a SECURITY DEFINER function
-- This function bypasses RLS to get the list of trip IDs the user is a member of.

CREATE OR REPLACE FUNCTION get_my_trip_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT trip_id FROM trip_members WHERE user_id = auth.uid();
$$;

-- Update trips policy
DROP POLICY IF EXISTS "Users can view trips they own or are members of" ON public.trips;

CREATE POLICY "Users can view trips they own or are members of" ON public.trips
  FOR SELECT USING (
    auth.uid() = owner_id
    OR
    id IN (SELECT get_my_trip_ids())
  );

-- Update trip_members policy
DROP POLICY IF EXISTS "Users can view members of their trips" ON public.trip_members;

CREATE POLICY "Users can view members of their trips" ON public.trip_members
  FOR SELECT USING (
    trip_id IN (
      SELECT id FROM public.trips WHERE owner_id = auth.uid()
    )
    OR
    trip_id IN (SELECT get_my_trip_ids())
  );
