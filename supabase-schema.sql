-- Drop existing tables (if they exist) in reverse order of creation to handle dependencies
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS technicians;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  user_type VARCHAR(20) CHECK (user_type IN ('homeowner', 'technician')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create technicians table
CREATE TABLE technicians (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  services TEXT[] NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0.0,
  reviews INTEGER DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  experience VARCHAR(100),
  verified BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  specialties TEXT[],
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  homeowner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  technician_id INTEGER REFERENCES technicians(id) ON DELETE CASCADE,
  service VARCHAR(255) NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  price DECIMAL(10,2) NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  homeowner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  technician_id INTEGER REFERENCES technicians(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) CHECK (sender_type IN ('homeowner', 'technician')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_technicians_services ON technicians USING GIN(services);
CREATE INDEX idx_technicians_available ON technicians(available);
CREATE INDEX idx_technicians_rating ON technicians(rating DESC);
CREATE INDEX idx_bookings_homeowner ON bookings(homeowner_id);
CREATE INDEX idx_bookings_technician ON bookings(technician_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_reviews_technician ON reviews(technician_id);
CREATE INDEX idx_messages_booking ON messages(booking_id);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can create own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Anyone can view technicians
CREATE POLICY "Anyone can view technicians" ON technicians
  FOR SELECT USING (true);

-- Technicians can update their own profile
CREATE POLICY "Technicians can update own profile" ON technicians
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = homeowner_id OR auth.uid() IN (
    SELECT user_id FROM technicians WHERE id = technician_id
  ));

-- Users can create bookings
CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = homeowner_id);

-- Users can update their own bookings
CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = homeowner_id OR auth.uid() IN (
    SELECT user_id FROM technicians WHERE id = technician_id
  ));

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

-- Users can create reviews for their bookings
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = homeowner_id);

-- Users can view messages for their bookings
CREATE POLICY "Users can view booking messages" ON messages
  FOR SELECT USING (auth.uid() IN (
    SELECT homeowner_id FROM bookings WHERE id = booking_id
    UNION
    SELECT user_id FROM technicians WHERE id IN (
      SELECT technician_id FROM bookings WHERE id = booking_id
    )
  ));

-- Users can send messages for their bookings
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT homeowner_id FROM bookings WHERE id = booking_id
    UNION
    SELECT user_id FROM technicians WHERE id IN (
      SELECT technician_id FROM bookings WHERE id = booking_id
    )
  ));

-- Function to create a public user profile row for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, user_type)
  VALUES (
    new.id, 
    new.email, 
    -- Use COALESCE to prevent null errors if metadata is missing
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'), 
    new.raw_user_meta_data->>'phone', 
    COALESCE(new.raw_user_meta_data->>'user_type', 'homeowner')
  );
  RETURN new;
END;
$$;

-- Trigger to fire the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample data
INSERT INTO users (email, full_name, phone, user_type) VALUES
('john@example.com', 'John Doe', '555-0101', 'homeowner'),
('jane@example.com', 'Jane Smith', '555-0102', 'homeowner'),
('mike@example.com', 'Mike Johnson', '555-0103', 'technician'),
('sarah@example.com', 'Sarah Williams', '555-0104', 'technician'),
('david@example.com', 'David Chen', '555-0105', 'technician'),
('lisa@example.com', 'Lisa Rodriguez', '555-0106', 'technician'),
('tom@example.com', 'Tom Anderson', '555-0107', 'technician'),
('maria@example.com', 'Maria Garcia', '555-0108', 'technician'),
('james@example.com', 'James Wilson', '555-0109', 'technician'),
('jennifer@example.com', 'Jennifer Lee', '555-0110', 'technician'),
('robert@example.com', 'Robert Taylor', '555-0111', 'technician'),
('kevin@example.com', 'Kevin Brown', '555-0112', 'technician'),
('emily@example.com', 'Emily Davis', '555-0113', 'technician'),
('chris@example.com', 'Chris Green', '555-0114', 'technician');

INSERT INTO technicians (user_id, name, email, phone, services, rating, reviews, price, location, experience, verified, available, specialties, description) VALUES
((SELECT id FROM users WHERE email = 'mike@example.com'), 'Mike Johnson', 'mike@example.com', '555-0103', ARRAY['Window Cleaning'], 4.8, 127, 75.00, 'Downtown', '5 years', true, true, ARRAY['Residential', 'Commercial', 'High-rise'], 'Professional window cleaning with attention to detail and eco-friendly products.'),
((SELECT id FROM users WHERE email = 'sarah@example.com'), 'Sarah Williams', 'sarah@example.com', '555-0104', ARRAY['Window Cleaning'], 4.9, 89, 85.00, 'Westside', '8 years', true, true, ARRAY['Residential', 'Interior/Exterior'], 'Reliable and thorough window cleaning service with flexible scheduling.'),
((SELECT id FROM users WHERE email = 'david@example.com'), 'David Chen', 'david@example.com', '555-0105', ARRAY['Window Cleaning'], 4.7, 156, 70.00, 'Northside', '3 years', true, true, ARRAY['Residential', 'Quick Service'], 'Fast and efficient window cleaning with competitive pricing.'),
-- Gutter Cleaning
((SELECT id FROM users WHERE email = 'lisa@example.com'), 'Lisa Rodriguez', 'lisa@example.com', '555-0106', ARRAY['Gutter Cleaning'], 4.8, 94, 120.00, 'Eastside', '6 years', true, true, ARRAY['Residential', 'Commercial'], 'Comprehensive gutter cleaning and maintenance with safety equipment.'),
((SELECT id FROM users WHERE email = 'tom@example.com'), 'Tom Anderson', 'tom@example.com', '555-0107', ARRAY['Gutter Cleaning'], 4.6, 67, 110.00, 'Southside', '4 years', true, true, ARRAY['Residential', 'Debris Removal'], 'Thorough gutter cleaning with debris removal and downspout clearing.'),
((SELECT id FROM users WHERE email = 'maria@example.com'), 'Maria Garcia', 'maria@example.com', '555-0108', ARRAY['Gutter Cleaning'], 4.9, 112, 130.00, 'Central', '7 years', true, true, ARRAY['Residential', 'Premium Service'], 'Premium gutter cleaning service with detailed inspection and reporting.'),
-- Pressure Washing
((SELECT id FROM users WHERE email = 'james@example.com'), 'James Wilson', 'james@example.com', '555-0109', ARRAY['Pressure Washing'], 4.7, 143, 200.00, 'Downtown', '9 years', true, true, ARRAY['Driveways', 'Sidewalks', 'House Exteriors'], 'Professional pressure washing for all surfaces with eco-friendly solutions.'),
((SELECT id FROM users WHERE email = 'jennifer@example.com'), 'Jennifer Lee', 'jennifer@example.com', '555-0110', ARRAY['Pressure Washing'], 4.8, 78, 180.00, 'Westside', '5 years', true, true, ARRAY['Residential', 'Deck Cleaning'], 'Specialized in residential pressure washing with deck and patio cleaning.'),
((SELECT id FROM users WHERE email = 'robert@example.com'), 'Robert Taylor', 'robert@example.com', '555-0111', ARRAY['Pressure Washing'], 4.6, 95, 160.00, 'Northside', '4 years', true, true, ARRAY['Commercial', 'Industrial'], 'Commercial and industrial pressure washing with heavy-duty equipment.'),
-- Junk Removal
((SELECT id FROM users WHERE email = 'kevin@example.com'), 'Kevin Brown', 'kevin@example.com', '555-0112', ARRAY['Junk Removal'], 4.9, 210, 90.00, 'Citywide', '10 years', true, true, ARRAY['Appliance Removal', 'Furniture Disposal', 'Yard Waste'], 'Fast and friendly junk removal services for homes and businesses.'),
-- Lawn Care
((SELECT id FROM users WHERE email = 'emily@example.com'), 'Emily Davis', 'emily@example.com', '555-0113', ARRAY['Lawn Care'], 4.8, 150, 55.00, 'Suburbs', '6 years', true, true, ARRAY['Mowing', 'Fertilizing', 'Weed Control'], 'Complete lawn care to keep your yard healthy and beautiful.'),
-- Handyman
((SELECT id FROM users WHERE email = 'chris@example.com'), 'Chris Green', 'chris@example.com', '555-0114', ARRAY['Handyman'], 4.7, 180, 65.00, 'Metro Area', '12 years', true, true, ARRAY['Plumbing', 'Electrical', 'Carpentry'], 'Your reliable handyman for all home repairs and installations.'); 