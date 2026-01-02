-- Promote admin@parti.life to admin role
-- Run this in Supabase SQL Editor

UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@parti.life'
);

-- Verify the update
SELECT id, role, full_name 
FROM public.profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@parti.life');
