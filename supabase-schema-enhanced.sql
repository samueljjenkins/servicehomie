-- Enhanced Database Schema for Home Service Business Management
-- This extends the existing schema to support comprehensive business operations

-- =============================================
-- CUSTOMERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  whop_user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  customer_type TEXT DEFAULT 'residential' CHECK (customer_type IN ('residential', 'commercial')),
  preferred_contact_method TEXT DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'sms')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(whop_user_id, email)
);

-- =============================================
-- TECHNICIANS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS technicians (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  whop_user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  skills TEXT[], -- Array of skills like ['plumbing', 'electrical', 'hvac']
  hourly_rate DECIMAL(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  hire_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- JOBS TABLE (Work Orders)
-- =============================================
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  whop_user_id TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
  job_number TEXT NOT NULL, -- Human-readable job number like "JOB-2024-001"
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'on_hold')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  scheduled_date DATE,
  scheduled_start_time TIME,
  scheduled_end_time TIME,
  actual_start_time TIMESTAMP WITH TIME ZONE,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  estimated_duration_minutes INTEGER,
  actual_duration_minutes INTEGER,
  labor_cost DECIMAL(10,2),
  material_cost DECIMAL(10,2),
  total_cost DECIMAL(10,2),
  customer_notes TEXT,
  internal_notes TEXT,
  completion_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INVOICES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  whop_user_id TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL, -- Human-readable like "INV-2024-001"
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,4) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT,
  payment_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(whop_user_id, invoice_number)
);

-- =============================================
-- INVOICE_ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  item_type TEXT DEFAULT 'service' CHECK (item_type IN ('service', 'material', 'labor', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INVENTORY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  whop_user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT, -- Stock Keeping Unit
  category TEXT,
  unit_type TEXT DEFAULT 'piece' CHECK (unit_type IN ('piece', 'hour', 'foot', 'gallon', 'pound')),
  cost_per_unit DECIMAL(10,2),
  selling_price DECIMAL(10,2),
  current_stock DECIMAL(10,2) DEFAULT 0,
  minimum_stock DECIMAL(10,2) DEFAULT 0,
  supplier TEXT,
  supplier_contact TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- JOB_MATERIALS TABLE (Materials used in jobs)
-- =============================================
CREATE TABLE IF NOT EXISTS job_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  inventory_id UUID REFERENCES inventory(id) ON DELETE SET NULL,
  material_name TEXT NOT NULL, -- In case inventory item is deleted
  quantity_used DECIMAL(10,2) NOT NULL,
  unit_cost DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- COMMUNICATION_LOG TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS communication_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  whop_user_id TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  communication_type TEXT NOT NULL CHECK (communication_type IN ('email', 'sms', 'phone', 'in_person', 'note')),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  subject TEXT,
  message TEXT,
  sent_by TEXT, -- Technician name or system
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- EQUIPMENT TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  whop_user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  equipment_type TEXT,
  serial_number TEXT,
  purchase_date DATE,
  purchase_cost DECIMAL(10,2),
  current_value DECIMAL(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'retired')),
  assigned_technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
  maintenance_schedule TEXT,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- EXPENSES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  whop_user_id TEXT NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  category TEXT NOT NULL, -- fuel, materials, equipment, etc.
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE DEFAULT CURRENT_DATE,
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- UPDATE EXISTING TABLES
-- =============================================

-- Add more fields to services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'one_time' CHECK (service_type IN ('one_time', 'recurring', 'maintenance')),
ADD COLUMN IF NOT EXISTS requires_equipment BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS requires_materials BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS skill_requirements TEXT[],
ADD COLUMN IF NOT EXISTS estimated_duration_minutes INTEGER DEFAULT 60;

-- Add more fields to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS special_instructions TEXT;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Customer indexes
CREATE INDEX IF NOT EXISTS idx_customers_whop_user_id ON customers(whop_user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_customer_type ON customers(customer_type);

-- Technician indexes
CREATE INDEX IF NOT EXISTS idx_technicians_whop_user_id ON technicians(whop_user_id);
CREATE INDEX IF NOT EXISTS idx_technicians_status ON technicians(status);
CREATE INDEX IF NOT EXISTS idx_technicians_skills ON technicians USING GIN(skills);

-- Job indexes
CREATE INDEX IF NOT EXISTS idx_jobs_whop_user_id ON jobs(whop_user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_technician_id ON jobs(technician_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_date ON jobs(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_jobs_job_number ON jobs(job_number);

-- Invoice indexes
CREATE INDEX IF NOT EXISTS idx_invoices_whop_user_id ON invoices(whop_user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

-- Inventory indexes
CREATE INDEX IF NOT EXISTS idx_inventory_whop_user_id ON inventory(whop_user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_current_stock ON inventory(current_stock);

-- Communication log indexes
CREATE INDEX IF NOT EXISTS idx_communication_log_whop_user_id ON communication_log(whop_user_id);
CREATE INDEX IF NOT EXISTS idx_communication_log_customer_id ON communication_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_communication_log_job_id ON communication_log(job_id);
CREATE INDEX IF NOT EXISTS idx_communication_log_sent_at ON communication_log(sent_at);

-- Equipment indexes
CREATE INDEX IF NOT EXISTS idx_equipment_whop_user_id ON equipment(whop_user_id);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_assigned_technician ON equipment(assigned_technician_id);

-- Expenses indexes
CREATE INDEX IF NOT EXISTS idx_expenses_whop_user_id ON expenses(whop_user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_job_id ON expenses(job_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses(expense_date);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to generate job numbers
CREATE OR REPLACE FUNCTION generate_job_number()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    sequence_num INTEGER;
    job_number TEXT;
BEGIN
    year_part := EXTRACT(YEAR FROM NOW())::TEXT;
    
    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(job_number FROM 'JOB-\d+-(\d+)') AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM jobs
    WHERE job_number LIKE 'JOB-' || year_part || '-%';
    
    job_number := 'JOB-' || year_part || '-' || LPAD(sequence_num::TEXT, 3, '0');
    RETURN job_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT;
    sequence_num INTEGER;
    invoice_number TEXT;
BEGIN
    year_part := EXTRACT(YEAR FROM NOW())::TEXT;
    
    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 'INV-\d+-(\d+)') AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM invoices
    WHERE invoice_number LIKE 'INV-' || year_part || '-%';
    
    invoice_number := 'INV-' || year_part || '-' || LPAD(sequence_num::TEXT, 3, '0');
    RETURN invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate job numbers
CREATE OR REPLACE FUNCTION trigger_generate_job_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.job_number IS NULL OR NEW.job_number = '' THEN
        NEW.job_number := generate_job_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_jobs_job_number
    BEFORE INSERT ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION trigger_generate_job_number();

-- Trigger to auto-generate invoice numbers
CREATE OR REPLACE FUNCTION trigger_generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := generate_invoice_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_invoices_invoice_number
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION trigger_generate_invoice_number();

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER trigger_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_technicians_updated_at
    BEFORE UPDATE ON technicians
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_inventory_updated_at
    BEFORE UPDATE ON inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_equipment_updated_at
    BEFORE UPDATE ON equipment
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================

-- Insert sample customers
INSERT INTO customers (whop_user_id, name, email, phone, address, city, state, zip_code, customer_type) VALUES
('sample_user_1', 'John Smith', 'john@example.com', '555-0101', '123 Main St', 'Anytown', 'CA', '12345', 'residential'),
('sample_user_1', 'ABC Company', 'contact@abccompany.com', '555-0102', '456 Business Ave', 'Anytown', 'CA', '12346', 'commercial');

-- Insert sample technicians
INSERT INTO technicians (whop_user_id, name, email, phone, skills, hourly_rate, status) VALUES
('sample_user_1', 'Mike Johnson', 'mike@servicehomie.com', '555-0201', ARRAY['plumbing', 'electrical'], 75.00, 'active'),
('sample_user_1', 'Sarah Wilson', 'sarah@servicehomie.com', '555-0202', ARRAY['hvac', 'electrical'], 80.00, 'active');

-- Insert sample inventory
INSERT INTO inventory (whop_user_id, name, description, sku, category, unit_type, cost_per_unit, selling_price, current_stock) VALUES
('sample_user_1', 'Pipe Wrench 12"', 'Professional pipe wrench', 'PW-12', 'Tools', 'piece', 25.00, 35.00, 5),
('sample_user_1', 'Electrical Wire 12 AWG', 'Copper electrical wire', 'EW-12', 'Materials', 'foot', 0.50, 0.75, 1000),
('sample_user_1', 'HVAC Filter 16x20', 'Standard HVAC air filter', 'HF-1620', 'Materials', 'piece', 8.00, 12.00, 25);

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE customers IS 'Customer database with contact information and preferences';
COMMENT ON TABLE technicians IS 'Technician/employee management with skills and rates';
COMMENT ON TABLE jobs IS 'Work orders and job management system';
COMMENT ON TABLE invoices IS 'Professional invoicing system';
COMMENT ON TABLE invoice_items IS 'Line items for invoices';
COMMENT ON TABLE inventory IS 'Parts and materials inventory tracking';
COMMENT ON TABLE job_materials IS 'Materials used in specific jobs';
COMMENT ON TABLE communication_log IS 'Customer communication history';
COMMENT ON TABLE equipment IS 'Company equipment and tool management';
COMMENT ON TABLE expenses IS 'Business expense tracking';

COMMENT ON COLUMN customers.customer_type IS 'Type of customer: residential or commercial';
COMMENT ON COLUMN technicians.skills IS 'Array of technician skills for job matching';
COMMENT ON COLUMN jobs.job_number IS 'Human-readable job identifier';
COMMENT ON COLUMN jobs.priority IS 'Job priority level for scheduling';
COMMENT ON COLUMN invoices.invoice_number IS 'Human-readable invoice identifier';
COMMENT ON COLUMN inventory.current_stock IS 'Current quantity in stock';
COMMENT ON COLUMN equipment.assigned_technician_id IS 'Technician currently assigned this equipment';
