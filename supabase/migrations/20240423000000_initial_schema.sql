-- Initial Schema Migration: Strength Trainer PWA
-- BE-001: Supabase Database Schema
-- BE-002: RLS Policy Implementation

-- 1. ENUMS AND TYPES
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('admin', 'trainer', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABLES

-- Profiles (Extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role app_role DEFAULT 'student' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trainer Profiles
CREATE TABLE IF NOT EXISTS trainer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Profiles
CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    trainer_id UUID REFERENCES trainer_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Master Exercise Library
CREATE TABLE IF NOT EXISTS exercise_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    media_url TEXT,
    muscle_group TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training Plans
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainer_id UUID REFERENCES trainer_profiles(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE, -- NULL means it is a template
    name TEXT NOT NULL,
    description TEXT,
    is_template BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workouts (Specific sessions within a plan)
CREATE TABLE IF NOT EXISTS workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES plans(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plan Exercises (The prescription)
CREATE TABLE IF NOT EXISTS plan_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
    exercise_id UUID REFERENCES exercise_master(id) ON DELETE CASCADE NOT NULL,
    sets INT DEFAULT 3 NOT NULL,
    reps INT DEFAULT 10 NOT NULL,
    load FLOAT DEFAULT 0 NOT NULL,
    rest_seconds INT DEFAULT 60 NOT NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout Executions (The actual performance)
CREATE TABLE IF NOT EXISTS workout_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE NOT NULL,
    workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ,
    effort_rpe INT CHECK (effort_rpe >= 1 AND effort_rpe <= 10)
);

-- Session Modifications (Changes made during execution)
CREATE TABLE IF NOT EXISTS session_param_modifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID REFERENCES workout_executions(id) ON DELETE CASCADE NOT NULL,
    plan_exercise_id UUID REFERENCES plan_exercises(id) ON DELETE CASCADE NOT NULL,
    set_number INT NOT NULL,
    actual_reps INT,
    actual_load FLOAT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_param_modifications ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES

-- Profiles
CREATE POLICY "Users can view their own profile" ON profiles 
    FOR SELECT USING (auth.uid() = id);

-- Exercise Master (Read for all, Write for Admin)
CREATE POLICY "Public read for exercise library" ON exercise_master 
    FOR SELECT USING (true);

-- Plans
CREATE POLICY "Trainers can manage their own plans" ON plans 
    FOR ALL USING (
        trainer_id IN (SELECT id FROM trainer_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "Students can view assigned plans" ON plans 
    FOR SELECT USING (
        student_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid())
    );

-- Workouts (Nested access based on Plan)
CREATE POLICY "Access workouts through plan" ON workouts 
    FOR ALL USING (
        plan_id IN (SELECT id FROM plans) -- Simplification; PostgreSQL RLS is recursive if policies exist on plans
    );

-- Workout Executions
CREATE POLICY "Students manage their own executions" ON workout_executions 
    FOR ALL USING (
        student_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "Trainers view their students' executions" ON workout_executions 
    FOR SELECT USING (
        student_id IN (
            SELECT s.id FROM student_profiles s
            JOIN trainer_profiles t ON s.trainer_id = t.id
            WHERE t.user_id = auth.uid()
        )
    );

-- 5. HELPER FUNCTIONS
-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
