-- Add settings columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS language text DEFAULT 'en',
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'VND';

-- Update existing profiles to have default values if null (though DEFAULT handles new rows)
UPDATE public.profiles SET language = 'en' WHERE language IS NULL;
UPDATE public.profiles SET currency = 'VND' WHERE currency IS NULL;
