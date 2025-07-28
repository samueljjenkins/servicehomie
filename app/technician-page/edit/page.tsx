'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
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

export default function EditTechnicianPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [businessName, setBusinessName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [socialMedia, setSocialMedia] = useState('');
  const [certifications, setCertifications] = useState('');
  const [insurance, setInsurance] = useState(false);
  const [backgroundCheck, setBackgroundCheck] = useState(false);
  const [calendlyLink, setCalendlyLink] = useState('');

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('technician_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setBusinessName(data.business_name || '');
        setServiceType(data.service_type || '');
        setDescription(data.description || '');
        setHourlyRate(data.hourly_rate?.toString() || '');
        setAvailability(data.availability || '');
        setLocation(data.location || '');
        setPhone(data.phone || '');
        setEmail(data.email || '');
        setWebsite(data.website || '');
        setSocialMedia(data.social_media || '');
        setCertifications(data.certifications || '');
        setInsurance(data.insurance || false);
        setBackgroundCheck(data.background_check || false);
        setCalendlyLink(data.calendly_link || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('technician_profiles')
        .update({
          business_name: businessName,
          service_type: serviceType,
          description: description,
          hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
          availability: availability,
          location: location,
          phone: phone,
          email: email,
          website: website,
          social_media: socialMedia,
          certifications: certifications,
          insurance: insurance,
          background_check: backgroundCheck,
          calendly_link: calendlyLink,
        })
        .eq('user_id', userId);

      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
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
                  Edit Your Landing Page
                </h1>
                <p className="text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  Customize your public profile
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/technician-dashboard"
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center font-medium"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  Back to Dashboard
                </Link>
                <Link
                  href={`/${profile?.url_slug || 'your-name'}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center font-medium"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  View Page
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-800 font-medium">Profile updated successfully!</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Landing Page Style */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="p-8 text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              {/* Business Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="text-3xl font-bold text-gray-900 text-center bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-4 py-2 w-full max-w-md mx-auto"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}
                  placeholder="Your Business Name"
                />
              </div>

              {/* Service Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  Service Type
                </label>
                <input
                  type="text"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="text-xl text-gray-600 text-center bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-4 py-2 w-full max-w-md mx-auto"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  placeholder="Professional Service Provider"
                />
              </div>

              {/* Description */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="text-gray-700 text-center bg-transparent border-2 border-gray-300 focus:border-blue-500 focus:outline-none rounded-lg px-4 py-2 w-full max-w-2xl mx-auto resize-none"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  placeholder="Tell customers about your business and experience..."
                />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                50+
              </div>
              <div className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                Happy Customers
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                4.8
              </div>
              <div className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                Average Rating
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                100+
              </div>
              <div className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                Jobs Completed
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="px-8 py-6 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                Services
              </h3>
            </div>
            <div className="p-8">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      Service Name
                    </label>
                    <input
                      type="text"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="text-xl font-semibold text-gray-900 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
                      placeholder="Professional Service"
                    />
                    
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      Service Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      className="text-gray-600 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full resize-none"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                      placeholder="Describe your service..."
                    />
                    
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      Hourly Rate
                    </label>
                    <input
                      type="text"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="text-blue-600 font-semibold bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none px-2 py-1 w-full"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                      placeholder="Starting at $50/hour"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="px-8 py-6 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                About
              </h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    Business Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        Location
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="City, State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        Website
                      </label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    Why Choose Us
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        Professional & Reliable
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        Quality Guaranteed
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        Satisfaction Guaranteed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                Get In Touch
              </h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                    Calendly Link
                  </label>
                  <input
                    type="url"
                    value={calendlyLink}
                    onChange={(e) => setCalendlyLink(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://calendly.com/your-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                    Email Contact
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/technician-dashboard"
              className="w-full sm:w-auto bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-sm hover:shadow-md text-center font-medium"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </SubscriptionGuard>
  );
} 