-- Migration: Update workout_executions policy to respect privacy setting
-- This ensures trainers can only see execution history if the student allows it.

DROP POLICY IF EXISTS "Trainers view their students' executions" ON workout_executions;

CREATE POLICY "Trainers view their students' executions" ON workout_executions 
    FOR SELECT USING (
        student_id IN (
            SELECT s.id FROM student_profiles s
            JOIN trainer_profiles t ON s.trainer_id = t.id
            JOIN profiles p ON s.user_id = p.id
            WHERE t.user_id = auth.uid()
            AND p.show_history_to_trainer = true
        )
    );
