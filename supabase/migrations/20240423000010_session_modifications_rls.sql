-- Migration: Session Parameter Modifications RLS
-- FEATURE: Allow students to save modifications and trainers to view them

-- 1. Students: Can insert modifications for their own executions
-- We check if the execution belongs to the student
CREATE POLICY "Students can manage their own session modifications" ON session_param_modifications
    FOR ALL TO authenticated
    USING (
        execution_id IN (
            SELECT id FROM workout_executions 
            WHERE student_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid())
        )
    )
    WITH CHECK (
        execution_id IN (
            SELECT id FROM workout_executions 
            WHERE student_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid())
        )
    );

-- 2. Trainers: Can view modifications for their students
CREATE POLICY "Trainers can view their students session modifications" ON session_param_modifications
    FOR SELECT TO authenticated
    USING (
        execution_id IN (
            SELECT e.id FROM workout_executions e
            JOIN student_profiles s ON e.student_id = s.id
            JOIN trainer_profiles t ON s.trainer_id = t.id
            WHERE t.user_id = auth.uid()
        )
    );
