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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'subscription', label: 'Subscription', icon: '💳' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'payments', label: 'Payments', icon: '💰' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' }
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

      if (data) {
        setTechnicianProfile(data);
        setCalendlyLink(data.calendly_link || '');
        setGoogleBusinessUrl(data.google_business_url || '');
        setServices(data.services || []);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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

  const handleCustomDomain = () => {
    alert('Custom domain setup coming soon!');
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Technician Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Welcome back, {user?.firstName || 'Technician'}! 👋
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/technician-profile"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
                >
                  View Profile
                </Link>
                <Link
                  href="/settings"
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md text-center"
                >
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Landing Page Management */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Landing Page Management</h3>
                </div>
                <div className="p-4 sm:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Current Landing Page */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">Current Landing Page</h4>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                        <p className="text-sm text-gray-600 mb-2">Your landing page URL:</p>
                        <p className="font-mono text-blue-600 text-base sm:text-lg break-all">
                          servicehomie.com/{technicianProfile?.url_slug || 'your-name'}
                        </p>
                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                          <Link
                            href="/technician-page"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
                          >
                            View Page
                          </Link>
                          <Link
                            href="/technician-page/edit"
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
                          >
                            Edit Page
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* Custom Domain */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900">Custom Domain</h4>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-100">
                        <p className="text-sm text-gray-600 mb-2">Want your own domain?</p>
                        <p className="text-sm text-gray-500 mb-4">Connect your own domain like: yourbusiness.com</p>
                        <button
                          onClick={handleCustomDomain}
                          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          Set Up Custom Domain
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-lg">📊</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">{technicianProfile?.completed_jobs || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-lg">⭐</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Average Rating</p>
                      <p className="text-2xl font-bold text-gray-900">{technicianProfile?.rating || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 text-lg">💬</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Reviews</p>
                      <p className="text-2xl font-bold text-gray-900">{technicianProfile?.review_count || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 text-lg">⚡</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Response Time</p>
                      <p className="text-2xl font-bold text-gray-900">{technicianProfile?.response_time || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Subscription Management</h3>
              </div>
              <div className="p-4 sm:p-8">
                <div className="space-y-6">
                  {/* Current Plan */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Starter Plan</h4>
                        <p className="text-gray-600 mb-2">$19/month</p>
                        <p className="text-sm text-gray-500">
                          Status: <span className="text-green-600 font-medium">Active</span>
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md">
                          Manage Subscription
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Plan Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center mb-3">
                        <span className="text-green-500 text-lg mr-2">✓</span>
                        <h5 className="font-medium text-gray-900">Custom Landing Page</h5>
                      </div>
                      <p className="text-sm text-gray-600">Professional page with your branding</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center mb-3">
                        <span className="text-green-500 text-lg mr-2">✓</span>
                        <h5 className="font-medium text-gray-900">Calendly Integration</h5>
                      </div>
                      <p className="text-sm text-gray-600">Seamless booking system</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center mb-3">
                        <span className="text-green-500 text-lg mr-2">✓</span>
                        <h5 className="font-medium text-gray-900">Google Reviews</h5>
                      </div>
                      <p className="text-sm text-gray-600">Display your reviews automatically</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center mb-3">
                        <span className="text-green-500 text-lg mr-2">✓</span>
                        <h5 className="font-medium text-gray-900">Analytics Dashboard</h5>
                      </div>
                      <p className="text-sm text-gray-600">Track your performance</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center mb-3">
                        <span className="text-green-500 text-lg mr-2">✓</span>
                        <h5 className="font-medium text-gray-900">24/7 Support</h5>
                      </div>
                      <p className="text-sm text-gray-600">Get help whenever you need it</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center mb-3">
                        <span className="text-green-500 text-lg mr-2">✓</span>
                        <h5 className="font-medium text-gray-900">Mobile Optimized</h5>
                      </div>
                      <p className="text-sm text-gray-600">Works perfectly on all devices</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Booking Management</h3>
              </div>
              <div className="p-4 sm:p-8">
                <div className="space-y-6">
                  {/* Calendly Integration */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Calendly Integration</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 text-sm">1</span>
                        </div>
                        <p className="text-gray-700">Go to <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">calendly.com</a> and create your account</p>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 text-sm">2</span>
                        </div>
                        <p className="text-gray-700">Set up your availability and services</p>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 text-sm">3</span>
                        </div>
                        <p className="text-gray-700">Copy your Calendly link and paste it below</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Calendly Link
                        </label>
                        <input
                          type="url"
                          value={calendlyLink}
                          onChange={(e) => setCalendlyLink(e.target.value)}
                          placeholder="https://calendly.com/your-name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <button
                        onClick={handleCalendlySave}
                        disabled={saving}
                        className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Saving...' : 'Save Calendly Link'}
                      </button>
                    </div>
                  </div>

                  {/* Connection Status */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Connection Status</h4>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${calendlyLink ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-700">
                        {calendlyLink ? 'Calendly Connected' : 'Calendly Not Connected'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Integration</h3>
              </div>
              <div className="p-4 sm:p-8">
                <div className="space-y-6">
                  {/* Stripe Integration */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Stripe Integration</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-purple-600 text-sm">1</span>
                        </div>
                        <p className="text-gray-700">Create a <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stripe account</a></p>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-purple-600 text-sm">2</span>
                        </div>
                        <p className="text-gray-700">Connect Stripe to your Calendly account</p>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-purple-600 text-sm">3</span>
                        </div>
                        <p className="text-gray-700">Start accepting payments directly through bookings</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        Connect Stripe
                      </button>
                    </div>
                  </div>

                  {/* Payment Settings */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Auto-capture payments</span>
                        <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Send payment receipts</span>
                        <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                          <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Review Management</h3>
              </div>
              <div className="p-4 sm:p-8">
                <div className="space-y-6">
                  {/* Google Reviews Integration */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Google Reviews Integration</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-yellow-600 text-sm">1</span>
                        </div>
                        <p className="text-gray-700">Go to <a href="https://business.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Business</a></p>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-yellow-600 text-sm">2</span>
                        </div>
                        <p className="text-gray-700">Find your business listing</p>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-yellow-600 text-sm">3</span>
                        </div>
                        <p className="text-gray-700">Copy your business URL or ID</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Google Business URL or ID
                        </label>
                        <input
                          type="text"
                          value={googleBusinessUrl}
                          onChange={(e) => setGoogleBusinessUrl(e.target.value)}
                          placeholder="https://business.google.com/your-business or your-business-id"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <button
                        onClick={handleGoogleReviewsConnect}
                        disabled={saving}
                        className="w-full sm:w-auto bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Saving...' : 'Connect Google Reviews'}
                      </button>
                    </div>
                  </div>

                  {/* Connection Status */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Connection Status</h4>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${googleBusinessUrl ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-700">
                        {googleBusinessUrl ? 'Google Reviews Connected' : 'Google Reviews Not Connected'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SubscriptionGuard>
  );
}
