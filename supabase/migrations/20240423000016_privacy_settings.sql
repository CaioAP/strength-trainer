-- Migration: Add Privacy Settings to Profiles
-- This adds privacy-related settings to the profiles table.

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS show_history_to_trainer BOOLEAN DEFAULT true;
