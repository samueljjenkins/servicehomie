-- Fix foreign key constraint issue
-- Drop the foreign key first, then change column type

-- Step 1: Drop the foreign key constraint
ALTER TABLE technician_profiles DROP CONSTRAINT IF EXISTS technician_profiles_user_profile_id_fkey;

-- Step 2: Drop ALL policies that might reference user_profile_id
DROP POLICY IF EXISTS "Technicians can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Technicians can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Technicians can delete their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Technicians can update their own documents" ON storage.objects;

-- Also drop any policies on technician_profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON technician_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON technician_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON technician_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON technician_profiles;

-- Step 3: Change the column type from UUID to TEXT
ALTER TABLE technician_profiles ALTER COLUMN user_profile_id TYPE TEXT;

-- Step 4: Make sure it's not null
ALTER TABLE technician_profiles ALTER COLUMN user_profile_id SET NOT NULL;

-- Step 5: Recreate basic policies for technician_profiles
CREATE POLICY "Users can view own profile" ON technician_profiles
FOR SELECT USING (auth.uid()::text = user_profile_id);

CREATE POLICY "Users can update own profile" ON technician_profiles
FOR UPDATE USING (auth.uid()::text = user_profile_id);

CREATE POLICY "Users can insert own profile" ON technician_profiles
FOR INSERT WITH CHECK (auth.uid()::text = user_profile_id); 