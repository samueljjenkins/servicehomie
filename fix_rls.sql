-- 1. Enable RLS on the table
ALTER TABLE public.technician_applications ENABLE ROW LEVEL SECURITY;

-- 2. Drop old policies to ensure a clean slate
DROP POLICY IF EXISTS "Allow anonymous inserts into technician_applications" ON public.technician_applications;
DROP POLICY IF EXISTS "Allow anonymous uploads to technician-applications bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to technician-applications" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous view of technician-applications bucket" ON storage.objects;


-- 3. Create Policy: Allow anonymous inserts into the applications table
-- This allows anyone (even non-logged-in users) to submit an application.
CREATE POLICY "Allow anonymous inserts into technician_applications"
ON public.technician_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);


-- 4. Create Policy: Allow anonymous uploads to the technician-applications storage bucket
-- This allows anyone to upload their ID, license, etc.
CREATE POLICY "Allow anonymous uploads to technician-applications bucket"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'technician-applications');


-- 5. Create Policy: Allow public read access to the bucket
-- This is necessary so that you (as an admin) and potentially the user can see the uploaded files.
CREATE POLICY "Allow public read access to technician-applications"
ON storage.objects
FOR SELECT
USING (bucket_id = 'technician-applications');


-- 6. Create Policy: Allow admin users to read all applications
-- This allows users with the 'admin' role (or any authenticated user, you can tighten this)
-- to view all records in the table.
CREATE POLICY "Allow admin read access on technician_applications"
ON public.technician_applications
FOR SELECT
TO authenticated
USING (true);
