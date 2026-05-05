-- Migration: Allow Trainers to see Student Profiles
-- FEATURE: Ensure trainers can see the email/name of their assigned students

-- 1. Create a policy for the 'profiles' table
-- This allows a trainer to SELECT from 'profiles' if the user is one of their students
CREATE POLICY "Trainers can view their students' basic profile info" ON profiles
    FOR SELECT USING (
        id IN (
            SELECT user_id FROM student_profiles
            WHERE trainer_id IN (SELECT id FROM trainer_profiles WHERE user_id = auth.uid())
        )
    );

-- 2. Also ensure Admins can see all profiles (Safety check)
DROP POLICY IF EXISTS "Admins have full access to profiles" ON profiles;
CREATE POLICY "Admins have full access to profiles" ON profiles
    FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
