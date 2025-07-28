-- Complete fix for user_profile_id column type
-- This drops ALL policies that might reference user_profile_id

-- Step 1: Drop ALL policies that might reference user_profile_id
DROP POLICY IF EXISTS "Technicians can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Technicians can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Technicians can delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Technicians can update their own documents" ON storage.objects;

-- Also drop any policies on technician_profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON technician_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON technician_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON technician_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON technician_profiles;

-- Step 2: Change the column type from UUID to TEXT
ALTER TABLE technician_profiles ALTER COLUMN user_profile_id TYPE TEXT;

-- Step 3: Make sure it's not null
ALTER TABLE technician_profiles ALTER COLUMN user_profile_id SET NOT NULL;

-- Step 4: Recreate basic policies for technician_profiles
CREATE POLICY "Users can view own profile" ON technician_profiles
FOR SELECT USING (auth.uid()::text = user_profile_id);

CREATE POLICY "Users can update own profile" ON technician_profiles
FOR UPDATE USING (auth.uid()::text = user_profile_id);

CREATE POLICY "Users can insert own profile" ON technician_profiles
FOR INSERT WITH CHECK (auth.uid()::text = user_profile_id);

-- Step 5: Recreate storage policies (if needed)
CREATE POLICY "Technicians can upload their own documents" ON storage.objects
FOR ALL USING (
  auth.uid()::text = (
    SELECT user_profile_id 
    FROM technician_profiles 
    WHERE id = (storage.foldername(name))[1]::uuid
  )
); 