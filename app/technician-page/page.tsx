"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export default function TechnicianPage() {
  const { userId } = useAuth();
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!userId) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('technician_profiles')
          .select('*')
          .eq('user_profile_id', userId)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setError('Failed to load profile');
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

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

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">{error || 'Profile not found'}</p>
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
      <div className="max-w-md mx-auto p-8">
        {/* Hero Section - Compact */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 shadow-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {getInitials(profile.name || 'Your Business')}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
            {profile.name || 'Your Business'}
          </h1>
          <p className="text-lg text-gray-600 mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            {profile.location || 'Your City, State'}
          </p>
          <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            {profile.bio || 'Professional service provider committed to quality and customer satisfaction.'}
          </p>
        </div>

        {/* Reviews - Compact with Real Mock Data */}
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

        {/* Services - Compact */}
        <div className="space-y-3 mb-6">
          <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-blue-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🏠</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    Residential Cleaning
                  </h3>
                  <p className="text-gray-600 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                    Houses, apartments, condos
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                  $120+
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-blue-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🏢</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    Commercial Cleaning
                  </h3>
                  <p className="text-gray-600 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                    Office buildings, storefronts
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                  $200+
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking CTA - Compact with Real Calendly */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-blue-100 p-4 text-center">
          <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            Book Your Window Cleaning
          </h3>
          <p className="text-gray-600 text-xs mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            Schedule your service today
          </p>
          
          {/* Mock Calendly Calendar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
            <div className="text-center mb-4">
              <h4 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                Select a Date & Time
              </h4>
              <p className="text-gray-500 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                Available times for {profile.name || 'Your Business'}
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
          
          {profile.calendly_link ? (
            <a
              href={profile.calendly_link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-semibold text-sm inline-block" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
            >
              Book Now
            </a>
          ) : (
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-semibold text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 