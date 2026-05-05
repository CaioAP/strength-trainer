-- Migration: Comprehensive Exercise Library
-- Adds a unique constraint on exercise names and seeds the library

-- 1. Ensure exercise names are unique to allow idempotent inserts
ALTER TABLE exercise_master ADD CONSTRAINT exercise_master_name_key UNIQUE (name);

-- 2. Seed Data
INSERT INTO exercise_master (name, muscle_group, description) VALUES
    -- Chest
    ('Barbell Bench Press', 'Chest', 'The classic compound movement for chest strength and size.'),
    ('Dumbbell Incline Press', 'Chest', 'Targets the upper pectorals and shoulders.'),
    ('Chest Flyes (Dumbbell)', 'Chest', 'Isolation exercise for chest stretch and contraction.'),
    ('Push-ups', 'Chest', 'Bodyweight foundational movement for chest and triceps.'),
    ('Dips (Chest focus)', 'Chest', 'Performed on bars with a slight forward lean.'),

    -- Back
    ('Barbell Deadlift', 'Back', 'Ultimate compound lift for the posterior chain and overall back.'),
    ('Pull-ups', 'Back', 'Primary vertical pull for width (lats).'),
    ('Bent Over Barbell Row', 'Back', 'Heavy horizontal pull for back thickness.'),
    ('Lat Pulldown (Cable)', 'Back', 'Vertical pull isolation to target the latissimus dorsi.'),
    ('Seated Cable Row', 'Back', 'Horizontal pull to target the mid-back and rhomboids.'),

    -- Shoulders
    ('Overhead Press (Barbell)', 'Shoulders', 'Foundational compound press for shoulder strength.'),
    ('Lateral Raise (Dumbbell)', 'Shoulders', 'Isolation for the lateral deltoids to build width.'),
    ('Front Raise (Dumbbell)', 'Shoulders', 'Isolation for the anterior deltoids.'),
    ('Face Pulls (Cable)', 'Shoulders', 'Targets rear delts and upper back for shoulder health.'),
    ('Arnold Press', 'Shoulders', 'Rotational shoulder press for full deltoid involvement.'),

    -- Biceps
    ('Barbell Curl', 'Biceps', 'Classic isolation exercise for overall bicep mass.'),
    ('Hammer Curl (Dumbbell)', 'Biceps', 'Targets the brachialis and brachioradialis (forearm).'),
    ('Preacher Curl', 'Biceps', 'Strict isolation that prevents cheating via body momentum.'),
    ('Concentration Curl', 'Biceps', 'Focused isolation for the bicep peak.'),

    -- Triceps
    ('Triceps Pushdown (Cable)', 'Triceps', 'Isolation for the triceps lateral and medial heads.'),
    ('Skull Crushers (EZ Bar)', 'Triceps', 'Targets the long head of the triceps.'),
    ('Overhead Extension (Dumbbell)', 'Triceps', 'Good for stretching and hitting the triceps long head.'),
    ('Close Grip Bench Press', 'Triceps', 'Compound movement with a heavy triceps focus.'),

    -- Quads
    ('Barbell Back Squat', 'Quads', 'The king of leg exercises for overall lower body power.'),
    ('Leg Press', 'Quads', 'Machine-based heavy compound for quad development.'),
    ('Leg Extension', 'Quads', 'Isolation to specifically target the quadriceps muscles.'),
    ('Goblet Squat', 'Quads', 'Excellent for form and depth, targets quads and core.'),
    ('Lunges (Walking)', 'Quads', 'Unilateral movement for quads, glutes, and balance.'),

    -- Hamstrings
    ('Romanian Deadlift', 'Hamstrings', 'Focuses on the eccentric stretch of the hamstrings.'),
    ('Leg Curl (Seated)', 'Hamstrings', 'Isolation for the hamstrings.'),
    ('Good Mornings', 'Hamstrings', 'Posterior chain focus targeting hamstrings and lower back.'),

    -- Glutes
    ('Hip Thrust (Barbell)', 'Glutes', 'The primary exercise for building glute strength and size.'),
    ('Bulgarian Split Squat', 'Glutes', 'Deep unilateral squat that heavily recruits the glutes.'),
    ('Cable Kickbacks', 'Glutes', 'Isolation for the gluteus maximus.'),

    -- Calves
    ('Standing Calf Raise', 'Calves', 'Targets the gastrocnemius (outer calf).'),
    ('Seated Calf Raise', 'Calves', 'Targets the soleus (inner calf).'),

    -- Core
    ('Plank', 'Core', 'Isometric hold for core stability.'),
    ('Hanging Leg Raise', 'Core', 'High-intensity exercise for lower abs and hip flexors.'),
    ('Russian Twists', 'Core', 'Targets the obliques and rotational stability.'),
    ('Ab Wheel Rollout', 'Core', 'Advanced exercise for full abdominal engagement.'),

    -- Full Body
    ('Clean and Press', 'Full Body', 'Explosive Olympic-style lift for power.'),
    ('Kettlebell Swings', 'Full Body', 'Dynamic movement for power, glutes, and cardiovascular health.'),
    ('Burpees', 'Full Body', 'Full body conditioning and endurance movement.')
ON CONFLICT (name) DO NOTHING;
