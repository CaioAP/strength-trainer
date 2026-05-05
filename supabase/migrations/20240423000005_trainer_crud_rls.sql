-- Migration: Trainer CRUD Permissions
-- FEATURE: Allow trainers to manage the full hierarchy of plans

-- 1. Helper function for trainer check (prevents logic duplication)
CREATE OR REPLACE FUNCTION is_trainer()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM trainer_profiles
    WHERE user_id = auth.uid() AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 2. Drop existing restrictive/broken policies
DROP POLICY IF EXISTS "Trainers can manage their own plans" ON plans;
DROP POLICY IF EXISTS "Access workouts through plan" ON workouts;

-- 3. Plans
CREATE POLICY "Trainers manage own plans" ON plans
    FOR ALL TO authenticated
    USING (trainer_id IN (SELECT id FROM trainer_profiles WHERE user_id = auth.uid()))
    WITH CHECK (trainer_id IN (SELECT id FROM trainer_profiles WHERE user_id = auth.uid()));

-- 4. Workouts (Linked to trainer via Plan)
CREATE POLICY "Trainers manage own workouts" ON workouts
    FOR ALL TO authenticated
    USING (plan_id IN (SELECT id FROM plans WHERE trainer_id IN (SELECT id FROM trainer_profiles WHERE user_id = auth.uid())))
    WITH CHECK (plan_id IN (SELECT id FROM plans WHERE trainer_id IN (SELECT id FROM trainer_profiles WHERE user_id = auth.uid())));

-- 5. Plan Exercises (Linked to trainer via Workout -> Plan)
CREATE POLICY "Trainers manage own plan exercises" ON plan_exercises
    FOR ALL TO authenticated
    USING (workout_id IN (SELECT id FROM workouts WHERE plan_id IN (SELECT id FROM plans WHERE trainer_id IN (SELECT id FROM trainer_profiles WHERE user_id = auth.uid()))))
    WITH CHECK (workout_id IN (SELECT id FROM workouts WHERE plan_id IN (SELECT id FROM plans WHERE trainer_id IN (SELECT id FROM trainer_profiles WHERE user_id = auth.uid()))));
