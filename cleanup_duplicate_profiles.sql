-- First, let's see what we have in the technician_profiles table
SELECT 
    id,
    user_profile_id,
    name,
    email,
    subscription_status,
    stripe_subscription_id,
    url_slug,
    created_at
FROM technician_profiles
ORDER BY user_profile_id, created_at;

-- This will show you all profiles and help identify duplicates
-- Look for multiple rows with the same user_profile_id

-- To delete duplicate profiles (keep the most recent one for each user):
-- WARNING: Run this only after reviewing the data above!

-- Step 1: Create a temporary table with the latest profile for each user
CREATE TEMP TABLE latest_profiles AS
SELECT DISTINCT ON (user_profile_id) 
    id,
    user_profile_id,
    name,
    email,
    subscription_status,
    stripe_subscription_id,
    url_slug,
    created_at
FROM technician_profiles
ORDER BY user_profile_id, created_at DESC;

-- Step 2: Delete all profiles that are NOT in the latest_profiles table
DELETE FROM technician_profiles 
WHERE id NOT IN (SELECT id FROM latest_profiles);

-- Step 3: Verify the cleanup worked
SELECT 
    id,
    user_profile_id,
    name,
    email,
    subscription_status,
    stripe_subscription_id,
    url_slug,
    created_at
FROM technician_profiles
ORDER BY user_profile_id, created_at;

-- Step 4: Clean up temporary table
DROP TABLE latest_profiles; 