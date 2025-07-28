"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TechnicianPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { userId } = useAuth();
  
  // Profile data state
  const [businessName, setBusinessName] = useState("Loading...");
  const [location, setLocation] = useState("Loading...");
  const [description, setDescription] = useState("Loading...");
  const [email, setEmail] = useState("");
  const [calendlyLink, setCalendlyLink] = useState('');
  const [googleBusinessUrl, setGoogleBusinessUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load technician data by URL slug
  useEffect(() => {
    async function loadTechnicianBySlug() {
      if (!slug) {
        console.log('No slug provided');
        setError("Invalid technician URL");
        setLoading(false);
        return;
      }

      console.log('Loading technician with slug:', slug);

      // Skip certain paths that shouldn't be treated as technician slugs
      const excludedPaths = ['test-env', 'test-simple', 'test-supabase', 'debug', 'api'];
      if (excludedPaths.includes(slug)) {
        console.log('Slug is in excluded paths');
        setError("Invalid technician URL");
        setLoading(false);
        return;
      }

      try {
        console.log('Querying Supabase for slug:', slug);
        
        let data, error;
        
        if (slug === 'preview' && userId) {
          console.log('Loading preview data for current user:', userId);
          const result = await supabase
            .from('technician_profiles')
            .select('*')
            .eq('user_profile_id', userId)
            .single();
          data = result.data;
          error = result.error;
        } else if (slug === 'preview' && !userId) {
          data = {
            name: 'Your Business Name',
            location: 'Your City, State',
            bio: 'Tell customers about your business and experience',
            email: 'your-email@example.com',
            calendly_link: '',
            google_business_name: '',
            url_slug: 'preview'
          };
          error = null;
        } else {
          const result = await supabase
            .from('technician_profiles')
            .select('*')
            .eq('url_slug', slug)
            .single();
          
          data = result.data;
          error = result.error;
        }

        console.log('Supabase response:', { data, error });

        if (error) {
          console.error('Error loading technician:', error);
          if (error.code === 'PGRST116') {
            setError("Technician not found - no profile with this URL exists");
          } else {
            setError(`Database error: ${error.message}`);
          }
          setLoading(false);
          return;
        }

        if (data) {
          console.log('Found technician data:', data);
          setBusinessName(data.name || "Your Business Name");
          setLocation(data.location || "Your City, State");
          setDescription(data.bio || "Tell customers about your business and experience");
          setEmail(data.email || "");
          setCalendlyLink(data.calendly_link || '');
          setGoogleBusinessUrl(data.google_business_name || '');
        } else {
          console.log('No data returned from Supabase');
          setError("Technician profile not found");
        }
      } catch (error) {
        console.error('Error loading technician data:', error);
        setError("Failed to load technician profile");
      } finally {
        setLoading(false);
      }
    }

    loadTechnicianBySlug();
  }, [slug, userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header Section */}
        <div className="text-center mb-8">
          {/* Avatar */}
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl font-bold">
              {getInitials(businessName)}
            </span>
          </div>
          
          {/* Business Name */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
            {businessName}
          </h1>
          
          {/* Location */}
          <p className="text-lg text-gray-700 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            {location}
          </p>
          
          {/* Description */}
          <p className="text-gray-600 max-w-2xl mx-auto mb-8" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
            {description}
          </p>
        </div>

        {/* Reviews Section */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              4.9 (127 reviews)
            </span>
          </div>
          
          {/* Individual Reviews */}
          <div className="space-y-4 mb-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Sarah M.
                </span>
                <span className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                  2 days ago
                </span>
              </div>
              <p className="text-gray-700" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                "John did an amazing job on our house windows. Professional, punctual, and the results were incredible!"
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Mike R.
                </span>
                <span className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                  1 week ago
                </span>
              </div>
              <p className="text-gray-700" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                "Best window cleaning service in Austin. Fair pricing and spotless results!"
              </p>
            </div>
          </div>
          
          {/* View All Reviews Button */}
          <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
            View All 127 Reviews
          </button>
        </div>

        {/* Services Section */}
        <div className="space-y-4 mb-8">
          {/* Residential Cleaning */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Residential Cleaning
                  </h3>
                  <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                    Houses, apartments, condos
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-blue-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  $120+
                </span>
              </div>
            </div>
          </div>

          {/* Commercial Cleaning */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Commercial Cleaning
                  </h3>
                  <p className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                    Office buildings, storefronts
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-blue-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  $200+
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            Book Your Window Cleaning
          </h2>
          {calendlyLink ? (
            <a
              href={calendlyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
            >
              Schedule Appointment
            </a>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8">
              <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                Calendly integration not set up yet
              </p>
              <button className="bg-gray-400 text-white py-2 px-4 rounded cursor-not-allowed" disabled>
                Contact via Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 