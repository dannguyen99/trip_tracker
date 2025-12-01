-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.activities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  trip_id uuid,
  name text NOT NULL,
  description text,
  location text,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone,
  type text NOT NULL DEFAULT 'activity'::text,
  status text DEFAULT 'planned'::text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  icon text,
  tag text,
  tag_color text,
  tips text,
  rating numeric,
  images ARRAY,
  destination_id uuid,
  CONSTRAINT activities_pkey PRIMARY KEY (id),
  CONSTRAINT activities_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id),
  CONSTRAINT activities_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id)
);
CREATE TABLE public.destinations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL,
  name text NOT NULL,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  cover_image text,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT destinations_pkey PRIMARY KEY (id),
  CONSTRAINT destinations_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id)
);
CREATE TABLE public.expenses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL,
  payer_id uuid,
  description text NOT NULL,
  amount_vnd numeric NOT NULL,
  original_amount numeric NOT NULL,
  currency text NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['SHARED'::text, 'PERSONAL'::text])),
  category text NOT NULL,
  date timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  split_to ARRAY,
  CONSTRAINT expenses_pkey PRIMARY KEY (id),
  CONSTRAINT expenses_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id),
  CONSTRAINT expenses_payer_id_fkey FOREIGN KEY (payer_id) REFERENCES public.trip_members(id)
);
CREATE TABLE public.hotels (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL,
  name text NOT NULL,
  address text,
  check_in date,
  check_out date,
  price numeric DEFAULT 0,
  booking_ref text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  destination_id uuid,
  CONSTRAINT hotels_pkey PRIMARY KEY (id),
  CONSTRAINT hotels_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id),
  CONSTRAINT hotels_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id)
);
CREATE TABLE public.packing_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Essentials'::text,
  is_checked boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  assigned_to uuid,
  CONSTRAINT packing_items_pkey PRIMARY KEY (id),
  CONSTRAINT packing_items_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id),
  CONSTRAINT packing_items_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.trip_members(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  updated_at timestamp with time zone,
  username text UNIQUE CHECK (char_length(username) >= 3),
  full_name text,
  avatar_url text,
  website text,
  language text DEFAULT 'en'::text,
  currency text DEFAULT 'VND'::text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.restaurants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL,
  name text NOT NULL,
  url text,
  notes text,
  is_tried boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  cuisine text,
  price_range text,
  rating numeric,
  location text,
  description text,
  image_url text,
  tiktok_url text,
  latitude numeric,
  longitude numeric,
  destination_id uuid,
  CONSTRAINT restaurants_pkey PRIMARY KEY (id),
  CONSTRAINT restaurants_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id),
  CONSTRAINT restaurants_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id)
);
CREATE TABLE public.trip_members (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  trip_id uuid NOT NULL,
  name text,
  avatar text,
  color text,
  bg text,
  border text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  user_id uuid,
  CONSTRAINT trip_members_pkey PRIMARY KEY (id),
  CONSTRAINT trip_members_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id),
  CONSTRAINT trip_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.trips (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  name text NOT NULL,
  currency text DEFAULT 'THB'::text,
  exchange_rate numeric DEFAULT 740,
  total_budget_vnd numeric DEFAULT 0,
  start_date date,
  end_date date,
  owner_id uuid,
  is_public boolean DEFAULT false,
  CONSTRAINT trips_pkey PRIMARY KEY (id),
  CONSTRAINT trips_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id)
);