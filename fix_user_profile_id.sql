-- Fix user_profile_id column to accept Clerk's string format
-- This script changes the user_profile_id column from UUID to TEXT to accept Clerk user IDs

-- First, let's check the current table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'technician_profiles' AND column_name = 'user_profile_id';

-- Drop any existing constraints that might reference user_profile_id
ALTER TABLE technician_profiles DROP CONSTRAINT IF EXISTS technician_profiles_user_profile_id_fkey;

-- Change the column type from UUID to TEXT
ALTER TABLE technician_profiles ALTER COLUMN user_profile_id TYPE TEXT;

-- Add a NOT NULL constraint if it doesn't exist
ALTER TABLE technician_profiles ALTER COLUMN user_profile_id SET NOT NULL;

-- Add an index for better performance
CREATE INDEX IF NOT EXISTS idx_technician_profiles_user_profile_id ON technician_profiles(user_profile_id);

-- Verify the change
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'technician_profiles' AND column_name = 'user_profile_id'; 