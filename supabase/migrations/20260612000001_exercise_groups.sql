-- Migration: Exercise Groups (Supersets / Circuits)
-- FEATURE: Group exercises into circuits performed back-to-back before a break.
-- Uniform model: every plan_exercise belongs to a group (singleton = standalone).

-- 1. Exercise Groups table (ordering unit under a workout)
CREATE TABLE IF NOT EXISTS exercise_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE NOT NULL,
    label TEXT,
    rounds INT NOT NULL DEFAULT 1 CHECK (rounds >= 1),
    rest_seconds INT NOT NULL DEFAULT 60,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Link plan_exercises to a group
ALTER TABLE plan_exercises
    ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES exercise_groups(id) ON DELETE CASCADE,
    ADD COLUMN IF NOT EXISTS order_in_group INT NOT NULL DEFAULT 0;

-- 3. Backfill: wrap each existing exercise in its own singleton group.
--    order_index is unique per workout, so (workout_id, order_index) maps a new
--    group row back to its source exercise within the same data-modifying CTE.
WITH ins AS (
    INSERT INTO exercise_groups (workout_id, rounds, rest_seconds, order_index)
    SELECT workout_id, GREATEST(sets, 1), rest_seconds, order_index
    FROM plan_exercises
    RETURNING id, workout_id, order_index
)
UPDATE plan_exercises pe
SET group_id = ins.id, order_in_group = 0
FROM ins
WHERE ins.workout_id = pe.workout_id AND ins.order_index = pe.order_index;

-- 4. Now that every row is linked, enforce NOT NULL.
ALTER TABLE plan_exercises ALTER COLUMN group_id SET NOT NULL;

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_exercise_groups_workout ON exercise_groups(workout_id);
CREATE INDEX IF NOT EXISTS idx_plan_exercises_group ON plan_exercises(group_id);

-- 6. Row Level Security (mirrors workouts policies)
ALTER TABLE exercise_groups ENABLE ROW LEVEL SECURITY;

-- Trainers manage groups inside their own plans
CREATE POLICY "Trainers manage own exercise groups" ON exercise_groups
    FOR ALL TO authenticated
    USING (
        workout_id IN (
            SELECT id FROM workouts WHERE plan_id IN (
                SELECT id FROM plans WHERE trainer_id IN (
                    SELECT id FROM trainer_profiles WHERE user_id = auth.uid()
                )
            )
        )
    )
    WITH CHECK (
        workout_id IN (
            SELECT id FROM workouts WHERE plan_id IN (
                SELECT id FROM plans WHERE trainer_id IN (
                    SELECT id FROM trainer_profiles WHERE user_id = auth.uid()
                )
            )
        )
    );

-- Students read groups of their assigned plans
CREATE POLICY "Students can view assigned exercise groups" ON exercise_groups
    FOR SELECT USING (
        workout_id IN (
            SELECT id FROM workouts WHERE plan_id IN (
                SELECT id FROM plans WHERE student_id IN (
                    SELECT id FROM student_profiles WHERE user_id = auth.uid()
                )
            )
        )
    );
