export interface Technician {
  id: number;
  name: string;
  email: string;
  phone: string;
  services: string[];
  rating: number;
  reviews: number;
  price: number;
  location: string;
  experience: string;
  verified: boolean;
  available: boolean;
  specialties: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  user_type: 'homeowner' | 'technician' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  homeowner_id: string;
  technician_id: number;
  service: string;
  scheduled_date: string;
  scheduled_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  address: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  booking_id: number;
  homeowner_id: string;
  technician_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Message {
  id: number;
  booking_id: number;
  sender_id: string;
  sender_type: 'homeowner' | 'technician';
  content: string;
  created_at: string;
}

export interface Job {
  id: number;
  technician_id: number;
  service: string;
  price: number;
  description: string;
  created_at: string;
} 