-- Migration: Robust Session Parameter Modifications RLS
-- FEATURE: Use security definer function to avoid RLS recursion issues

-- 1. Helper function to check execution ownership
-- SECURITY DEFINER bypasses RLS on the tables it queries
CREATE OR REPLACE FUNCTION public.check_execution_ownership(target_execution_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.workout_executions e
    JOIN public.student_profiles s ON e.student_id = s.id
    WHERE e.id = target_execution_id
    AND s.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the old policy
DROP POLICY IF EXISTS "Students can manage their own session modifications" ON session_param_modifications;

-- 3. Create the robust policy
CREATE POLICY "Students can manage their own session modifications" ON session_param_modifications
    FOR ALL TO authenticated
    USING (check_execution_ownership(execution_id))
    WITH CHECK (check_execution_ownership(execution_id));

-- 4. Ensure trainers can still view (optional but good to maintain)
DROP POLICY IF EXISTS "Trainers can view their students session modifications" ON session_param_modifications;

CREATE OR REPLACE FUNCTION public.check_execution_for_trainer(target_execution_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.workout_executions e
    JOIN public.student_profiles s ON e.student_id = s.id
    JOIN public.trainer_profiles t ON s.trainer_id = t.id
    WHERE e.id = target_execution_id
    AND t.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Trainers can view their students session modifications" ON session_param_modifications
    FOR SELECT TO authenticated
    USING (check_execution_for_trainer(execution_id));
