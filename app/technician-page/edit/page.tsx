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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Edit Your Profile
                </h1>
                <p className="text-gray-600 mt-1">
                  Update your business information and services
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/technician-dashboard"
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
                >
                  Back to Dashboard
                </Link>
                <Link
                  href={`/${profile?.url_slug || 'your-name'}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
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

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Business Information</h2>
            </div>
            
            <div className="p-4 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your Business Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type *
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a service type</option>
                      <option value="Window Cleaning">Window Cleaning</option>
                      <option value="Gutter Cleaning">Gutter Cleaning</option>
                      <option value="Pressure Washing">Pressure Washing</option>
                      <option value="Lawn Care">Lawn Care</option>
                      <option value="Handyman">Handyman</option>
                      <option value="Junk Removal">Junk Removal</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your services and what makes you unique..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <input
                      type="text"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Mon-Fri 8AM-6PM, Weekends available"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, State"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Social Media
                    </label>
                    <input
                      type="text"
                      value={socialMedia}
                      onChange={(e) => setSocialMedia(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Instagram, Facebook, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certifications
                    </label>
                    <textarea
                      value={certifications}
                      onChange={(e) => setCertifications(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="List your certifications, licenses, and qualifications..."
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="insurance"
                        checked={insurance}
                        onChange={(e) => setInsurance(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="insurance" className="ml-2 block text-sm text-gray-700">
                        I have liability insurance
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="backgroundCheck"
                        checked={backgroundCheck}
                        onChange={(e) => setBackgroundCheck(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="backgroundCheck" className="ml-2 block text-sm text-gray-700">
                        I have passed a background check
                      </label>
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
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <Link
                  href="/technician-dashboard"
                  className="w-full sm:w-auto bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-sm hover:shadow-md text-center font-medium"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SubscriptionGuard>
  );
} 