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
          created_at?: string
          updated_at?: string
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
