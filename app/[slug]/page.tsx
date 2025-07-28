"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const defaultServices = [
  {
    name: "Add your first service",
    description: "Describe what you offer to customers",
    price: "$0",
  },
];

const socials = [
  { name: "Instagram", href: "", icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  ) },
  { name: "Facebook", href: "", icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M18 2h-3a4 4 0 0 0-4 4v3H7v4h4v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z" />
    </svg>
  ) },
  { name: "YouTube", href: "", icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" />
    </svg>
  ) },
  { name: "TikTok", href: "", icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 17a4 4 0 1 1 0-8h1V7h2v2h2v2h-2v6a2 2 0 1 1-2-2" />
    </svg>
  ) },
  { name: "LinkedIn", href: "", icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ) },
  { name: "Twitter", href: "", icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  ) },
];

export default function TechnicianPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  // Profile data state
  const [businessName, setBusinessName] = useState("Loading...");
  const [location, setLocation] = useState("Loading...");
  const [description, setDescription] = useState("Loading...");
  const [services, setServices] = useState(defaultServices);
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [socialLinks, setSocialLinks] = useState(socials);
  const [calendlyLink, setCalendlyLink] = useState('');
  const [paymentProcessor, setPaymentProcessor] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [selectedService, setSelectedService] = useState<{ name: string; description: string; price: string; icon: string } | null>(null);
  const [googleBusinessName, setGoogleBusinessName] = useState('');
  const [googlePlaceId, setGooglePlaceId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load technician data by URL slug
  useEffect(() => {
    async function loadTechnicianBySlug() {
      if (!slug) {
        setError("Invalid technician URL");
        setLoading(false);
        return;
      }

      // Skip certain paths that shouldn't be treated as technician slugs
      const excludedPaths = ['test-env', 'test-simple', 'test-supabase', 'debug', 'api'];
      if (excludedPaths.includes(slug)) {
        setError("Invalid technician URL");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('technician_profiles')
          .select('*')
          .eq('url_slug', slug)
          .single();

        if (error) {
          console.error('Error loading technician:', error);
          setError("Technician not found");
          setLoading(false);
          return;
        }

        if (data) {
          setBusinessName(data.business_name || "Your Business Name");
          setLocation(data.location || "Your City, State");
          setDescription(data.description || "Tell customers about your business and experience");
          setServices(data.services || defaultServices);
          setEmail(data.email || "");
          setProfileImage(data.profile_image || "");
          setSocialLinks(data.social_media ? JSON.parse(data.social_media) : socials);
          setCalendlyLink(data.calendly_link || '');
          setPaymentProcessor(data.payment_processor || '');
          setPaymentLink(data.payment_link || '');
          setGoogleBusinessName(data.google_business_name || '');
          setGooglePlaceId(data.google_place_id || '');
        }
      } catch (error) {
        console.error('Error loading technician data:', error);
        setError("Failed to load technician profile");
      } finally {
        setLoading(false);
      }
    }

    loadTechnicianBySlug();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading technician profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Technician Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">The technician you're looking for doesn't exist or has moved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {businessName}
              </h1>
              <p className="text-gray-600 mt-1">
                {location}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {calendlyLink && (
                <a
                  href={calendlyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
                >
                  Book Now
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="p-8 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {businessName}
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Professional Service Provider
            </p>
            <p className="text-gray-700 max-w-2xl mx-auto mb-8">
              {description}
            </p>
            
            {calendlyLink && (
              <a
                href={calendlyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
              >
                Book Now
              </a>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              50+
            </div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              4.8
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              100+
            </div>
            <div className="text-gray-600">Jobs Completed</div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="px-8 py-6 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900">Services</h3>
          </div>
          <div className="p-8">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Professional Service
                  </h4>
                  <p className="text-gray-600 mb-2">
                    {description}
                  </p>
                  <p className="text-blue-600 font-semibold">
                    Starting at $50/hour
                  </p>
                </div>
                {calendlyLink && (
                  <a
                    href={calendlyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Book Service
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="px-8 py-6 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900">About</h3>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h4>
                <div className="space-y-3">
                  {location && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700">{location}</span>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">{email}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Us</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Professional & Reliable</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Quality Guaranteed</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Satisfaction Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900">Get In Touch</h3>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {calendlyLink && (
                <a
                  href={calendlyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center font-medium"
                >
                  Schedule a Service
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="bg-gray-100 text-gray-700 px-6 py-4 rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-sm hover:shadow-md text-center font-medium"
                >
                  Send Email
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 