-- Migration: Secure Session Parameter Modifications RLS
-- FEATURE: Final secure policies for session_param_modifications

-- 1. Drop the debug permissive policies
DROP POLICY IF EXISTS "DEBUG_PERMISSIVE_INSERT" ON session_param_modifications;
DROP POLICY IF EXISTS "DEBUG_PERMISSIVE_SELECT" ON session_param_modifications;
DROP POLICY IF EXISTS "DEBUG_PERMISSIVE_UPDATE" ON session_param_modifications;
DROP POLICY IF EXISTS "DEBUG_PERMISSIVE_DELETE" ON session_param_modifications;
DROP POLICY IF EXISTS "ADMIN_FULL_ACCESS" ON session_param_modifications;

-- 2. Secure Student Access: Can manage modifications for their own executions
CREATE POLICY "session_mod_student_manage" ON session_param_modifications
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

-- 3. Secure Trainer Access: Can view modifications for their students
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

-- 4. Admin Access
CREATE POLICY "session_mod_admin_access" ON session_param_modifications
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
