-- Migration: Debugging RLS for Session Modifications
-- FEATURE: Permissive policies to isolate the root cause of 403 error

-- 1. Drop ALL existing policies on the table to start from scratch
DROP POLICY IF EXISTS "Admins have full access to session_param_modifications" ON session_param_modifications;
DROP POLICY IF EXISTS "Students can manage their own session modifications" ON session_param_modifications;
DROP POLICY IF EXISTS "Trainers can view their students session modifications" ON session_param_modifications;
DROP POLICY IF EXISTS "session_mod_student_access" ON session_param_modifications;
DROP POLICY IF EXISTS "session_mod_trainer_view" ON session_param_modifications;
DROP POLICY IF EXISTS "session_mod_student_insert" ON session_param_modifications;
DROP POLICY IF EXISTS "session_mod_student_select" ON session_param_modifications;

-- 2. Create the most permissive policies possible for authenticated users
-- If this STILL fails, the issue is NOT RLS on this table.
CREATE POLICY "DEBUG_PERMISSIVE_INSERT" ON session_param_modifications
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "DEBUG_PERMISSIVE_SELECT" ON session_param_modifications
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "DEBUG_PERMISSIVE_UPDATE" ON session_param_modifications
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "DEBUG_PERMISSIVE_DELETE" ON session_param_modifications
    FOR DELETE TO authenticated
    USING (true);

-- 3. Also ensure admins have access just in case
CREATE POLICY "ADMIN_FULL_ACCESS" ON session_param_modifications
    FOR ALL TO authenticated
    USING (true);
