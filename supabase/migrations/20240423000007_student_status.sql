-- Migration: Explicit Student Status
-- FEATURE: Track exactly when a student has accepted an invite

-- 1. Add status column
DO $$ BEGIN
    ALTER TABLE student_profiles ADD COLUMN status TEXT DEFAULT 'pending';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- 2. Update existing data (Assume if they have a name in profiles, they are active)
UPDATE student_profiles 
SET status = 'active' 
WHERE user_id IN (SELECT id FROM profiles WHERE full_name IS NOT NULL AND full_name != 'Student');

-- 3. Create a trigger to auto-activate student on profile update
-- When a student sets their name/password, we mark them as active
CREATE OR REPLACE FUNCTION activate_student_on_profile_update()
RETURNS trigger AS $$
BEGIN
    IF (NEW.full_name IS NOT NULL AND OLD.full_name IS NULL) OR (NEW.full_name != OLD.full_name) THEN
        UPDATE student_profiles SET status = 'active' WHERE user_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_activate_student ON profiles;
CREATE TRIGGER tr_activate_student
    AFTER UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION activate_student_on_profile_update();
