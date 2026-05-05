-- Migration: Muscle Group Categories
-- FEATURE: Restrict muscle groups to predefined values

-- 1. Create Lookup Table
CREATE TABLE IF NOT EXISTS muscle_groups (
    name TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Initial Data (Including 'Legs' to support existing data)
INSERT INTO muscle_groups (name) VALUES 
    ('Chest'), 
    ('Back'), 
    ('Shoulders'), 
    ('Biceps'), 
    ('Triceps'), 
    ('Legs'),
    ('Quads'), 
    ('Hamstrings'), 
    ('Calves'), 
    ('Glutes'), 
    ('Core'), 
    ('Full Body')
ON CONFLICT (name) DO NOTHING;

-- 3. Security
ALTER TABLE muscle_groups ENABLE ROW LEVEL SECURITY;

-- Drop existing if re-running
DROP POLICY IF EXISTS "Public read for muscle groups" ON muscle_groups;
DROP POLICY IF EXISTS "Admins manage muscle groups" ON muscle_groups;

CREATE POLICY "Public read for muscle groups" ON muscle_groups 
    FOR SELECT USING (true);

CREATE POLICY "Admins manage muscle groups" ON muscle_groups
    FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 4. Data Cleanup
-- Ensure all existing muscle_groups in exercise_master exist in the lookup table
-- If not, we set them to NULL or 'Full Body' to prevent FK failure.
UPDATE exercise_master 
SET muscle_group = NULL 
WHERE muscle_group NOT IN (SELECT name FROM muscle_groups);

-- 5. Constraint on exercise_master
ALTER TABLE exercise_master DROP CONSTRAINT IF EXISTS fk_exercise_muscle_group;
ALTER TABLE exercise_master 
    ADD CONSTRAINT fk_exercise_muscle_group 
    FOREIGN KEY (muscle_group) 
    REFERENCES muscle_groups(name)
    ON UPDATE CASCADE;
