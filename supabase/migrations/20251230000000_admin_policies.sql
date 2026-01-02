-- Admin Full CRUD Access Policies
-- This migration ensures admins have complete control over all tables

-- Add admin INSERT policy for profiles (for creating test users or managing users)
CREATE POLICY "Admins can insert profiles." ON public.profiles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Add admin DELETE policy for profiles (for user management)
CREATE POLICY "Admins can delete profiles." ON public.profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Add admin DELETE policy for events (for content moderation)
CREATE POLICY "Admins can delete events." ON public.events
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Note: The following policies already exist in the initial schema:
-- - "Admins have full access to events." (FOR ALL on events)
-- - "Admins can update any profile." (FOR UPDATE on profiles)
-- 
-- This migration adds the missing INSERT and DELETE policies to complete
-- full CRUD access for administrators.
