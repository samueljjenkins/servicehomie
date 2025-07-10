
import { supabase } from './supabase';
import { SignUpWithPasswordCredentials } from '@supabase/supabase-js';

type UserRole = 'homeowner' | 'technician';

interface UserDetails {
  fullName: string;
  phone: string;
  role: UserRole;
  // Technician specific details
  serviceCategory?: string;
  zipCodes?: string;
  experienceDescription?: string;
  govIdUrl?: string;
  businessLicenseUrl?: string;
  insuranceProofUrl?: string;
  workPhotosUrls?: string[];
  status?: 'pending' | 'approved' | 'rejected';
}

// Sign up function
export async function signUp(credentials: SignUpWithPasswordCredentials, details: UserDetails) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    ...credentials,
    options: {
      data: {
        full_name: details.fullName,
        phone: details.phone,
        user_type: details.role,
        service_category: details.serviceCategory,
        zip_codes: details.zipCodes,
        experience_description: details.experienceDescription,
        gov_id_url: details.govIdUrl,
        business_license_url: details.businessLicenseUrl,
        insurance_proof_url: details.insuranceProofUrl,
        work_photos_urls: details.workPhotosUrls,
        application_status: details.status,
      }
    }
  });

  if (authError) {
    console.error('Error signing up (Auth):', authError.message);
    throw new Error(`Authentication failed: ${authError.message}`);
  }

  if (!authData.user) {
    throw new Error("Sign up successful, but no user data returned. Please try logging in.");
  }
  
  // The database trigger will now handle creating the user profile.
  // No need to manually insert here anymore.

  return authData.user;
}

// Sign in function
export async function signIn(credentials: SignUpWithPasswordCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    console.error('Error signing in:', error.message);
    throw new Error(`Sign in failed: ${error.message}`);
  }
  
  return data.user;
}

// Sign out function
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error.message);
    throw new Error(`Sign out failed: ${error.message}`);
  }
}

// Get current session
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }
  return data.session;
}

// Get user profile from our public 'users' table
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error.message);
    return null;
  }
  return data;
} 