'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  emoji: string;
}

interface TechnicianProfile {
  id: string;
  user_profile_id: string;
  name: string;
  location: string;
  bio: string;
  email: string;
  avatar: string;
  services: Service[];
  reviews: any[];
  created_at: string;
  updated_at: string;
  calendly_link: string;
  subscription_status: string;
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

export default function EditTechnicianPage() {
  const { userId } = useAuth();
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [calendlyLink, setCalendlyLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      title: 'Residential Cleaning',
      description: 'Houses, apartments, condos',
      price: '$120+',
      emoji: '🏠'
    },
    {
      id: '2',
      title: 'Commercial Cleaning',
      description: 'Office buildings, storefronts',
      price: '$200+',
      emoji: '🏢'
    }
  ]);

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
        .eq('user_profile_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setProfile(data);
        setBusinessName(data.name || '');
        setLocation(data.location || '');
        setDescription(data.bio || '');
        setEmail(data.email || '');
        setCalendlyLink(data.calendly_link || '');
        setInstagramLink(data.social_links?.find((link: any) => link.platform === 'instagram')?.url || '');
        
        // Load services from database or use defaults
        if (data.services && data.services.length > 0) {
          setServices(data.services);
        }
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    
    setSaving(true);
    setSuccess(false);
    
    try {
      // Prepare social links array
      const socialLinks: Array<{platform: string, url: string}> = [];
      if (instagramLink) {
        socialLinks.push({
          platform: 'instagram',
          url: instagramLink
        });
      }

      const { error } = await supabase
        .from('technician_profiles')
        .update({
          name: businessName,
          location: location,
          bio: description,
          email: email,
          calendly_link: calendlyLink,
          social_links: socialLinks,
          services: services,
          updated_at: new Date().toISOString()
        })
        .eq('user_profile_id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        alert('Error saving changes. Please try again.');
      } else {
        setSuccess(true);
        // Update local profile state
        setProfile(prev => prev ? {
          ...prev,
          name: businessName,
          location: location,
          bio: description,
          email: email,
          calendly_link: calendlyLink,
          social_links: socialLinks,
          services: services
        } : null);
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error saving changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateService = (id: string, field: keyof Service, value: string) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ));
  };

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      title: 'New Service',
      description: 'Service description',
      price: '$0+',
      emoji: '🔧'
    };
    setServices(prev => [...prev, newService]);
  };

  const removeService = (id: string) => {
    if (services.length > 1) {
      setServices(prev => prev.filter(service => service.id !== id));
    }
  };

  const emojiOptions = ['🏠', '🏢', '🔧', '🧹', '🚿', '🌱', '🛠️', '⚡', '🔌', '🚰', '🔥', '❄️'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">Please complete your profile setup first.</p>
          <Link
            href="/technician-dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header with Save Button */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                Edit Your Landing Page
              </h1>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                Make changes below and click Save to update your page
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href={profile.url_slug ? `/${profile.url_slug}` : '/technician-page'}
                target="_blank"
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium text-center"
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
        <div className="bg-green-50 border border-green-200 px-4 py-3 mb-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                Changes saved successfully! Your landing page has been updated.
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto p-8">
        {/* Hero Section - Compact with Editable Fields */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 shadow-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {getInitials(businessName || 'Your Business')}
            </span>
          </div>
          
          {/* Editable Business Name */}
          <div className="mb-2">
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your Business Name"
              className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none text-center w-full transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}
            />
          </div>
          
          {/* Editable Location */}
          <div className="mb-3">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Your City, State"
              className="text-lg text-gray-600 bg-transparent border-b-2 border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none text-center w-full transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            />
          </div>
          
          {/* Editable Description */}
          <div className="mb-3">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell customers about your business and experience"
              rows={3}
              className="text-gray-700 text-sm leading-relaxed bg-transparent border-2 border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none text-center w-full resize-none transition-colors rounded-lg p-2"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            />
          </div>
        </div>

        {/* Reviews Section - Read Only */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-blue-100 p-4 mb-6">
          <div className="flex items-center justify-center gap-1 mb-3">
            <span className="text-yellow-400 text-lg">★★★★★</span>
            <span className="text-gray-600 text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              4.9
            </span>
            <span className="text-gray-500 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              (127 reviews)
            </span>
          </div>
          
          {/* Sample Reviews */}
          <div className="space-y-3 mb-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-400 text-sm">★★★★★</span>
                <span className="text-gray-700 text-xs font-semibold" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Sarah M.
                </span>
                <span className="text-gray-500 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  2 days ago
                </span>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                "John did an amazing job on our house windows. Professional, punctual, and the results were incredible!"
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-400 text-sm">★★★★★</span>
                <span className="text-gray-700 text-xs font-semibold" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Mike R.
                </span>
                <span className="text-gray-500 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  1 week ago
                </span>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                "Best window cleaning service in Austin. Fair pricing and spotless results!"
              </p>
            </div>
          </div>
          
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors text-xs font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
            View All 127 Reviews
          </button>
        </div>

        {/* Services Section - Editable */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              Services
            </h3>
            <button
              onClick={addService}
              className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
            >
              + Add Service
            </button>
          </div>
          
          {services.map((service, index) => (
            <div key={service.id} className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-blue-100 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  {/* Emoji Selector */}
                  <select
                    value={service.emoji}
                    onChange={(e) => updateService(service.id, 'emoji', e.target.value)}
                    className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-lg cursor-pointer border-0 focus:ring-2 focus:ring-blue-500"
                  >
                    {emojiOptions.map(emoji => (
                      <option key={emoji} value={emoji} className="bg-white text-gray-900">
                        {emoji}
                      </option>
                    ))}
                  </select>
                  
                  <div className="flex-1">
                    {/* Service Title */}
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => updateService(service.id, 'title', e.target.value)}
                      placeholder="Service Title"
                      className="font-bold text-gray-900 text-sm bg-transparent border-b border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none w-full transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
                    />
                    
                    {/* Service Description */}
                    <input
                      type="text"
                      value={service.description}
                      onChange={(e) => updateService(service.id, 'description', e.target.value)}
                      placeholder="Service description"
                      className="text-gray-600 text-xs bg-transparent border-b border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none w-full transition-colors mt-1"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Price */}
                  <input
                    type="text"
                    value={service.price}
                    onChange={(e) => updateService(service.id, 'price', e.target.value)}
                    placeholder="$0+"
                    className="text-lg font-bold text-blue-600 bg-transparent border-b border-transparent hover:border-blue-300 focus:border-blue-500 focus:outline-none text-right w-20 transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}
                  />
                  
                  {/* Remove Button */}
                  {services.length > 1 && (
                    <button
                      onClick={() => removeService(service.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Section - Editable Calendly Link */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-blue-100 p-4 text-center">
          <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            Book Your Service
          </h3>
          <p className="text-gray-600 text-xs mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            Schedule your service today
          </p>
          
          {/* Editable Calendly Link */}
          <div className="mb-3">
            <input
              type="url"
              value={calendlyLink}
              onChange={(e) => setCalendlyLink(e.target.value)}
              placeholder="https://calendly.com/your-link"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            />
            <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
              Enter your Calendly link to enable booking
            </p>
          </div>
          
          {/* Editable Instagram Link */}
          <div className="mb-3">
            <input
              type="url"
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
              placeholder="https://instagram.com/your-username"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            />
            <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
              Enter your Instagram profile link
            </p>
          </div>
          
          {/* Mock Calendly Calendar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
            <div className="text-center mb-4">
              <h4 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                Select a Date & Time
              </h4>
              <p className="text-gray-500 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                Available times for {businessName || 'Your Business'}
              </p>
            </div>
            
            {/* Mock Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {/* Calendar Header */}
              <div className="text-center text-xs font-semibold text-gray-500 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>S</div>
              <div className="text-center text-xs font-semibold text-gray-500 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>M</div>
              <div className="text-center text-xs font-semibold text-gray-500 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>T</div>
              <div className="text-center text-xs font-semibold text-gray-500 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>W</div>
              <div className="text-center text-xs font-semibold text-gray-500 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>T</div>
              <div className="text-center text-xs font-semibold text-gray-500 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>F</div>
              <div className="text-center text-xs font-semibold text-gray-500 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>S</div>
              
              {/* Calendar Days */}
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>28</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>29</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>30</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>1</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>2</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>3</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>4</div>
              
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>5</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>6</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>7</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>8</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>9</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>10</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>11</div>
              
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>12</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>13</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>14</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>15</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>16</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>17</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>18</div>
              
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>19</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>20</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>21</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>22</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>23</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>24</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>25</div>
              
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>26</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>27</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>28</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>29</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>30</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>31</div>
              <div className="text-center text-xs text-gray-400 p-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>1</div>
            </div>
            
            {/* Mock Time Slots */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                Available Times
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-blue-50 border border-blue-200 rounded px-3 py-2 text-xs text-blue-700 hover:bg-blue-100 transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  9:00 AM
                </button>
                <button className="bg-blue-50 border border-blue-200 rounded px-3 py-2 text-xs text-blue-700 hover:bg-blue-100 transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  10:30 AM
                </button>
                <button className="bg-blue-50 border border-blue-200 rounded px-3 py-2 text-xs text-blue-700 hover:bg-blue-100 transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  1:00 PM
                </button>
                <button className="bg-blue-50 border border-blue-200 rounded px-3 py-2 text-xs text-blue-700 hover:bg-blue-100 transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  2:30 PM
                </button>
              </div>
            </div>
          </div>
          
          {calendlyLink ? (
            <a
              href={calendlyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-semibold text-sm inline-block" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
            >
              Book Now
            </a>
          ) : (
            <button className="bg-gray-400 text-white px-6 py-2 rounded-full cursor-not-allowed font-semibold text-sm" disabled style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 