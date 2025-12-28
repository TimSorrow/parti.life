-- Note: This is a seed script for the Supabase SQL Editor.
-- Since profiles are created via trigger, we mainly need to insert into auth.users (which requires specific Supabase functions)
-- or manually update the profiles if they already exist.

-- For a local development/testing environment or manual insert if you have the UUIDs:

/*
-- Example manual profile promotion
UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_ADMIN_UUID';
UPDATE public.profiles SET role = 'agent' WHERE id = 'YOUR_AGENT_UUID';
UPDATE public.profiles SET subscription_tier = 'vip' WHERE id = 'YOUR_VIP_USER_UUID';
*/

-- Sample Events Seed (assuming some creator IDs)
-- Since I don't have the UUIDs, I'll provide a comment block with the SQL to run once users are created.

/*
INSERT INTO public.events (title, description, date_time, location_name, created_by, status, min_tier_required, image_url)
VALUES 
('Tenerife Beach Party', 'A wild night on the sands of Las Americas.', NOW() + INTERVAL '2 days', 'Playa de las Americas', 'AGENT_UUID', 'approved', 'basic', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3'),
('Secret Garden RAVE', 'Exclusive underground techno in a hidden botanical garden.', NOW() + INTERVAL '5 days', 'Secret Location', 'AGENT_UUID', 'approved', 'vip', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745'),
('Sunset Chillout', 'Electronic beats and cocktails at sunset.', NOW() + INTERVAL '1 day', 'Puerto de la Cruz', 'AGENT_UUID', 'pending', 'basic', 'https://images.unsplash.com/photo-1514525253361-bee8a187499b'),
('VIP Yacht Party', 'Luxury party on the Atlantic. Champagne and deep house.', NOW() + INTERVAL '3 days', 'Costa Adeje Marina', 'ADMIN_UUID', 'approved', 'vip', 'https://images.unsplash.com/photo-1567593374332-ad45c007e446'),
('Mountain Cave Fest', 'Mystical party in the volcanic caves.', NOW() + INTERVAL '10 days', 'Teide National Park', 'AGENT_UUID', 'rejected', 'basic', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7');
*/
