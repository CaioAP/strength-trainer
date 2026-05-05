-- Migration: Fix Trainer/Student Metadata Access
-- FEATURE: Allow users to read their own specialized profile data

-- 1. trainer_profiles policies
CREATE POLICY "Trainers can view their own trainer profile" ON trainer_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Trainers can update their own trainer profile" ON trainer_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- 2. student_profiles policies
CREATE POLICY "Students can view their own student profile" ON student_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- 3. Allow trainers to see their students' profiles
CREATE POLICY "Trainers can view their students profiles" ON student_profiles
    FOR SELECT USING (
        trainer_id IN (SELECT id FROM trainer_profiles WHERE user_id = auth.uid())
    );
