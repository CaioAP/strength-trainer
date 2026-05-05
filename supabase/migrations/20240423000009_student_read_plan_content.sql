-- Migration: Grant Students Read Access to Plan Content
-- FEATURE: Allow students to see the workouts and exercises in their assigned plans

-- 1. Workouts
-- Allow student to see a workout if it belongs to a plan assigned to them
CREATE POLICY "Students can view assigned workouts" ON workouts
    FOR SELECT USING (
        plan_id IN (
            SELECT id FROM plans 
            WHERE student_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid())
        )
    );

-- 2. Plan Exercises
-- Allow student to see an exercise if it belongs to a workout in their assigned plan
CREATE POLICY "Students can view assigned plan exercises" ON plan_exercises
    FOR SELECT USING (
        workout_id IN (
            SELECT id FROM workouts 
            WHERE plan_id IN (
                SELECT id FROM plans 
                WHERE student_id IN (SELECT id FROM student_profiles WHERE user_id = auth.uid())
            )
        )
    );
