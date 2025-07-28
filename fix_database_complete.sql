-- Complete fix for user_profile_id column type
-- This handles the policy dependency issue

-- Step 1: Drop the problematic policy
DROP POLICY IF EXISTS "Technicians can upload their own documents" ON storage.objects;

-- Step 2: Change the column type from UUID to TEXT
ALTER TABLE technician_profiles ALTER COLUMN user_profile_id TYPE TEXT;

-- Step 3: Make sure it's not null
ALTER TABLE technician_profiles ALTER COLUMN user_profile_id SET NOT NULL;

-- Step 4: Recreate the policy with the correct format
CREATE POLICY "Technicians can upload their own documents" ON storage.objects
FOR ALL USING (
  auth.uid()::text = (
    SELECT user_profile_id 
    FROM technician_profiles 
    WHERE id = (storage.foldername(name))[1]::uuid
  )
); 