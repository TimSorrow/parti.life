-- Create custom types
CREATE TYPE public.user_role AS ENUM ('user', 'agent', 'admin');
CREATE TYPE public.subscription_tier AS ENUM ('basic', 'vip');
CREATE TYPE public.event_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    role public.user_role DEFAULT 'user' NOT NULL,
    subscription_tier public.subscription_tier DEFAULT 'basic' NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create events table
CREATE TABLE public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date_time TIMESTAMPTZ NOT NULL,
    location_name TEXT NOT NULL,
    location_coords JSONB, -- {lat: float, lng: float}
    image_url TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status public.event_status DEFAULT 'pending' NOT NULL,
    min_tier_required public.subscription_tier DEFAULT 'basic' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile." ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Events Policies
-- 1. Everyone can view approved events
CREATE POLICY "Anyone can view approved events." ON public.events
    FOR SELECT USING (status = 'approved');

-- 2. Agents can view their own events (even pending/rejected)
CREATE POLICY "Agents can view their own events." ON public.events
    FOR SELECT USING (auth.uid() = created_by);

-- 3. Agents can create events
CREATE POLICY "Agents can create events." ON public.events
    FOR INSERT WITH CHECK (
        auth.uid() = created_by AND 
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND (role = 'agent' OR role = 'admin')
        )
    );

-- 4. Agents can update their own pending events
CREATE POLICY "Agents can update their own events." ON public.events
    FOR UPDATE USING (
        auth.uid() = created_by AND 
        status = 'pending'
    );

-- 5. Admins can do anything
CREATE POLICY "Admins have full access to events." ON public.events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 6. Admins can update any profile
CREATE POLICY "Admins can update any profile." ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, role, subscription_tier)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'user'),
        COALESCE((NEW.raw_user_meta_data->>'subscription_tier')::public.subscription_tier, 'basic')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
