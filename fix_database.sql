-- Fix the user_profile_id column to accept Clerk's string format
-- Run this in your Supabase SQL Editor

-- Change the column type from UUID to TEXT
ALTER TABLE technician_profiles ALTER COLUMN user_profile_id TYPE TEXT;

-- Make sure it's not null
ALTER TABLE technician_profiles ALTER COLUMN user_profile_id SET NOT NULL; 