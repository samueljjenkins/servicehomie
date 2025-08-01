-- Add unique constraints to prevent duplicate profiles

-- 1. Add unique constraint on user_profile_id (one profile per user)
ALTER TABLE technician_profiles 
ADD CONSTRAINT unique_user_profile_id 
UNIQUE (user_profile_id);

-- 2. Add unique constraint on url_slug (one profile per custom URL)
ALTER TABLE technician_profiles 
ADD CONSTRAINT unique_url_slug 
UNIQUE (url_slug);

-- 3. Add unique constraint on email (optional - one profile per email)
ALTER TABLE technician_profiles 
ADD CONSTRAINT unique_email 
UNIQUE (email);

-- 4. Verify the constraints were added
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'technician_profiles' 
AND constraint_type = 'UNIQUE';

-- 5. Test the constraints work by trying to insert a duplicate (this should fail)
-- Uncomment the lines below to test, but be careful!
/*
INSERT INTO technician_profiles (
    user_profile_id, 
    name, 
    email, 
    subscription_status
) VALUES (
    'test-user-id', 
    'Test Business', 
    'test@example.com', 
    'inactive'
);
*/ 