import { supabase } from './supabase';
import { Technician, User, Booking, Review, Message } from '@/types/database';

// Technician functions
export async function getTechnicians(service?: string) {
  let query = supabase
    .from('technicians')
    .select('*')
    .eq('available', true)
    .eq('verified', true);

  if (service) {
    query = query.contains('services', [service]);
  }

  // Remove ordering by 'rating' since the column does not exist
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching technicians:', error);
    throw error;
  }

  return data as Technician[];
}

export async function getTechnicianById(id: number) {
  const { data, error } = await supabase
    .from('technicians')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching technician:', error);
    throw error;
  }

  return data as Technician;
}

// User functions
export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    throw error;
  }

  return data as User;
}

export async function createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }

  return data as User;
}

// Booking functions
export async function createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }

  return data as Booking;
}

export async function getBookingsByUser(userId: string, userType: 'homeowner' | 'technician') {
  const column = userType === 'homeowner' ? 'homeowner_id' : 'technician_id';
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq(column, userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }

  return data as Booking[];
}

export async function updateBookingStatus(bookingId: number, status: Booking['status']) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking:', error);
    throw error;
  }

  return data as Booking;
}

// Review functions
export async function createReview(reviewData: Omit<Review, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData])
    .select()
    .single();

  if (error) {
    console.error('Error creating review:', error);
    throw error;
  }

  return data as Review;
}

export async function getReviewsByTechnician(technicianId: number) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('technician_id', technicianId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }

  return data as Review[];
}

// Message functions
export async function getMessagesByBooking(bookingId: number) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  return data as Message[];
}

export async function sendMessage(messageData: Omit<Message, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('messages')
    .insert([messageData])
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }

  return data as Message;
}

export async function createJob(jobData: {
  technician_id: number;
  service: string;
  price: number;
  description: string;
}) {
  const { data, error } = await supabase
    .from('jobs')
    .insert([jobData])
    .select()
    .single();

  if (error) {
    console.error('Error creating job:', error);
    throw error;
  }

  return data;
}

export async function getJobsByService(service: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*, technician:technician_id(*)')
    .eq('service', service)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }

  return data;
} 