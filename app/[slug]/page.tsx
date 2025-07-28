"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const defaultServices = [
  {
    name: "Add your first service",
    description: "Describe what you offer to customers",
    price: "$0",
    icon: "🛠️",
  },
];

const socials = [
  { name: "Instagram", href: "", icon: "📸" },
  { name: "Facebook", href: "", icon: "📘" },
  { name: "YouTube", href: "", icon: "📺" },
  { name: "TikTok", href: "", icon: "🎵" },
  { name: "LinkedIn", href: "", icon: "💼" },
  { name: "Twitter", href: "", icon: "🐦" },
];

export default function TechnicianPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  // Profile data state
  const [name, setName] = useState("Loading...");
  const [location, setLocation] = useState("Loading...");
  const [bio, setBio] = useState("Loading...");
  const [services, setServices] = useState(defaultServices);
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
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
      const excludedPaths = ['test-env', 'test-simple', 'test-supabase'];
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
          setName(data.name || "Your Name");
          setLocation(data.location || "Your City, State");
          setBio(data.bio || "Tell customers about your business and experience");
          setServices(data.services || defaultServices);
          setEmail(data.email || "");
          setAvatar(data.avatar || "");
          setSocialLinks(data.social_links || socials);
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
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Technician Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">The technician you're looking for doesn't exist or has moved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <section className="w-full max-w-xl mx-auto py-12 px-4">
        <div className="text-center">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-24 h-24 rounded-full mx-auto mb-6 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-6 shadow-lg flex items-center justify-center">
              <span className="text-white text-3xl font-bold">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{name}</h1>
          <p className="text-xl text-gray-600 mb-4">{location}</p>
          <p className="text-gray-700 leading-relaxed mb-8">{bio}</p>
        </div>
      </section>

      {/* Social Proof - Reviews First */}
      <section className="w-full max-w-xl mx-auto py-6 px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
        <div className="space-y-4">
          {/* Google Reviews Integration */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-4 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="font-semibold text-gray-900 mb-1">Google Reviews</h3>
            <p className="text-sm text-gray-600">
              Customer feedback from Google Places and Google My Business.
            </p>
            <a 
              href={`https://www.google.com/search?q=place:${location.replace(/[^a-zA-Z0-9]/g, '+')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              View Google Reviews
            </a>
          </div>
        </div>
      </section>

      {/* Professional Services */}
      <section className="w-full max-w-xl mx-auto py-6 px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Services</h2>
        <div className="space-y-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-6 hover:shadow-2xl transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedService(service)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-2xl">{service.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{service.name}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{service.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Calendly Booking Section */}
      {calendlyLink && (
        <section className="w-full max-w-xl mx-auto py-6 px-4">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Book Your Appointment</h2>
              <p className="text-gray-600">Schedule your service with {name} today</p>
            </div>
            
            <div className="calendly-inline-widget" data-url={calendlyLink} style={{ minWidth: '320px', height: '700px' }}></div>
            <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
          </div>
        </section>
      )}

      {/* Payment Information */}
      {paymentProcessor && paymentLink && (
        <section className="w-full max-w-xl mx-auto py-6 px-4">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
            <p className="text-gray-600 mb-4">
              {name} accepts payments through {paymentProcessor}
            </p>
            <a
              href={paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors font-semibold"
            >
              Pay with {paymentProcessor}
            </a>
          </div>
        </section>
      )}

      {/* Contact Information */}
      {email && email !== "your@email.com" && (
        <section className="w-full max-w-xl mx-auto py-6 px-4">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-2xl">📧</span>
              <span className="font-medium text-gray-900">{email}</span>
            </div>
            <p className="text-sm text-gray-600">
              Feel free to reach out with any questions about our services
            </p>
          </div>
        </section>
      )}

      {/* Social Media Links - Only show if there are social links */}
      {socialLinks.some(social => social.href && social.href.trim() !== '') && (
        <section className="w-full max-w-xl mx-auto py-6 px-4">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Connect with {name}</h2>
            <div className="flex justify-center gap-4 flex-wrap">
              {socialLinks
                .filter(social => social.href && social.href.trim() !== '')
                .map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all duration-200 hover:scale-110"
                    title={`Follow on ${social.name}`}
                  >
                    <span className="text-xl">{social.icon}</span>
                  </a>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="w-full max-w-xl mx-auto py-8 px-4 text-center">
        <p className="text-gray-500 text-sm">
          Powered by Service Homie
        </p>
      </footer>
    </div>
  );
} 