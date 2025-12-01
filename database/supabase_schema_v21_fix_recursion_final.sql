-- Final fix for RLS Infinite Recursion
-- The previous fix was insufficient because listing trips still triggered the loop via trip_members check.
-- We will use a SECURITY DEFINER function to check access, which bypasses RLS on the tables it queries.

-- 1. Create helper function
CREATE OR REPLACE FUNCTION public.can_access_trip(_trip_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Check if:
  -- 1. Trip is public
  -- 2. User is owner
  -- 3. User is a member
  RETURN EXISTS (
    SELECT 1
    FROM public.trips t
    LEFT JOIN public.trip_members tm ON t.id = tm.trip_id AND tm.user_id = auth.uid()
    WHERE t.id = _trip_id
    AND (
      t.is_public = true
      OR t.owner_id = auth.uid()
      OR tm.user_id IS NOT NULL
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update trip_members policy
-- We use the function to check if the user can view the trip (and thus its members)
DROP POLICY IF EXISTS "Users can view members of accessible trips" ON public.trip_members;

CREATE POLICY "Users can view members of accessible trips" ON public.trip_members
  FOR SELECT USING (
    public.can_access_trip(trip_id)
  );

-- 3. Update Child Tables to use the function (Cleaner and safer)

-- Expenses
DROP POLICY IF EXISTS "Users can view expenses of accessible trips" ON public.expenses;
CREATE POLICY "Users can view expenses of accessible trips" ON public.expenses
  FOR SELECT USING ( public.can_access_trip(trip_id) );

DROP POLICY IF EXISTS "Users can insert expenses to accessible trips" ON public.expenses;
CREATE POLICY "Users can insert expenses to accessible trips" ON public.expenses
  FOR INSERT WITH CHECK ( public.can_access_trip(trip_id) );

DROP POLICY IF EXISTS "Users can update expenses of accessible trips" ON public.expenses;
CREATE POLICY "Users can update expenses of accessible trips" ON public.expenses
  FOR UPDATE USING ( public.can_access_trip(trip_id) );

DROP POLICY IF EXISTS "Users can delete expenses of accessible trips" ON public.expenses;
CREATE POLICY "Users can delete expenses of accessible trips" ON public.expenses
  FOR DELETE USING ( public.can_access_trip(trip_id) );

-- Hotels
DROP POLICY IF EXISTS "Users can view hotels of accessible trips" ON public.hotels;
CREATE POLICY "Users can view hotels of accessible trips" ON public.hotels
  FOR SELECT USING ( public.can_access_trip(trip_id) );

DROP POLICY IF EXISTS "Users can insert hotels to accessible trips" ON public.hotels;
CREATE POLICY "Users can insert hotels to accessible trips" ON public.hotels
  FOR INSERT WITH CHECK ( public.can_access_trip(trip_id) );

DROP POLICY IF EXISTS "Users can delete hotels of accessible trips" ON public.hotels;
CREATE POLICY "Users can delete hotels of accessible trips" ON public.hotels
  FOR DELETE USING ( public.can_access_trip(trip_id) );

-- Restaurants
DROP POLICY IF EXISTS "Users can view restaurants of accessible trips" ON public.restaurants;
CREATE POLICY "Users can view restaurants of accessible trips" ON public.restaurants
  FOR SELECT USING ( public.can_access_trip(trip_id) );

DROP POLICY IF EXISTS "Users can insert restaurants to accessible trips" ON public.restaurants;
CREATE POLICY "Users can insert restaurants to accessible trips" ON public.restaurants
  FOR INSERT WITH CHECK ( public.can_access_trip(trip_id) );

DROP POLICY IF EXISTS "Users can update restaurants of accessible trips" ON public.restaurants;
CREATE POLICY "Users can update restaurants of accessible trips" ON public.restaurants
  FOR UPDATE USING ( public.can_access_trip(trip_id) );

DROP POLICY IF EXISTS "Users can delete restaurants of accessible trips" ON public.restaurants;
CREATE POLICY "Users can delete restaurants of accessible trips" ON public.restaurants
  FOR DELETE USING ( public.can_access_trip(trip_id) );

-- Activities
DROP POLICY IF EXISTS "Users can view activities of accessible trips" ON public.activities;
CREATE POLICY "Users can view activities of accessible trips" ON public.activities
  FOR SELECT USING ( public.can_access_trip(trip_id) );

DROP POLICY IF EXISTS "Users can insert activities to accessible trips" ON public.activities;
CREATE POLICY "Users can insert activities to accessible trips" ON public.activities
  FOR INSERT WITH CHECK ( public.can_access_trip(trip_id) );

DROP POLICY IF EXISTS "Users can update activities of accessible trips" ON public.activities;
CREATE POLICY "Users can update activities of accessible trips" ON public.activities
  FOR UPDATE USING ( public.can_access_trip(trip_id) );

DROP POLICY IF EXISTS "Users can delete activities of accessible trips" ON public.activities;
CREATE POLICY "Users can delete activities of accessible trips" ON public.activities
  FOR DELETE USING ( public.can_access_trip(trip_id) );

-- Packing Items
DROP POLICY IF EXISTS "Users can view packing items of accessible trips" ON public.packing_items;
CREATE POLICY "Users can view packing items of accessible trips" ON public.packing_items
  FOR SELECT USING ( public.can_access_trip(trip_id) );

DROP POLICY IF EXISTS "Users can insert packing items to accessible trips" ON public.packing_items;
CREATE POLICY "Users can insert packing items to accessible trips" ON public.packing_items
  FOR INSERT WITH CHECK ( public.can_access_trip(trip_id) );

DROP POLICY IF EXISTS "Users can update packing items of accessible trips" ON public.packing_items;
CREATE POLICY "Users can update packing items of accessible trips" ON public.packing_items
  FOR UPDATE USING ( public.can_access_trip(trip_id) );

DROP POLICY IF EXISTS "Users can delete packing items of accessible trips" ON public.packing_items;
CREATE POLICY "Users can delete packing items of accessible trips" ON public.packing_items
  FOR DELETE USING ( public.can_access_trip(trip_id) );
