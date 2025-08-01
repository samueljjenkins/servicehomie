-- First, let's see what the current constraint allows
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'technician_profiles'::regclass 
AND conname = 'technician_profiles_subscription_status_check';

-- Check what values are currently in the subscription_status column
SELECT DISTINCT subscription_status, COUNT(*) 
FROM technician_profiles 
GROUP BY subscription_status;

-- Drop the existing constraint
ALTER TABLE technician_profiles 
DROP CONSTRAINT IF EXISTS technician_profiles_subscription_status_check;

-- Create a new constraint that allows 'inactive', 'active', 'cancelled', etc.
ALTER TABLE technician_profiles 
ADD CONSTRAINT technician_profiles_subscription_status_check 
CHECK (subscription_status IN ('inactive', 'active', 'cancelled', 'pending', 'expired'));

-- Verify the constraint was created
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'technician_profiles'::regclass 
AND conname = 'technician_profiles_subscription_status_check';

-- Test inserting with 'inactive' status
-- (This will fail if there are still issues)
/*
INSERT INTO technician_profiles (
    user_profile_id,
    name,
    email,
    subscription_status,
    monthly_fee
) VALUES (
    'test-user-id',
    'Test Business',
    'test@example.com',
    'inactive',
    19
);
*/ 