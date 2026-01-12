-- Create venues table
CREATE TABLE public.venues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('clubs', 'cafes', 'restaurants')),
    description TEXT,
    image_url TEXT,
    location TEXT NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0,
    capacity INTEGER,
    is_open BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

-- Everyone can read venues
CREATE POLICY "Venues are viewable by everyone" ON public.venues
    FOR SELECT USING (true);

-- Only admins can insert venues
CREATE POLICY "Admins can insert venues" ON public.venues
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Only admins can update venues
CREATE POLICY "Admins can update venues" ON public.venues
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Only admins can delete venues
CREATE POLICY "Admins can delete venues" ON public.venues
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Seed initial venue data (migrated from mock data)
INSERT INTO public.venues (name, category, description, image_url, location, rating, capacity, is_open) VALUES
('Papagayo Beach Club', 'clubs', 'The ultimate beachfront nightlife experience', '/images/venue-hero.png', 'Playa de las Américas', 4.8, 2000, true),
('Monkey Beach Club', 'clubs', 'Sunset sessions and electronic beats', '/images/vibe-beach.png', 'Costa Adeje', 4.6, 1500, true),
('Café del Mar', 'cafes', 'Iconic sunset views with chill vibes', '/images/vibe-cafe.png', 'Los Cristianos', 4.7, 300, false),
('The Coffee House', 'cafes', 'Artisan coffee and cozy atmosphere', '/images/vibe-cafe.png', 'Santa Cruz', 4.5, 80, true),
('El Rincón', 'restaurants', 'Traditional Canarian cuisine with a modern twist', '/images/vibe-restaurant.png', 'La Laguna', 4.9, 120, true),
('Skyline Rooftop', 'restaurants', 'Fine dining with panoramic ocean views', '/images/vibe-restaurant.png', 'Puerto de la Cruz', 4.8, 200, true),
('Tropic Club', 'clubs', 'Latin rhythms and tropical cocktails', '/images/vibe-techno.png', 'Playa de las Américas', 4.4, 800, false),
('Sunrise Café', 'cafes', 'Beachfront breakfast and brunch spot', '/images/vibe-beach.png', 'El Médano', 4.6, 60, true);
