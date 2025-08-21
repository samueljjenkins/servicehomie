-- Update existing tables to add new fields for Housecall Pro-style functionality

-- Add new fields to services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General',
ADD COLUMN IF NOT EXISTS service_area TEXT DEFAULT 'Local';

-- Add new fields to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS customer_phone TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS customer_address TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';

-- Update existing status values to include 'completed'
ALTER TABLE bookings 
ALTER COLUMN status TYPE TEXT;

-- Create a check constraint for the new status values
ALTER TABLE bookings 
DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE bookings 
ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));

-- Update existing records to have default values
UPDATE services SET category = 'General' WHERE category IS NULL;
UPDATE services SET service_area = 'Local' WHERE service_area IS NULL;
UPDATE bookings SET customer_phone = '' WHERE customer_phone IS NULL;
UPDATE bookings SET customer_address = '' WHERE customer_address IS NULL;
UPDATE bookings SET notes = '' WHERE notes IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_service_area ON services(service_area);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON bookings(customer_email);

-- Add comments for documentation
COMMENT ON COLUMN services.category IS 'Service category (e.g., Plumbing, Electrical, HVAC)';
COMMENT ON COLUMN services.service_area IS 'Geographic service area (Local, Regional, National, Remote)';
COMMENT ON COLUMN bookings.customer_phone IS 'Customer phone number for contact';
COMMENT ON COLUMN bookings.customer_address IS 'Customer address for service location';
COMMENT ON COLUMN bookings.notes IS 'Additional notes about the booking';
