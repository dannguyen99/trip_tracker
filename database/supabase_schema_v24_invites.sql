-- Create trip_invites table
CREATE TABLE IF NOT EXISTS public.trip_invites (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id uuid REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    token text DEFAULT encode(gen_random_bytes(16), 'hex') UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by uuid REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- Enable RLS
ALTER TABLE public.trip_invites ENABLE ROW LEVEL SECURITY;

-- Policies
-- Owners can view/create invites for their trips
CREATE POLICY "Owners can view invites" ON public.trip_invites
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.trips WHERE id = trip_invites.trip_id AND owner_id = auth.uid())
    );

CREATE POLICY "Owners can create invites" ON public.trip_invites
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.trips WHERE id = trip_invites.trip_id AND owner_id = auth.uid())
    );

-- Functions

-- Get trip details by invite token (Publicly accessible via RPC)
CREATE OR REPLACE FUNCTION public.get_trip_details_by_invite(invite_token text)
RETURNS TABLE (
    trip_id uuid,
    trip_name text,
    owner_name text,
    owner_avatar text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.id,
        t.name,
        p.full_name,
        p.avatar_url
    FROM public.trip_invites i
    JOIN public.trips t ON t.id = i.trip_id
    JOIN public.profiles p ON p.id = t.owner_id
    WHERE i.token = invite_token;
END;
$$;

-- Join trip via invite
CREATE OR REPLACE FUNCTION public.join_trip_via_invite(invite_token text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_trip_id uuid;
    v_user_id uuid;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Get trip id from token
    SELECT trip_id INTO v_trip_id
    FROM public.trip_invites
    WHERE token = invite_token;

    IF v_trip_id IS NULL THEN
        RAISE EXCEPTION 'Invalid token';
    END IF;

    -- Check if already a member
    IF EXISTS (SELECT 1 FROM public.trip_members WHERE trip_id = v_trip_id AND user_id = v_user_id) THEN
        RETURN v_trip_id; -- Already joined, just return ID
    END IF;

    -- Add to members
    INSERT INTO public.trip_members (trip_id, user_id, name, avatar, color, bg, border)
    SELECT
        v_trip_id,
        v_user_id,
        COALESCE(raw_user_meta_data->>'full_name', 'Member'),
        COALESCE(raw_user_meta_data->>'avatar_url', '👤'),
        '#3B82F6', 'bg-blue-100', 'border-blue-500' -- Defaults
    FROM auth.users
    WHERE id = v_user_id;

    RETURN v_trip_id;
END;
$$;
