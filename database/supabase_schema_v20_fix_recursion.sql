-- Fix infinite recursion in trip_members policy
-- The recursion happens because trips policy checks trip_members, and trip_members policy checks trips.
-- We break this by allowing users to ALWAYS see their own membership rows without checking the trip.

DROP POLICY IF EXISTS "Users can view members of accessible trips" ON public.trip_members;

CREATE POLICY "Users can view members of accessible trips" ON public.trip_members
  FOR SELECT USING (
    -- Break recursion: Always allow seeing own membership
    user_id = auth.uid()
    OR
    -- Otherwise, check if trip is visible (which triggers trips RLS)
    trip_id IN (
      SELECT id FROM public.trips
    )
  );

-- We can also simplify the other policies to rely on the trips RLS instead of repeating logic,
-- now that the recursion is broken.

-- Expenses
DROP POLICY IF EXISTS "Users can view expenses of accessible trips" ON public.expenses;
CREATE POLICY "Users can view expenses of accessible trips" ON public.expenses
  FOR SELECT USING (
    trip_id IN (SELECT id FROM public.trips)
  );

-- Hotels
DROP POLICY IF EXISTS "Users can view hotels of accessible trips" ON public.hotels;
CREATE POLICY "Users can view hotels of accessible trips" ON public.hotels
  FOR SELECT USING (
    trip_id IN (SELECT id FROM public.trips)
  );

-- Restaurants
DROP POLICY IF EXISTS "Users can view restaurants of accessible trips" ON public.restaurants;
CREATE POLICY "Users can view restaurants of accessible trips" ON public.restaurants
  FOR SELECT USING (
    trip_id IN (SELECT id FROM public.trips)
  );

-- Activities
DROP POLICY IF EXISTS "Users can view activities of accessible trips" ON public.activities;
CREATE POLICY "Users can view activities of accessible trips" ON public.activities
  FOR SELECT USING (
    trip_id IN (SELECT id FROM public.trips)
  );

-- Packing Items
DROP POLICY IF EXISTS "Users can view packing items of accessible trips" ON public.packing_items;
CREATE POLICY "Users can view packing items of accessible trips" ON public.packing_items
  FOR SELECT USING (
    trip_id IN (SELECT id FROM public.trips)
  );
