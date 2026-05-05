-- Migration: Final RLS Fix for Session Modifications
-- FEATURE: Simplified direct RLS policies for session_param_modifications

-- 1. Clean up all previous attempts to ensure a fresh state
DROP POLICY IF EXISTS "Students can manage their own session modifications" ON session_param_modifications;
DROP POLICY IF EXISTS "Students manage modifications" ON session_param_modifications;
DROP POLICY IF EXISTS "Trainers can view their students session modifications" ON session_param_modifications;

-- 2. Allow students full access to modifications linked to their own executions
-- We use a direct subquery which is usually more reliable in simple RLS cases
CREATE POLICY "session_mod_student_access" ON session_param_modifications
    FOR ALL TO authenticated
    USING (
        execution_id IN (
            SELECT e.id FROM workout_executions e
            JOIN student_profiles s ON e.student_id = s.id
            WHERE s.user_id = auth.uid()
        )
    )
    WITH CHECK (
        execution_id IN (
            SELECT e.id FROM workout_executions e
            JOIN student_profiles s ON e.student_id = s.id
            WHERE s.user_id = auth.uid()
        )
    );

-- 3. Allow trainers to view modifications for their students
CREATE POLICY "session_mod_trainer_view" ON session_param_modifications
    FOR SELECT TO authenticated
    USING (
        execution_id IN (
            SELECT e.id FROM workout_executions e
            JOIN student_profiles s ON e.student_id = s.id
            JOIN trainer_profiles t ON s.trainer_id = t.id
            WHERE t.user_id = auth.uid()
        )
    );
