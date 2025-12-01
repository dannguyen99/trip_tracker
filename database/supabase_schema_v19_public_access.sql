-- Add is_public column to trips
ALTER TABLE public.trips ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Update RLS for trips to allow anonymous SELECT if is_public is true
DROP POLICY IF EXISTS "Users can view trips they own or are members of" ON public.trips;

CREATE POLICY "Users can view trips they own, are members of, or are public" ON public.trips
  FOR SELECT USING (
    auth.uid() = owner_id
    OR
    id IN (
      SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid()
    )
    OR
    is_public = true
  );

-- Update RLS for trips to allow owners to UPDATE is_public
-- (Existing policy "Users can update their own trips" should cover this if it checks owner_id)
-- Let's ensure update policy is correct
DROP POLICY IF EXISTS "Users can update their own trips" ON public.trips;
CREATE POLICY "Users can update their own trips" ON public.trips
  FOR UPDATE USING (
    auth.uid() = owner_id
  );


-- Helper function to check if a trip is public
CREATE OR REPLACE FUNCTION public.is_trip_public(_trip_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.trips
    WHERE id = _trip_id AND is_public = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Update RLS for child tables to allow ANON access if trip is public

-- 1. Expenses
DROP POLICY IF EXISTS "Users can view expenses of their trips" ON public.expenses;
CREATE POLICY "Users can view expenses of accessible trips" ON public.expenses
  FOR SELECT USING (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

DROP POLICY IF EXISTS "Users can insert expenses to their trips" ON public.expenses;
CREATE POLICY "Users can insert expenses to accessible trips" ON public.expenses
  FOR INSERT WITH CHECK (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

DROP POLICY IF EXISTS "Users can update expenses of their trips" ON public.expenses;
CREATE POLICY "Users can update expenses of accessible trips" ON public.expenses
  FOR UPDATE USING (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

DROP POLICY IF EXISTS "Users can delete expenses of their trips" ON public.expenses;
CREATE POLICY "Users can delete expenses of accessible trips" ON public.expenses
  FOR DELETE USING (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

-- 2. Trip Members (Allow viewing and adding members for public trips)
DROP POLICY IF EXISTS "Users can view members of their trips" ON public.trip_members;
CREATE POLICY "Users can view members of accessible trips" ON public.trip_members
  FOR SELECT USING (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

DROP POLICY IF EXISTS "Trip owners can add members" ON public.trip_members;
CREATE POLICY "Users can add members to accessible trips" ON public.trip_members
  FOR INSERT WITH CHECK (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );
  
-- 3. Hotels
DROP POLICY IF EXISTS "Users can view hotels of their trips" ON public.hotels;
CREATE POLICY "Users can view hotels of accessible trips" ON public.hotels
  FOR SELECT USING (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );
  
CREATE POLICY "Users can insert hotels to accessible trips" ON public.hotels
  FOR INSERT WITH CHECK (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );
  
CREATE POLICY "Users can delete hotels of accessible trips" ON public.hotels
  FOR DELETE USING (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

-- 4. Restaurants
DROP POLICY IF EXISTS "Users can view restaurants of their trips" ON public.restaurants;
CREATE POLICY "Users can view restaurants of accessible trips" ON public.restaurants
  FOR SELECT USING (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

CREATE POLICY "Users can insert restaurants to accessible trips" ON public.restaurants
  FOR INSERT WITH CHECK (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

CREATE POLICY "Users can update restaurants of accessible trips" ON public.restaurants
  FOR UPDATE USING (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

CREATE POLICY "Users can delete restaurants of accessible trips" ON public.restaurants
  FOR DELETE USING (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

-- 5. Activities
DROP POLICY IF EXISTS "Users can view activities of their trips" ON public.activities;
CREATE POLICY "Users can view activities of accessible trips" ON public.activities
  FOR SELECT USING (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

CREATE POLICY "Users can insert activities to accessible trips" ON public.activities
  FOR INSERT WITH CHECK (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

CREATE POLICY "Users can update activities of accessible trips" ON public.activities
  FOR UPDATE USING (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

CREATE POLICY "Users can delete activities of accessible trips" ON public.activities
  FOR DELETE USING (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

-- 6. Packing Items
DROP POLICY IF EXISTS "Users can view packing items of their trips" ON public.packing_items;
CREATE POLICY "Users can view packing items of accessible trips" ON public.packing_items
  FOR SELECT USING (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

CREATE POLICY "Users can insert packing items to accessible trips" ON public.packing_items
  FOR INSERT WITH CHECK (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

CREATE POLICY "Users can update packing items of accessible trips" ON public.packing_items
  FOR UPDATE USING (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );

CREATE POLICY "Users can delete packing items of accessible trips" ON public.packing_items
  FOR DELETE USING (
    trip_id IN (
      SELECT id FROM public.trips 
      WHERE owner_id = auth.uid() 
      OR id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
      OR is_public = true
    )
  );
