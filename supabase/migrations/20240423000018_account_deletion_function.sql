-- Migration: Implement Secure Account Deletion
-- This function allows a user to delete their own account and all associated data.
-- It uses SECURITY DEFINER to bypass RLS and delete from auth.users.

CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void AS $$
BEGIN
    -- Delete from auth.users (this will cascade to public.profiles and everything else)
    DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: In a production environment, you might want to add logging or 
-- a "soft delete" grace period. For this prototype, we do a full cascade delete.
