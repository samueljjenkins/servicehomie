'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import SubscriptionGuard from '@/components/SubscriptionGuard';

// Immediate debugging
console.log('🔍 DASHBOARD PAGE LOADED - SubscriptionGuard should be active');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface TechnicianProfile {
  id: string;
  user_profile_id: string;
  name: string;
  location: string;
  bio: string;
  email: string;
  avatar: string;
  services: any[];
  reviews: any[];
  created_at: string;
  updated_at: string;
  calendly_link: string;
  subscription_status: string;
  subscription_start_date: string;
  subscription_end_date: string;
  monthly_fee: number;
  payment_processor: string;
  payment_link: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  google_business_name: string;
  google_place_id: string;
  social_links: any[];
  url_slug: string;
}

export default function TechnicianDashboard() {
  const { userId, isSignedIn } = useAuth();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [technicianProfile, setTechnicianProfile] = useState<TechnicianProfile | null>(null);
  const [calendlyLink, setCalendlyLink] = useState('');
  const [googleBusinessUrl, setGoogleBusinessUrl] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customDomain, setCustomDomain] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);

  // Direct subscription check - runs immediately
  useEffect(() => {
    const checkSubscription = async () => {
      // If not signed in, redirect to sign in
      if (!isSignedIn) {
        console.log('🔍 DASHBOARD: Not signed in, redirecting to sign in');
        window.location.href = '/sign-in?redirect=/technician-dashboard';
        return;
      }

      if (!userId) {
        console.log('🔍 DASHBOARD: No userId, waiting...');
        return;
      }
      
      // Prevent multiple checks
      if (subscriptionChecked) {
        return;
      }
      
      try {
        console.log('🔍 DASHBOARD: Checking subscription directly');
        const { data: userProfile, error: userError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('clerk_user_id', userId)
          .single();

        if (userError) {
          console.log('🔍 DASHBOARD: No user profile, redirecting to subscription');
          window.location.href = '/subscription-required';
          return;
        }

        const { data: techProfile, error: techError } = await supabase
          .from('technician_profiles')
          .select('*')
          .eq('user_profile_id', userProfile.id)
          .single();

        if (techError) {
          console.log('🔍 DASHBOARD: No tech profile, redirecting to subscription');
          window.location.href = '/subscription-required';
          return;
        }

        // Check if user has active subscription with real Stripe ID
        const hasActiveSubscription = techProfile.subscription_status === 'active' && 
                                    techProfile.stripe_subscription_id && 
                                    techProfile.stripe_subscription_id.trim() !== '';

        console.log('🔍 DASHBOARD: Subscription check result:', {
          status: techProfile.subscription_status,
          stripeId: techProfile.stripe_subscription_id,
          hasActive: hasActiveSubscription
        });

        if (!hasActiveSubscription) {
          console.log('🔍 DASHBOARD: No active subscription, redirecting');
          window.location.href = '/subscription-required';
          return;
        }

        console.log('🔍 DASHBOARD: Active subscription found, allowing access');
        setSubscriptionChecked(true);
      } catch (error) {
        console.error('🔍 DASHBOARD: Error checking subscription:', error);
        window.location.href = '/subscription-required';
      }
    };

    checkSubscription();
  }, [userId, isSignedIn, subscriptionChecked]);

  // Show loading while checking subscription
  if (!subscriptionChecked || !isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking subscription status...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ) },
    { id: 'subscription', label: 'Subscription', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ) },
    { id: 'bookings', label: 'Bookings', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ) },
    { id: 'reviews', label: 'Reviews', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ) }
  ];

  // Helper function to check if profile exists
  const checkProfileExists = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('technician_profiles')
        .select('id')
        .eq('user_profile_id', userId)
        .single();
      
      return { exists: !!data, error };
    } catch (error) {
      return { exists: false, error };
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTechnicianProfile();
    }
  }, [userId]);

  const fetchTechnicianProfile = async () => {
    try {
      console.log('Fetching profile for user:', userId);
      console.log('User ID type:', typeof userId);
      console.log('User ID length:', userId?.length);
      
      if (!userId) {
        console.log('No userId available');
        setTechnicianProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('technician_profiles')
        .select('*')
        .eq('user_profile_id', userId)
        .single();

      console.log('Profile fetch result:', { data, error });

      if (error) {
        console.error('Error fetching profile:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // If it's a UUID format error, provide specific guidance
        if (error.message?.includes('uuid') || error.message?.includes('invalid input syntax')) {
          console.error('UUID FORMAT ERROR DETECTED');
          console.error('This suggests the database column is expecting UUID format but receiving string format from Clerk');
          console.error('Please run the fix_user_profile_id.sql script in your Supabase dashboard');
        }
        
        // If no profile exists, we'll handle this in the UI
        setTechnicianProfile(null);
      } else if (data) {
        setTechnicianProfile(data);
        setCalendlyLink(data.calendly_link || '');
        setGoogleBusinessUrl(data.google_business_name || '');
        setServices(data.services || []);
        setCustomDomain(data.url_slug || '');
      }
    } catch (error) {
      console.error('Error fetching technician profile:', error);
      setTechnicianProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomDomain = async () => {
    if (!customDomain.trim()) {
      alert('Please enter a custom URL');
      return;
    }

    if (!userId) {
      alert('User not authenticated');
      return;
    }

    console.log('=== CUSTOM URL UPDATE DEBUG ===');
    console.log('User ID:', userId);
    console.log('Input custom domain:', customDomain);

    // Validate URL format
    const formattedSlug = customDomain.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    console.log('Formatted slug:', formattedSlug);
    
    if (formattedSlug.length < 3) {
      alert('URL must be at least 3 characters long');
      return;
    }

    if (formattedSlug.length > 50) {
      alert('URL must be less than 50 characters long');
      return;
    }

    // Check for reserved words
    const reservedWords = ['admin', 'api', 'dashboard', 'login', 'signup', 'test', 'debug'];
    if (reservedWords.includes(formattedSlug)) {
      alert('This URL is reserved and cannot be used. Please choose a different one.');
      return;
    }

    setSaving(true);
    try {
      // Check if this URL is already taken by another user
      console.log('Checking if URL is already taken...');
      const { data: existingProfile, error: checkError } = await supabase
        .from('technician_profiles')
        .select('user_profile_id')
        .eq('url_slug', formattedSlug)
        .neq('user_profile_id', userId)
        .single();

      console.log('Existing profile check result:', { existingProfile, checkError });

      if (existingProfile) {
        alert('This URL is already taken by another user. Please choose a different one.');
        return;
      }

      // Check if technician profile exists for this user
      console.log('Checking if technician profile exists...');
      const { data: currentProfile, error: profileError } = await supabase
        .from('technician_profiles')
        .select('*')
        .eq('user_profile_id', userId)
        .single();

      console.log('Current profile check result:', { currentProfile, profileError });

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Creating new technician profile...');
        const newProfileData = {
          user_profile_id: userId,
          url_slug: formattedSlug,
          name: 'Your Business Name',
          location: 'Your City, State',
          bio: 'Tell customers about your business and experience',
          email: user?.emailAddresses?.[0]?.emailAddress || '',
          subscription_status: 'pending', // Changed from 'inactive' to 'pending'
          monthly_fee: 19
        };
        
        console.log('New profile data to insert:', newProfileData);
        
        const { data: newProfile, error: createError } = await supabase
          .from('technician_profiles')
          .insert(newProfileData)
          .select()
          .single();

        console.log('Profile creation result:', { newProfile, createError });

        if (createError) {
          console.error('Error creating profile:', createError);
          
          // Handle unique constraint violations
          if (createError.code === '23505') {
            if (createError.message.includes('user_profile_id')) {
              alert('A profile already exists for this user. Please refresh the page.');
            } else if (createError.message.includes('url_slug')) {
              alert('This URL is already taken. Please choose a different one.');
            } else if (createError.message.includes('email')) {
              alert('This email is already registered. Please use a different email.');
            } else {
              alert('Profile already exists. Please refresh the page.');
            }
          } else {
            alert(`Error creating technician profile: ${createError.message}`);
          }
          return;
        }

        setTechnicianProfile(newProfile);
        setCustomDomain(formattedSlug);
        alert('Custom URL created successfully! Your page is now available at: servicehomie.com/' + formattedSlug);
      } else if (profileError) {
        console.error('Error checking profile:', profileError);
        alert('Error checking profile. Please try again.');
        return;
      } else {
        // Profile exists, update it
        console.log('Updating existing profile...');
        const { data: updatedProfile, error: updateError } = await supabase
          .from('technician_profiles')
          .update({
            url_slug: formattedSlug,
            updated_at: new Date().toISOString()
          })
          .eq('user_profile_id', userId)
          .select()
          .single();

        console.log('Profile update result:', { updatedProfile, updateError });

        if (updateError) {
          console.error('Error updating profile:', updateError);
          alert(`Error updating technician profile: ${updateError.message}`);
          return;
        }

        setTechnicianProfile(updatedProfile);
        setCustomDomain(formattedSlug);
        alert('Custom URL updated successfully! Your page is now available at: servicehomie.com/' + formattedSlug);
      }
    } catch (error: any) {
      console.error('=== ERROR SUMMARY ===');
      console.error('Error type:', typeof error);
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      
      if (error.message?.includes('duplicate')) {
        alert('This URL is already taken. Please choose a different one.');
      } else {
        alert(`Error updating custom URL: ${error.message || 'Unknown error occurred. Please try again.'}`);
      }
    } finally {
      setSaving(false);
      console.log('=== CUSTOM URL UPDATE COMPLETE ===');
    }
  };

  const handleCalendlySave = async () => {
    if (!userId) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('technician_profiles')
        .update({ calendly_link: calendlyLink })
        .eq('user_profile_id', userId);

      if (error) throw error;
      
      // Update local state
      setTechnicianProfile(prev => prev ? { ...prev, calendly_link: calendlyLink } : null);
      alert('Calendly link updated successfully!');
    } catch (error: any) {
      console.error('Error updating Calendly link:', error);
      alert(`Error updating Calendly link: ${error.message || 'Please try again.'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleGoogleBusinessSave = async () => {
    if (!userId) return;
    
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('technician_profiles')
        .update({
          google_business_name: googleBusinessUrl,
          updated_at: new Date().toISOString()
        })
        .eq('user_profile_id', userId);

      if (error) {
        console.error('Error updating Google Business URL:', error);
        alert('Error saving Google Business URL. Please try again.');
      } else {
        alert('Google Business URL saved successfully!');
        // Update local profile state
        setTechnicianProfile(prev => prev ? {
          ...prev,
          google_business_name: googleBusinessUrl
        } : null);
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert('Error saving Google Business URL. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!userId) return;
    
    // Check if we have a subscription ID
    if (!technicianProfile?.stripe_subscription_id) {
      alert('No active subscription found. Please contact support if you believe this is an error.');
      setShowCancelModal(false);
      return;
    }
    
    setCancelling(true);
    
    try {
      // Call the cancel subscription API
      const requestData = {
        userId: userId,
        subscriptionId: technicianProfile.stripe_subscription_id
      };
      
      console.log('Sending cancel subscription request:', requestData);
      
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log('Cancel subscription response:', result);

      if (response.ok) {
        // Update local profile state
        setTechnicianProfile(prev => prev ? {
          ...prev,
          subscription_status: 'cancelled',
          subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        } : null);
        
        alert('Subscription cancelled successfully. You will have access until the end of your current billing period.');
        setShowCancelModal(false);
      } else {
        alert(result.error || 'Error cancelling subscription. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Error cancelling subscription. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If no profile exists, show setup message
  if (!technicianProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
              Welcome to Service Homie!
            </h1>
            <p className="text-lg text-gray-600 mb-8" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              Let's set up your professional landing page. Start by creating your custom URL.
            </p>
            
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                Create Your Custom URL
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Your Custom URL
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      servicehomie.com/
                    </span>
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="your-business-name"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 text-sm border border-gray-300"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                    This will be your public landing page URL
                  </p>
                </div>
                
                <button
                  onClick={handleCustomDomain}
                  disabled={saving}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  {saving ? 'Creating...' : 'Create Your Landing Page'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SubscriptionGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
              <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                      {technicianProfile?.name || 'Your Business'}
                    </h2>
                    <p className="text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      Manage your business profile and bookings
                    </p>
                  </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={technicianProfile?.url_slug ? `/${technicianProfile.url_slug}` : '/technician-page'}
                  target="_blank"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center font-medium"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  View Page
                </Link>
                <Link
                  href="/technician-page/edit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center font-medium"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  Edit Page
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6 sm:mb-8">
            <div className="border-b border-gray-100">
              <nav className="flex flex-wrap overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6 sm:space-y-8">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-xs sm:text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Landing Page Views
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                            0
                          </p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-xs sm:text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Calendly Clicks
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                            0
                          </p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-xs sm:text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Email Clicks
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                            0
                          </p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-xs sm:text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Page Status
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                            Live
                          </p>
                        </div>
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom URL Section */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                      Custom URL
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          Your Landing Page URL
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="text"
                            value={customDomain}
                            onChange={(e) => setCustomDomain(e.target.value)}
                            placeholder="your-business-name"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                          />
                          <button
                            onClick={handleCustomDomain}
                            disabled={saving}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap"
                            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                          >
                            {saving ? 'Saving...' : 'Save URL'}
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          This will be your public landing page URL
                        </p>
                        
                        {technicianProfile?.url_slug && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              Your current URL:
                            </p>
                            <p className="font-mono text-blue-900 text-xs sm:text-sm break-all" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              servicehomie.com/{technicianProfile.url_slug}
                            </p>
                            <div className="mt-3">
                              <Link
                                href={`/${technicianProfile.url_slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Test your URL
                              </Link>
                            </div>
                          </div>
                        )}
                      
                        {!technicianProfile?.url_slug && (
                          <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-sm text-yellow-800" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              Set a custom URL to make your landing page public
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="mb-6 lg:mb-0">
                        <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                          Starter Plan
                        </h3>
                        <p className="text-blue-100 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          Your subscription is {technicianProfile?.subscription_status === 'active' ? 'active' : 'inactive'} and you have access to all features.
                        </p>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 ${technicianProfile?.subscription_status === 'active' ? 'bg-green-400' : 'bg-red-400'} rounded-full`}></div>
                          <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            {technicianProfile?.subscription_status === 'active' ? 'Active Subscription' : 'Inactive Subscription'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl sm:text-4xl font-bold mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                          $19
                        </div>
                        <div className="text-blue-100 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          per month
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        Plan Details
                      </h4>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-gray-600 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Next billing date:
                          </span>
                          <p className="text-gray-900 font-medium text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            {technicianProfile?.subscription_end_date ? new Date(technicianProfile.subscription_end_date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-gray-600 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Monthly fee:
                          </span>
                          <p className="text-gray-900 font-medium text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            ${technicianProfile?.monthly_fee || 19}/month
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-gray-600 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Status:
                          </span>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 ${technicianProfile?.subscription_status === 'active' ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
                            <p className={`font-medium text-sm sm:text-base capitalize ${technicianProfile?.subscription_status === 'active' ? 'text-green-600' : 'text-red-600'}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              {technicianProfile?.subscription_status || 'Inactive'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {technicianProfile?.subscription_status === 'active' && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <button
                            onClick={() => setShowCancelModal(true)}
                            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                          >
                            Cancel Subscription
                          </button>
                          <p className="text-xs text-gray-500 mt-2 text-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            You'll have access until the end of your current billing period
                          </p>
                        </div>
                      )}

                      {/* Debug Section - Remove in production */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          Debug Info (Remove in production):
                        </h5>
                        <div className="text-xs text-gray-600 space-y-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          <p>Status: {technicianProfile?.subscription_status || 'Not set'}</p>
                          <p>Stripe ID: {technicianProfile?.stripe_subscription_id || 'Not set'}</p>
                          <p>User ID: {userId}</p>
                        </div>
                        
                        {!technicianProfile?.stripe_subscription_id && (
                          <div className="mt-3">
                            <button
                              onClick={async () => {
                                try {
                                  const response = await fetch('/api/activate-subscription', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ userId })
                                  });
                                  if (response.ok) {
                                    alert('Subscription activated for testing!');
                                    window.location.reload();
                                  } else {
                                    alert('Failed to activate subscription');
                                  }
                                } catch (error) {
                                  alert('Error activating subscription');
                                }
                              }}
                              className="w-full bg-green-600 text-white px-3 py-1 rounded text-xs font-medium"
                              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                            >
                              Activate Test Subscription
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        What's Included
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Professional landing page
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Custom URL
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Calendly integration
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Google Reviews integration
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Mobile responsive design
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        Calendly Integration
                      </h3>
                    </div>

                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                            Connect Your Calendly
                          </h4>
                          <p className="text-gray-600 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Link your Calendly account to allow customers to book appointments directly from your landing page.
                          </p>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                                Calendly Link
                              </label>
                              <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                  type="url"
                                  value={calendlyLink}
                                  onChange={(e) => setCalendlyLink(e.target.value)}
                                  placeholder="https://calendly.com/your-name"
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                                />
                                <button
                                  onClick={handleCalendlySave}
                                  disabled={saving}
                                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap"
                                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                                >
                                  {saving ? 'Saving...' : 'Save'}
                                </button>
                              </div>
                            </div>

                            {calendlyLink && (
                              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center">
                                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-green-800 font-medium text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                    Calendly Connected
                                  </span>
                                </div>
                                <p className="text-green-700 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                                  Your Calendly is now linked to your landing page
                                </p>
                                <a
                                  href={calendlyLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium mt-2"
                                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  View Calendly
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl sm:rounded-2xl border border-blue-200 p-4 sm:p-6">
                      <h4 className="text-lg font-semibold text-blue-900 mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        How it works
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                            1
                          </div>
                          <div>
                            <p className="text-blue-800 font-medium text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              Connect your Calendly account
                            </p>
                            <p className="text-blue-700 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              Add your Calendly link above to enable booking functionality
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                            2
                          </div>
                          <div>
                            <p className="text-blue-800 font-medium text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              Customers book through your landing page
                            </p>
                            <p className="text-blue-700 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              Visitors can schedule appointments directly from your Service Homie page
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                            3
                          </div>
                          <div>
                            <p className="text-blue-800 font-medium text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              Manage everything in Calendly
                            </p>
                            <p className="text-blue-700 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              All appointments, payments, and scheduling are handled through your Calendly dashboard
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                      Google Reviews Integration
                    </h3>
                  </div>

                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                          Connect Your Google Business
                        </h4>
                        <p className="text-gray-600 mb-4 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          Link your Google Business profile to display your reviews on your landing page.
                        </p>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              Google Business URL
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <input
                                type="url"
                                value={googleBusinessUrl}
                                onChange={(e) => setGoogleBusinessUrl(e.target.value)}
                                placeholder="https://maps.google.com/your-business"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                              />
                              <button
                                onClick={handleGoogleBusinessSave}
                                disabled={saving}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap"
                                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                              >
                                {saving ? 'Saving...' : 'Save'}
                              </button>
                            </div>
                          </div>

                          {googleBusinessUrl && (
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-green-800 font-medium text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                  Google Business Connected
                                </span>
                              </div>
                              <p className="text-green-700 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                                Your Google reviews will now appear on your landing page
                              </p>
                              <a
                                href={googleBusinessUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium mt-2"
                                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View Google Business
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl sm:rounded-2xl border border-green-200 p-4 sm:p-6">
                    <h4 className="text-lg font-semibold text-green-900 mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                      How to find your Google Business URL
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                          1
                        </div>
                        <div>
                          <p className="text-green-800 font-medium text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            Go to Google Maps
                          </p>
                          <p className="text-green-700 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Search for your business name on Google Maps
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                          2
                        </div>
                        <div>
                          <p className="text-green-800 font-medium text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            Click on your business listing
                          </p>
                          <p className="text-green-700 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Open your business profile from the search results
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                          3
                        </div>
                        <div>
                          <p className="text-green-800 font-medium text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            Copy the URL
                          </p>
                          <p className="text-green-700 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Copy the URL from your browser's address bar and paste it above
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current Reviews Display */}
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                      Current Reviews
                    </h4>
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <h5 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        {googleBusinessUrl ? 'Reviews Connected' : 'No Reviews Connected'}
                      </h5>
                      <p className="text-gray-600 text-sm sm:text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        {googleBusinessUrl 
                          ? 'Your Google reviews will appear on your landing page' 
                          : 'Connect your Google Business to display reviews'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              Cancel Subscription
            </h3>
            <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              Are you sure you want to cancel your subscription? You will lose access to all features and your page will be removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                No, Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}
    </SubscriptionGuard>
  );
}
