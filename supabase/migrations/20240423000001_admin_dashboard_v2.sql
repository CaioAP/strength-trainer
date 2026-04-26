-- Migration: Expanded Admin Dashboard (V2)
-- FEATURE-002-admin-dashboard-v2

-- 1. SCHEMA UPDATES

-- Update trainer_profiles
ALTER TABLE trainer_profiles ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE trainer_profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create Admin Audit Logs
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES profiles(id) NOT NULL,
    action TEXT NOT NULL,
    target_id UUID,
    target_type TEXT,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. RLS POLICIES FOR AUDIT LOGS
CREATE POLICY "Admins can view all audit logs" ON admin_audit_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- 3. GLOBAL RLS HARDENING (Admins bypass restrictions)
-- For each table, add a policy that allows admins ALL access.

-- profiles
CREATE POLICY "Admins have full access to profiles" ON profiles
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- trainer_profiles
CREATE POLICY "Admins have full access to trainer_profiles" ON trainer_profiles
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- student_profiles
CREATE POLICY "Admins have full access to student_profiles" ON student_profiles
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- exercise_master
CREATE POLICY "Admins have full access to exercise_master" ON exercise_master
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- plans
CREATE POLICY "Admins have full access to plans" ON plans
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- workouts
CREATE POLICY "Admins have full access to workouts" ON workouts
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- plan_exercises
CREATE POLICY "Admins have full access to plan_exercises" ON plan_exercises
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- workout_executions
CREATE POLICY "Admins have full access to workout_executions" ON workout_executions
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- session_param_modifications
CREATE POLICY "Admins have full access to session_param_modifications" ON session_param_modifications
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- 4. ADMINISTRATIVE RPC FUNCTIONS

-- Function to get admin metrics
CREATE OR REPLACE FUNCTION get_admin_metrics()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    metrics JSONB;
BEGIN
    -- Security check: only admins
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
        RAISE EXCEPTION 'Access denied. Admin role required.';
    END IF;

    SELECT jsonb_build_object(
        'total_exercises', (SELECT count(*) FROM exercise_master),
        'total_trainers', (SELECT count(*) FROM trainer_profiles),
        'pending_trainers', (SELECT count(*) FROM trainer_profiles WHERE is_approved = false),
        'total_students', (SELECT count(*) FROM student_profiles)
    ) INTO metrics;

    RETURN metrics;
END;
$$;

-- Function to approve trainer
CREATE OR REPLACE FUNCTION approve_trainer(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Security check: only admins
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
        RAISE EXCEPTION 'Access denied. Admin role required.';
    END IF;

    -- Update profile role
    UPDATE profiles SET role = 'trainer' WHERE id = target_user_id;

    -- Update trainer profile approval
    UPDATE trainer_profiles SET is_approved = true WHERE user_id = target_user_id;

    -- Log action
    INSERT INTO admin_audit_logs (admin_id, action, target_id, target_type)
    VALUES (auth.uid(), 'APPROVE_TRAINER', target_user_id, 'USER');
END;
$$;

-- Function to revoke trainer
CREATE OR REPLACE FUNCTION revoke_trainer(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Security check: only admins
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
        RAISE EXCEPTION 'Access denied. Admin role required.';
    END IF;

    -- Update trainer profile activity
    UPDATE trainer_profiles SET is_active = false WHERE user_id = target_user_id;

    -- Log action
    INSERT INTO admin_audit_logs (admin_id, action, target_id, target_type)
    VALUES (auth.uid(), 'REVOKE_TRAINER', target_user_id, 'USER');
END;
$$;
