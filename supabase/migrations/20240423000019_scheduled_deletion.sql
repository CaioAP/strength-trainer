-- Migration: Add Scheduled Deletion to Profiles
-- This adds a timestamp to track when an account is scheduled for permanent deletion.

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS scheduled_deletion_time TIMESTAMPTZ;

-- Function to schedule deletion
CREATE OR REPLACE FUNCTION public.schedule_account_deletion()
RETURNS void AS $$
BEGIN
    UPDATE public.profiles 
    SET scheduled_deletion_time = NOW() + INTERVAL '30 days'
    WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cancel deletion (restoration)
CREATE OR REPLACE FUNCTION public.cancel_account_deletion()
RETURNS void AS $$
BEGIN
    UPDATE public.profiles 
    SET scheduled_deletion_time = NULL
    WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
