import { supabase } from './supabase';
import { User } from '@clerk/nextjs/server';

// Types
export interface UserProfile {
  id: string;
  clerk_user_id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'technician' | 'customer';
  created_at: string;
  updated_at: string;
}

export interface TechnicianProfile {
  id: string;
  user_profile_id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  bio: string;
  services: any[];
  avatar?: string;
  social_links?: any[];
  calendly_link?: string;
  payment_processor?: string;
  payment_link?: string;
  subscription_status?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  monthly_fee?: number;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  google_business_name?: string;
  google_place_id?: string;
  url_slug?: string;
  created_at: string;
  updated_at: string;
}

export interface VerificationDocument {
  id: string;
  technician_profile_id: string;
  document_type: 'certificate_of_insurance' | 'business_license' | 'background_check';
  file_name: string;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  status: 'pending' | 'approved' | 'rejected';
  review_notes?: string;
  uploaded_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface Booking {
  id: string;
  customer_profile_id: string;
  technician_profile_id: string;
  service_name: string;
  service_description?: string;
  service_price: number;
  booking_date: string;
  booking_time: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  service_address: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  created_at: string;
  updated_at: string;
}

// User Profile Functions
export async function createUserProfile(user: User, role?: 'admin' | 'technician' | 'customer') {
  // Auto-assign role based on email
  let assignedRole: 'admin' | 'technician' | 'customer';
  
  if (role) {
    assignedRole = role;
  } else {
    // Default logic: samuel@servicehomie.com is admin, everyone else is technician
    const userEmail = user.emailAddresses[0]?.emailAddress || '';
    assignedRole = userEmail === 'samuel@servicehomie.com' ? 'admin' : 'technician';
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      clerk_user_id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      role: assignedRole
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserProfile(clerkUserId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateUserProfile(clerkUserId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('clerk_user_id', clerkUserId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Technician Profile Functions
export async function createTechnicianProfile(userProfileId: string, profileData: Partial<TechnicianProfile>) {
  const { data, error } = await supabase
    .from('technician_profiles')
    .insert({
      user_profile_id: userProfileId,
      ...profileData
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getTechnicianProfile(userProfileId: string): Promise<TechnicianProfile | null> {
  const { data, error } = await supabase
    .from('technician_profiles')
    .select('*')
    .eq('user_profile_id', userProfileId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateTechnicianProfile(technicianId: string, updates: Partial<TechnicianProfile>) {
  const { data, error } = await supabase
    .from('technician_profiles')
    .update(updates)
    .eq('id', technicianId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Document Upload Functions
export async function uploadDocument(
  file: File,
  technicianProfileId: string,
  documentType: 'certificate_of_insurance' | 'business_license' | 'background_check'
): Promise<string> {
  try {
    console.log('Starting document upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      technicianProfileId,
      documentType
    });

    // Get technician name for better organization
    const { data: technicianData, error: techError } = await supabase
      .from('technician_profiles')
      .select(`
        id,
        user_profiles!inner(
          full_name,
          email
        )
      `)
      .eq('id', technicianProfileId)
      .single();

    if (techError) {
      console.error('Error fetching technician data:', techError);
      throw techError;
    }

    const technicianName = (technicianData as any)?.user_profiles?.full_name || 'unknown';
    const sanitizedName = technicianName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

    const fileExt = file.name.split('.').pop();
    const fileName = `${sanitizedName}_${technicianProfileId}/${documentType}_${Date.now()}.${fileExt}`;

    console.log('Generated file path:', fileName);

    const { data, error } = await supabase.storage
      .from('verification-documents')
      .upload(fileName, file);

    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }

    console.log('File uploaded successfully:', data);

    const { data: { publicUrl } } = supabase.storage
      .from('verification-documents')
      .getPublicUrl(fileName);

    console.log('Generated public URL:', publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadDocument:', error);
    throw error;
  }
}

export async function createVerificationDocument(
  technicianProfileId: string,
  documentType: 'certificate_of_insurance' | 'business_license' | 'background_check',
  fileName: string,
  fileUrl: string,
  fileSize?: number,
  mimeType?: string
): Promise<VerificationDocument> {
  const { data, error } = await supabase
    .from('verification_documents')
    .insert({
      technician_profile_id: technicianProfileId,
      document_type: documentType,
      file_name: fileName,
      file_url: fileUrl,
      file_size: fileSize,
      mime_type: mimeType,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Verification Management Functions
export async function getVerificationDocuments(technicianProfileId: string): Promise<VerificationDocument[]> {
  const { data, error } = await supabase
    .from('verification_documents')
    .select('*')
    .eq('technician_profile_id', technicianProfileId)
    .order('uploaded_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAllVerificationDocuments(): Promise<VerificationDocument[]> {
  const { data, error } = await supabase
    .from('verification_documents')
    .select(`
      *,
      technician_profiles!inner(
        id,
        user_profile_id,
        business_name,
        user_profiles!inner(
          id,
          full_name,
          email,
          phone
        )
      )
    `)
    .order('uploaded_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Update verification document
export async function updateVerificationDocument(
  documentId: string, 
  updates: Partial<VerificationDocument>
): Promise<VerificationDocument> {
  const { data, error } = await supabase
    .from('verification_documents')
    .update(updates)
    .eq('id', documentId)
    .select()
    .single();

  if (error) throw error;
  
  // After updating a document, check if all documents for this technician are approved
  if (updates.status === 'approved' || updates.status === 'rejected') {
    await checkAndUpdateTechnicianVerification(data.technician_profile_id);
  }
  
  return data;
}

// Check if all documents are approved and update technician verification status
async function checkAndUpdateTechnicianVerification(technicianProfileId: string) {
  try {
    // Get all documents for this technician
    const { data: documents, error } = await supabase
      .from('verification_documents')
      .select('*')
      .eq('technician_profile_id', technicianProfileId);

    if (error) throw error;

    // Check if all required document types are approved
    const requiredTypes = ['certificate_of_insurance', 'business_license', 'background_check'];
    const allApproved = requiredTypes.every(type => 
      documents.some(doc => 
        doc.document_type === type && doc.status === 'approved'
      )
    );

    // Update technician verification status
    await supabase
      .from('technician_profiles')
      .update({ is_verified: allApproved })
      .eq('id', technicianProfileId);

  } catch (error) {
    console.error('Error updating technician verification status:', error);
  }
}

// Booking Functions
export async function createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getBookings(userProfileId: string, role: 'customer' | 'technician'): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq(role === 'customer' ? 'customer_profile_id' : 'technician_profile_id', userProfileId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Admin Functions
export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAllTechnicians(): Promise<TechnicianProfile[]> {
  const { data, error } = await supabase
    .from('technician_profiles')
    .select(`
      *,
      user_profiles!inner(
        id,
        full_name,
        email,
        phone
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
} 