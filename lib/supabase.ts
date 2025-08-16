import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types matching your exact schema
export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          whop_company_id: string
          name: string
          description: string | null
          logo_url: string | null
          whop_plan_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          whop_company_id: string
          name: string
          description?: string | null
          logo_url?: string | null
          whop_plan_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          whop_company_id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          whop_plan_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          tenant_id: string
          whop_user_id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          whop_user_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          whop_user_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          tenant_id: string
          name: string
          description: string | null
          price: number
          duration_minutes: number
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          description?: string | null
          price: number
          duration_minutes: number
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          description?: string | null
          price?: number
          duration_minutes?: number
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      availability: {
        Row: {
          id: string
          tenant_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          tenant_id: string
          customer_id: string
          service_id: string
          booking_date: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          customer_id: string
          service_id: string
          booking_date: string
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          customer_id?: string
          service_id?: string
          booking_date?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
