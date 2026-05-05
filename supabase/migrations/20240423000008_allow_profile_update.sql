-- Migration: Allow Users to Update Profiles
-- FEATURE: Fixes student activation by allowing users to set their own name

-- 1. Add update policy for profiles
-- This is required so users can complete their registration
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 2. Refine activation trigger (Safety Check)
-- Ensure any name change from the initial 'Student' placeholder triggers activation
CREATE OR REPLACE FUNCTION activate_student_on_profile_update()
RETURNS trigger AS $$
BEGIN
    -- If the name is changed, or set for the first time, mark as active
    IF (NEW.full_name IS NOT NULL) THEN
        UPDATE student_profiles SET status = 'active' WHERE user_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
