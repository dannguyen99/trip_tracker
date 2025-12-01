-- Migration script to wire existing "orphaned" trips to a specific user.
-- Usage: Replace 'YOUR_USER_ID' with the actual UUID of the user you want to own these trips.

DO $$
DECLARE
  -- REPLACE THIS WITH YOUR ACTUAL USER ID (e.g., from Supabase Auth dashboard)
  target_user_id uuid := 'YOUR_USER_ID';
BEGIN
  -- 1. Set owner for orphaned trips (trips with no owner_id)
  UPDATE public.trips 
  SET owner_id = target_user_id 
  WHERE owner_id IS NULL;

  -- 2. Add the target user as a member to these trips
  -- This ensures they show up in the "Shared with me" or "My Trips" lists correctly
  INSERT INTO public.trip_members (trip_id, user_id, name, avatar, color, bg, border)
  SELECT id, target_user_id, 'Admin', '👑', '#3B82F6', 'bg-blue-100', 'border-blue-500'
  FROM public.trips
  WHERE owner_id = target_user_id
  AND id NOT IN (SELECT trip_id FROM public.trip_members WHERE user_id = target_user_id);
  
  RAISE NOTICE 'Migration completed for user %', target_user_id;
END $$;
