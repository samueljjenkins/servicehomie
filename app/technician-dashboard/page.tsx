'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import SubscriptionGuard from '@/components/SubscriptionGuard';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface TechnicianProfile {
  id: string;
  user_id: string;
  business_name: string;
  service_type: string;
  description: string;
  hourly_rate: number;
  availability: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  social_media: string;
  certifications: string;
  insurance: boolean;
  background_check: boolean;
  profile_image: string;
  gallery_images: string[];
  rating: number;
  review_count: number;
  completed_jobs: number;
  response_time: string;
  subscription_status: string;
  stripe_subscription_id: string;
  subscription_start_date: string;
  subscription_end_date: string;
  calendly_link: string;
  google_business_url: string;
  url_slug: string;
  services: any[];
}

export default function TechnicianDashboard() {
  const { userId } = useAuth();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [technicianProfile, setTechnicianProfile] = useState<TechnicianProfile | null>(null);
  const [calendlyLink, setCalendlyLink] = useState('');
  const [googleBusinessUrl, setGoogleBusinessUrl] = useState('');
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customDomain, setCustomDomain] = useState('');

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
    { id: 'payments', label: 'Payments', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ) },
    { id: 'reviews', label: 'Reviews', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ) }
  ];

  useEffect(() => {
    if (userId) {
      fetchTechnicianProfile();
    }
  }, [userId]);

  const fetchTechnicianProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('technician_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      setTechnicianProfile(data);
      setCalendlyLink(data.calendly_link || '');
      setGoogleBusinessUrl(data.google_business_url || '');
      setServices(data.services || []);
      // Initialize customDomain with current url_slug
      setCustomDomain(data.url_slug || '');
    } catch (error) {
      console.error('Error fetching technician profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalendlySave = async () => {
    if (!userId) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('technician_profiles')
        .update({ calendly_link: calendlyLink })
        .eq('user_id', userId);

      if (error) throw error;
      alert('Calendly link saved successfully!');
    } catch (error) {
      console.error('Error saving Calendly link:', error);
      alert('Error saving Calendly link');
    } finally {
      setSaving(false);
    }
  };

  const handleGoogleReviewsConnect = async () => {
    if (!userId) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('technician_profiles')
        .update({ google_business_url: googleBusinessUrl })
        .eq('user_id', userId);

      if (error) throw error;
      alert('Google Business URL saved successfully!');
    } catch (error) {
      console.error('Error saving Google Business URL:', error);
      alert('Error saving Google Business URL');
    } finally {
      setSaving(false);
    }
  };

  const handleCustomDomain = async () => {
    if (!customDomain.trim()) {
      alert('Please enter a custom URL');
      return;
    }

    // Validate URL format
    const formattedSlug = customDomain.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    
    if (formattedSlug.length < 3) {
      alert('URL must be at least 3 characters long');
      return;
    }

    if (formattedSlug.length > 50) {
      alert('URL must be less than 50 characters long');
      return;
    }

    if (!userId) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('technician_profiles')
        .update({ url_slug: formattedSlug })
        .eq('user_id', userId);

      if (error) throw error;
      
      // Update local state
      setTechnicianProfile(prev => prev ? { ...prev, url_slug: formattedSlug } : null);
      setCustomDomain(formattedSlug);
      alert('Custom URL updated successfully! Your page is now available at: servicehomie.com/' + formattedSlug);
    } catch (error) {
      console.error('Error updating custom URL:', error);
      alert('Error updating custom URL. Please try again.');
    } finally {
      setSaving(false);
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

  return (
    <SubscriptionGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                  Technician Dashboard
                </h1>
                <p className="text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  Manage your business profile and bookings
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/${technicianProfile?.url_slug || 'your-name'}`}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="border-b border-gray-100">
              <nav className="flex flex-wrap">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6 sm:p-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Total Bookings
                          </p>
                          <p className="text-3xl font-bold" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                            24
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Average Rating
                          </p>
                          <p className="text-3xl font-bold" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                            4.8
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Total Revenue
                          </p>
                          <p className="text-3xl font-bold" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                            $2,450
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            This Month
                          </p>
                          <p className="text-3xl font-bold" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                            8
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom Domain Section */}
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        Custom URL
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Your Custom URL
                          </label>
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">servicehomie.com/</span>
                            <input
                              type="text"
                              value={customDomain}
                              onChange={(e) => setCustomDomain(e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="your-business-name"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleCustomDomain}
                          disabled={saving}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                        >
                          {saving ? 'Saving...' : 'Save URL'}
                        </button>
                      </div>
                      {technicianProfile?.url_slug && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Your current URL:
                          </p>
                          <p className="font-mono text-blue-900 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            servicehomie.com/{technicianProfile.url_slug}
                          </p>
                          <div className="mt-3">
                            <Link
                              href={`/${technicianProfile.url_slug}`}
                              target="_blank"
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
                      <p className="text-sm text-gray-600 mt-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        This will be your public landing page URL. Choose something memorable and professional.
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        Manage Bookings
                      </h3>
                      <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        View and manage your upcoming appointments
                      </p>
                      <button className="text-blue-600 hover:text-blue-700 font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        View Bookings →
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        View Reviews
                      </h3>
                      <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        See what your customers are saying about you
                      </p>
                      <button className="text-green-600 hover:text-green-700 font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        View Reviews →
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow duration-300">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        Payment History
                      </h3>
                      <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        Track your earnings and payment history
                      </p>
                      <button className="text-purple-600 hover:text-purple-700 font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        View Payments →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="mb-6 lg:mb-0">
                        <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                          Starter Plan
                        </h3>
                        <p className="text-blue-100 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          Your subscription is active and you have access to all features.
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            Active Subscription
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                          $19
                        </div>
                        <div className="text-blue-100" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          per month
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        Plan Features
                      </h4>
                      <div className="space-y-3">
                        {[
                          'Professional landing page',
                          'Calendly booking integration',
                          'Google Reviews integration',
                          'Custom URL (servicehomie.com/yourname)',
                          'Mobile responsive design',
                          'Handle your own payments (0% commission)',
                          'Profile photo upload',
                          '24/7 customer support'
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        Billing Information
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Next billing date
                          </p>
                          <p className="text-gray-900 font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            January 15, 2025
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            Payment method
                          </p>
                          <p className="text-gray-900 font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            •••• •••• •••• 4242
                          </p>
                        </div>
                        <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          Manage Billing
                        </button>
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
                      Recent Bookings
                    </h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      View All Bookings
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              Service
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              Date & Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {[
                            { customer: 'Sarah Johnson', service: 'Window Cleaning', date: 'Jan 15, 2025', time: '9:00 AM', status: 'Confirmed', amount: '$120' },
                            { customer: 'Mike Rodriguez', service: 'Gutter Cleaning', date: 'Jan 16, 2025', time: '2:00 PM', status: 'Pending', amount: '$180' },
                            { customer: 'Emily Chen', service: 'Pressure Washing', date: 'Jan 17, 2025', time: '10:30 AM', status: 'Confirmed', amount: '$250' }
                          ].map((booking, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                  {booking.customer}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                                  {booking.service}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                                  {booking.date}
                                </div>
                                <div className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                                  {booking.time}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  booking.status === 'Confirmed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                  {booking.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                {booking.amount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                          $2,450
                        </div>
                        <div className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          Total Earnings
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                          $580
                        </div>
                        <div className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          This Month
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                          24
                        </div>
                        <div className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          Completed Jobs
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        Recent Transactions
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              Service
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {[
                            { date: 'Jan 10, 2025', customer: 'Sarah Johnson', service: 'Window Cleaning', amount: '$120', status: 'Paid' },
                            { date: 'Jan 8, 2025', customer: 'Mike Rodriguez', service: 'Gutter Cleaning', amount: '$180', status: 'Paid' },
                            { date: 'Jan 5, 2025', customer: 'Emily Chen', service: 'Pressure Washing', amount: '$250', status: 'Paid' }
                          ].map((transaction, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                                {transaction.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                  {transaction.customer}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                                  {transaction.service}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                {transaction.amount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                  {transaction.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                          Customer Reviews
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                            4.8
                          </span>
                          <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            (127 reviews)
                          </span>
                        </div>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        View All Reviews
                      </button>
                    </div>

                    <div className="space-y-6">
                      {[
                        {
                          name: 'Sarah Johnson',
                          rating: 5,
                          date: '2 days ago',
                          comment: 'Amazing service! John was professional, punctual, and did an incredible job on our windows. The results were better than expected and the price was very reasonable. Highly recommend!'
                        },
                        {
                          name: 'Mike Rodriguez',
                          rating: 5,
                          date: '1 week ago',
                          comment: 'Best window cleaning service in the area. Fair pricing, excellent work, and very reliable. Will definitely use again and recommend to friends and family.'
                        },
                        {
                          name: 'Emily Chen',
                          rating: 4,
                          date: '2 weeks ago',
                          comment: 'Great service overall. The windows look fantastic and the team was very professional. Only giving 4 stars because they were a bit late, but the quality of work made up for it.'
                        }
                      ].map((review, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                                  {review.date}
                                </span>
                              </div>
                              <h4 className="font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                                {review.name}
                              </h4>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SubscriptionGuard>
  );
}
