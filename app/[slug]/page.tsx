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
  const [technicianProfile, setTechnicianProfile] = useState<any>(null);

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
          setTechnicianProfile(data);
          setBusinessName(data.name || "Your Business Name");
          setLocation(data.location || "Your City, State");
          setDescription(data.bio || "Tell customers about your business and experience");
          setEmail(data.email || "");
          setCalendlyLink(data.calendly_link || '');
          setGoogleBusinessUrl(data.google_business_name || '');
        }
      } catch (error) {
        console.error('Error loading technician:', error);
        setError("Failed to load technician data");
      } finally {
        setLoading(false);
      }
    }

    loadTechnicianBySlug();
  }, [slug, userId]);

  // Load Calendly script when calendlyLink is available
  useEffect(() => {
    if (calendlyLink) {
      // Check if Calendly script is already loaded
      if (!(window as any).Calendly) {
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        document.head.appendChild(script);
      }
    }
  }, [calendlyLink]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-md mx-auto p-8">
        {/* Hero Section - Compact */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 shadow-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {getInitials(businessName)}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
            {businessName}
          </h1>
          <p className="text-lg text-gray-600 mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            {location}
          </p>
          <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            {description}
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

        {/* Services Section */}
        <div className="space-y-3 mb-6">
          {technicianProfile?.services && technicianProfile.services.length > 0 ? (
            technicianProfile.services.map((service: any) => (
              <div key={service.id} className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-blue-100 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">{service.emoji || '🔧'}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        {service.title || 'Service'}
                      </h3>
                      <p className="text-gray-600 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        {service.description || 'Service description'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                      {service.price || '$0+'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Fallback to default services if none exist
            <>
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
            </>
          )}
        </div>

        {/* Booking CTA - Compact with Real Calendly */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-blue-100 p-4 text-center">
          <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            Book Your Window Cleaning
          </h3>
          <p className="text-gray-600 text-xs mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            Schedule your service today
          </p>
          
          {calendlyLink ? (
            /* Real Calendly Embed */
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
              <div className="text-center mb-4">
                <h4 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Select a Date & Time
                </h4>
                <p className="text-gray-500 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  Available times for {businessName}
                </p>
              </div>
              
              {/* Calendly Inline Widget */}
              <div 
                className="calendly-inline-widget" 
                data-url={calendlyLink}
                style={{ minWidth: '320px', height: '630px' }}
              />
            </div>
          ) : (
            /* Mock Calendly Calendar - Fallback */
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
              <div className="text-center mb-4">
                <h4 className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Select a Date & Time
                </h4>
                <p className="text-gray-500 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  Available times for {businessName}
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
          )}
          
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
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-semibold text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 