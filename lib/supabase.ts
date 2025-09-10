import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are missing (for build time)
const createMockClient = () => ({
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve({ data: [], error: null })
      }),
      single: () => Promise.resolve({ data: null, error: null })
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ error: null })
    })
  })
});

// Check if the URL is valid before creating the client
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const supabase = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient() as any;

export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string
          whop_user_id: string
          name: string
          description: string
          price: number
          duration_minutes: number
          status: 'active' | 'inactive'
          category: string
          service_area: string
          service_type: 'one_time' | 'recurring' | 'maintenance'
          requires_equipment: boolean
          requires_materials: boolean
          skill_requirements: string[]
          estimated_duration_minutes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          whop_user_id: string
          name: string
          description: string
          price: number
          duration_minutes: number
          status?: 'active' | 'inactive'
          category: string
          service_area: string
          service_type?: 'one_time' | 'recurring' | 'maintenance'
          requires_equipment?: boolean
          requires_materials?: boolean
          skill_requirements?: string[]
          estimated_duration_minutes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          whop_user_id?: string
          name?: string
          description?: string
          price?: number
          duration_minutes?: number
          status?: 'active' | 'inactive'
          category?: string
          service_area?: string
          service_type?: 'one_time' | 'recurring' | 'maintenance'
          requires_equipment?: boolean
          requires_materials?: boolean
          skill_requirements?: string[]
          estimated_duration_minutes?: number
          created_at?: string
          updated_at?: string
        }
      }
      availability: {
        Row: {
          id: string
          whop_user_id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at: string
        }
        Insert: {
          id?: string
          whop_user_id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at?: string
        }
        Update: {
          id?: string
          whop_user_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          whop_user_id: string
          service_id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          customer_address: string
          booking_date: string
          start_time: string
          total_price: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes: string
          job_id: string | null
          technician_id: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          special_instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          whop_user_id: string
          service_id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          customer_address: string
          booking_date: string
          start_time: string
          total_price: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes: string
          job_id?: string | null
          technician_id?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          whop_user_id?: string
          service_id?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          customer_address?: string
          booking_date?: string
          start_time?: string
          total_price?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          notes?: string
          job_id?: string | null
          technician_id?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          whop_user_id: string
          name: string
          email: string
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          customer_type: 'residential' | 'commercial'
          preferred_contact_method: 'email' | 'phone' | 'sms'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          whop_user_id: string
          name: string
          email: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          customer_type?: 'residential' | 'commercial'
          preferred_contact_method?: 'email' | 'phone' | 'sms'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          whop_user_id?: string
          name?: string
          email?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          customer_type?: 'residential' | 'commercial'
          preferred_contact_method?: 'email' | 'phone' | 'sms'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      technicians: {
        Row: {
          id: string
          whop_user_id: string
          name: string
          email: string
          phone: string | null
          skills: string[]
          hourly_rate: number | null
          status: 'active' | 'inactive' | 'on_leave'
          hire_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          whop_user_id: string
          name: string
          email: string
          phone?: string | null
          skills?: string[]
          hourly_rate?: number | null
          status?: 'active' | 'inactive' | 'on_leave'
          hire_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          whop_user_id?: string
          name?: string
          email?: string
          phone?: string | null
          skills?: string[]
          hourly_rate?: number | null
          status?: 'active' | 'inactive' | 'on_leave'
          hire_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          whop_user_id: string
          customer_id: string
          service_id: string | null
          technician_id: string | null
          job_number: string
          title: string
          description: string | null
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          scheduled_date: string | null
          scheduled_start_time: string | null
          scheduled_end_time: string | null
          actual_start_time: string | null
          actual_end_time: string | null
          estimated_duration_minutes: number | null
          actual_duration_minutes: number | null
          labor_cost: number | null
          material_cost: number | null
          total_cost: number | null
          customer_notes: string | null
          internal_notes: string | null
          completion_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          whop_user_id: string
          customer_id: string
          service_id?: string | null
          technician_id?: string | null
          job_number?: string
          title: string
          description?: string | null
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          scheduled_date?: string | null
          scheduled_start_time?: string | null
          scheduled_end_time?: string | null
          actual_start_time?: string | null
          actual_end_time?: string | null
          estimated_duration_minutes?: number | null
          actual_duration_minutes?: number | null
          labor_cost?: number | null
          material_cost?: number | null
          total_cost?: number | null
          customer_notes?: string | null
          internal_notes?: string | null
          completion_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          whop_user_id?: string
          customer_id?: string
          service_id?: string | null
          technician_id?: string | null
          job_number?: string
          title?: string
          description?: string | null
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          scheduled_date?: string | null
          scheduled_start_time?: string | null
          scheduled_end_time?: string | null
          actual_start_time?: string | null
          actual_end_time?: string | null
          estimated_duration_minutes?: number | null
          actual_duration_minutes?: number | null
          labor_cost?: number | null
          material_cost?: number | null
          total_cost?: number | null
          customer_notes?: string | null
          internal_notes?: string | null
          completion_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          whop_user_id: string
          customer_id: string
          job_id: string | null
          invoice_number: string
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          issue_date: string
          due_date: string | null
          subtotal: number
          tax_rate: number
          tax_amount: number
          total_amount: number
          paid_amount: number
          payment_method: string | null
          payment_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          whop_user_id: string
          customer_id: string
          job_id?: string | null
          invoice_number?: string
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          issue_date?: string
          due_date?: string | null
          subtotal?: number
          tax_rate?: number
          tax_amount?: number
          total_amount?: number
          paid_amount?: number
          payment_method?: string | null
          payment_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          whop_user_id?: string
          customer_id?: string
          job_id?: string | null
          invoice_number?: string
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          issue_date?: string
          due_date?: string | null
          subtotal?: number
          tax_rate?: number
          tax_amount?: number
          total_amount?: number
          paid_amount?: number
          payment_method?: string | null
          payment_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          description: string
          quantity: number
          unit_price: number
          total_price: number
          item_type: 'service' | 'material' | 'labor' | 'other'
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          description: string
          quantity?: number
          unit_price: number
          total_price: number
          item_type?: 'service' | 'material' | 'labor' | 'other'
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          description?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          item_type?: 'service' | 'material' | 'labor' | 'other'
          created_at?: string
        }
      }
      inventory: {
        Row: {
          id: string
          whop_user_id: string
          name: string
          description: string | null
          sku: string | null
          category: string | null
          unit_type: 'piece' | 'hour' | 'foot' | 'gallon' | 'pound'
          cost_per_unit: number | null
          selling_price: number | null
          current_stock: number
          minimum_stock: number
          supplier: string | null
          supplier_contact: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          whop_user_id: string
          name: string
          description?: string | null
          sku?: string | null
          category?: string | null
          unit_type?: 'piece' | 'hour' | 'foot' | 'gallon' | 'pound'
          cost_per_unit?: number | null
          selling_price?: number | null
          current_stock?: number
          minimum_stock?: number
          supplier?: string | null
          supplier_contact?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          whop_user_id?: string
          name?: string
          description?: string | null
          sku?: string | null
          category?: string | null
          unit_type?: 'piece' | 'hour' | 'foot' | 'gallon' | 'pound'
          cost_per_unit?: number | null
          selling_price?: number | null
          current_stock?: number
          minimum_stock?: number
          supplier?: string | null
          supplier_contact?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      job_materials: {
        Row: {
          id: string
          job_id: string
          inventory_id: string | null
          material_name: string
          quantity_used: number
          unit_cost: number
          total_cost: number
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          inventory_id?: string | null
          material_name: string
          quantity_used: number
          unit_cost: number
          total_cost: number
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          inventory_id?: string | null
          material_name?: string
          quantity_used?: number
          unit_cost?: number
          total_cost?: number
          created_at?: string
        }
      }
      communication_log: {
        Row: {
          id: string
          whop_user_id: string
          customer_id: string
          job_id: string | null
          communication_type: 'email' | 'sms' | 'phone' | 'in_person' | 'note'
          direction: 'inbound' | 'outbound'
          subject: string | null
          message: string
          sent_by: string | null
          sent_at: string
          created_at: string
        }
        Insert: {
          id?: string
          whop_user_id: string
          customer_id: string
          job_id?: string | null
          communication_type: 'email' | 'sms' | 'phone' | 'in_person' | 'note'
          direction: 'inbound' | 'outbound'
          subject?: string | null
          message: string
          sent_by?: string | null
          sent_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          whop_user_id?: string
          customer_id?: string
          job_id?: string | null
          communication_type?: 'email' | 'sms' | 'phone' | 'in_person' | 'note'
          direction?: 'inbound' | 'outbound'
          subject?: string | null
          message?: string
          sent_by?: string | null
          sent_at?: string
          created_at?: string
        }
      }
      equipment: {
        Row: {
          id: string
          whop_user_id: string
          name: string
          description: string | null
          equipment_type: string | null
          serial_number: string | null
          purchase_date: string | null
          purchase_cost: number | null
          current_value: number | null
          status: 'active' | 'maintenance' | 'retired'
          assigned_technician_id: string | null
          maintenance_schedule: string | null
          last_maintenance_date: string | null
          next_maintenance_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          whop_user_id: string
          name: string
          description?: string | null
          equipment_type?: string | null
          serial_number?: string | null
          purchase_date?: string | null
          purchase_cost?: number | null
          current_value?: number | null
          status?: 'active' | 'maintenance' | 'retired'
          assigned_technician_id?: string | null
          maintenance_schedule?: string | null
          last_maintenance_date?: string | null
          next_maintenance_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          whop_user_id?: string
          name?: string
          description?: string | null
          equipment_type?: string | null
          serial_number?: string | null
          purchase_date?: string | null
          purchase_cost?: number | null
          current_value?: number | null
          status?: 'active' | 'maintenance' | 'retired'
          assigned_technician_id?: string | null
          maintenance_schedule?: string | null
          last_maintenance_date?: string | null
          next_maintenance_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          whop_user_id: string
          job_id: string | null
          category: string
          description: string
          amount: number
          expense_date: string
          receipt_url: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          whop_user_id: string
          job_id?: string | null
          category: string
          description: string
          amount: number
          expense_date?: string
          receipt_url?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          whop_user_id?: string
          job_id?: string | null
          category?: string
          description?: string
          amount?: number
          expense_date?: string
          receipt_url?: string | null
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
