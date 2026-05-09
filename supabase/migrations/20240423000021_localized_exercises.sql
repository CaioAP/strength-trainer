-- Migration: Localized Exercise Library Upgrade
-- Purges existing library and adds localization/metadata columns

-- 1. Wipe existing library data
DELETE FROM exercise_master;

-- 2. Add new columns for localization and metadata
ALTER TABLE exercise_master 
ADD COLUMN IF NOT EXISTS name_pt TEXT,
ADD COLUMN IF NOT EXISTS instructions_pt TEXT,
ADD COLUMN IF NOT EXISTS equipment TEXT,
ADD COLUMN IF NOT EXISTS difficulty TEXT,
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS instructions TEXT;

-- 3. Expand muscle groups to support API Ninjas categories (normalized)
INSERT INTO muscle_groups (name) VALUES 
    ('Abdominals'), 
    ('Abductors'), 
    ('Adductors'), 
    ('Forearms'), 
    ('Lats'), 
    ('Lower Back'), 
    ('Middle Back'), 
    ('Neck'), 
    ('Quadriceps'), 
    ('Traps')
ON CONFLICT (name) DO NOTHING;
