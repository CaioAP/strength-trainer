-- Migration: Add Email Preferences to Profiles
-- This adds the necessary columns to the profiles table to handle user email preferences.

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS marketing_emails BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS session_reminders BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS progress_reports BOOLEAN DEFAULT true;

-- Ensure users can update these columns (existing RLS should cover this, but being explicit)
-- Assuming a policy "Users can update their own profile" already exists.
