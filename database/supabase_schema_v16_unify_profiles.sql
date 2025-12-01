-- 1. Make name and avatar nullable in trip_members
ALTER TABLE public.trip_members ALTER COLUMN name DROP NOT NULL;
ALTER TABLE public.trip_members ALTER COLUMN avatar DROP NOT NULL;

-- 2. Change user_id FK to reference profiles instead of auth.users
-- This allows easy joining with profiles table in Supabase queries
ALTER TABLE public.trip_members DROP CONSTRAINT IF EXISTS trip_members_user_id_fkey;
ALTER TABLE public.trip_members 
  ADD CONSTRAINT trip_members_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.profiles(id);
