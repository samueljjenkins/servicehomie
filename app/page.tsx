import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/backgroundimage.png"
            alt="Business background"
            className="w-full h-full object-cover object-center"
            draggable="false"
          />
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-white/80"></div>
        </div>
        <div className="relative max-w-6xl mx-auto z-10 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#1754D4] rounded-2xl mb-8 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-6xl tracking-tight font-extrabold text-[#1E2937] sm:text-7xl md:text-8xl mb-8 leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900 }}>
            <span className="block mb-4">
              Service <span className="text-[#1754D4]">Homie</span>
            </span>
          </h1>
          <p className="mt-8 max-w-4xl mx-auto text-2xl text-[#1E2937]/90 sm:text-3xl md:mt-10 md:text-4xl leading-relaxed mb-12" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            Professional landing pages for service businesses. Get your custom URL, Calendly booking, and Google Reviews—all for $19/month.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 md:mt-16">
            <a href="https://whop.com/apps/app_g0qSlT2gr0HBpX/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-10 py-5 border border-transparent text-xl font-bold text-white bg-[#1754D4] hover:bg-[#1754D4]/90 md:py-6 md:text-2xl md:px-16 rounded-3xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              <svg className="w-7 h-7 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Your $19/month Plan
            </a>
            <Link href="#features" className="inline-flex items-center justify-center px-10 py-5 border-2 border-[#1754D4]/30 text-xl font-bold text-[#1754D4] bg-white/90 backdrop-blur-sm hover:bg-[#1754D4]/5 md:py-6 md:text-2xl md:px-16 rounded-3xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              <svg className="w-7 h-7 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-extrabold text-[#1E2937] sm:text-6xl mb-8 leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
              See Your Landing Page in Action
            </h2>
            <p className="text-2xl text-[#1E2937]/70 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              This is exactly what your customers will see when they visit your custom URL.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-4xl shadow-3xl overflow-hidden border border-gray-200/50">
              {/* Mock Browser Header */}
              <div className="bg-gray-100 px-8 py-6 flex items-center space-x-4">
                <div className="flex space-x-3">
                  <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white rounded-xl px-6 py-3 text-base text-gray-600 mx-8 font-mono border border-gray-200">
                  servicehomie.com/johns-window-cleaning
                </div>
              </div>

              {/* Landing Page Preview */}
              <div className="bg-white p-16">
                <div className="max-w-5xl mx-auto">
                  {/* Hero Section */}
                  <div className="text-center mb-16">
                    <div className="flex items-center justify-center mb-8">
                      <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#1754D4] flex items-center justify-center text-white text-4xl md:text-5xl font-bold border-4 border-white shadow-2xl">
                        JW
                      </div>
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-bold text-[#1E2937] mb-6 leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                      John's Window Cleaning
                    </h1>
                    <p className="text-2xl text-[#1E2937]/70 mb-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      Austin, TX
                    </p>
                    <p className="text-[#1E2937]/80 max-w-4xl mx-auto text-xl leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      Professional window cleaning services for residential and commercial properties. Crystal clear results guaranteed.
                    </p>
                  </div>

                  {/* Services Section */}
                  <div className="mb-16">
                    <div className="text-center mb-12">
                      <h2 className="text-4xl md:text-5xl font-bold text-[#1E2937] mb-6 leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                        Our Services
                      </h2>
                      <p className="text-[#1E2937]/70 max-w-3xl mx-auto text-xl leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        Professional services tailored to your needs
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      {/* Window Cleaning Service */}
                      <div className="group bg-white rounded-3xl shadow-2xl border border-gray-200/50 p-10 hover:shadow-3xl hover:border-[#1754D4]/30 transition-all duration-500 transform hover:-translate-y-3">
                        <div className="flex flex-col h-full">
                          <div className="flex items-center justify-between mb-8">
                            <div className="w-16 h-16 bg-[#1754D4]/10 rounded-2xl flex items-center justify-center">
                              <svg className="w-8 h-8 text-[#1754D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </div>
                            <div className="text-right">
                              <div className="text-4xl md:text-5xl font-bold text-[#1754D4]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                                $199+
                              </div>
                              <div className="text-base text-gray-500 font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                Starting Price
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-[#1E2937] mb-6 group-hover:text-[#1754D4] transition-colors leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                              Window Cleaning
                            </h3>
                            <p className="text-[#1E2937]/70 leading-relaxed text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              Professional window cleaning for residential and commercial properties. Crystal clear results guaranteed.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pressure Washing Service */}
                      <div className="group bg-white rounded-3xl shadow-2xl border border-gray-200/50 p-10 hover:shadow-3xl hover:border-[#1754D4]/30 transition-all duration-500 transform hover:-translate-y-3">
                        <div className="flex flex-col h-full">
                          <div className="flex items-center justify-between mb-8">
                            <div className="w-16 h-16 bg-[#1754D4]/10 rounded-2xl flex items-center justify-center">
                              <svg className="w-8 h-8 text-[#1754D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                            </div>
                            <div className="text-right">
                              <div className="text-4xl md:text-5xl font-bold text-[#1754D4]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                                $249+
                              </div>
                              <div className="text-base text-gray-500 font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                Starting Price
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-[#1E2937] mb-6 group-hover:text-[#1754D4] transition-colors leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                              Pressure Washing
                            </h3>
                            <p className="text-[#1E2937]/70 leading-relaxed text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              Exterior cleaning and pressure washing services. Restore your property's curb appeal.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Gutter Cleaning Service */}
                      <div className="group bg-white rounded-3xl shadow-2xl border border-gray-200/50 p-10 hover:shadow-3xl hover:border-[#1754D4]/30 transition-all duration-500 transform hover:-translate-y-3">
                        <div className="flex flex-col h-full">
                          <div className="flex items-center justify-between mb-8">
                            <div className="w-16 h-16 bg-[#1754D4]/10 rounded-2xl flex items-center justify-center">
                              <svg className="w-8 h-8 text-[#1754D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div className="text-right">
                              <div className="text-4xl md:text-5xl font-bold text-[#1754D4]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                                $229+
                              </div>
                              <div className="text-base text-gray-500 font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                Starting Price
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-[#1E2937] mb-6 group-hover:text-[#1754D4] transition-colors leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                              Gutter Cleaning
                            </h3>
                            <p className="text-[#1E2937]/70 leading-relaxed text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              Complete gutter cleaning and maintenance. Prevent water damage and keep your home protected.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Powered by Service Homie */}
                  <div className="text-center pt-12 border-t border-gray-200">
                    <p className="text-gray-500 text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      Powered by Service Homie
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <p className="text-[#1E2937]/70 mb-8 text-xl">Your custom URL will be: <span className="font-mono bg-gray-100 px-4 py-3 rounded-xl text-[#1754D4] font-semibold text-lg">servicehomie.com/yourname</span></p>
              <a href="https://whop.com/apps/app_g0qSlT2gr0HBpX/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-10 py-5 border border-transparent text-xl font-medium rounded-3xl text-white bg-[#1754D4] hover:bg-[#1754D4]/90 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl">
                <svg className="w-7 h-7 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Create Your Landing Page
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-extrabold text-[#1E2937] sm:text-6xl mb-8 leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
              Everything You Need for $19/month
            </h2>
            <p className="text-2xl text-[#1E2937]/70 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              Professional tools to grow your business—no hidden fees, no commission on bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Professional Landing Page',
                description: 'Beautiful, mobile-friendly profile with your custom URL (servicehomie.com/yourname).',
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              {
                title: 'Calendly Integration',
                description: 'Seamless booking integration. Customers book directly through your landing page.',
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: 'Google Reviews Display',
                description: 'Display your Google Business rating and review count to build trust.',
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )
              },
              {
                title: 'Payment Link Integration',
                description: 'Add your payment links (Stripe, Venmo, PayPal, etc.) and keep 100% of earnings.',
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-2 2v8a3 3 0 003 3z" />
                  </svg>
                )
              },
              {
                title: 'Mobile Responsive',
                description: 'Looks perfect on phones, tablets, and computers. No technical setup required.',
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: 'Photo Upload',
                description: 'Upload up to 3 photos and your profile picture to showcase your work.',
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <div key={feature.title} className="group bg-white rounded-3xl shadow-xl p-10 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 hover:border-gray-200">
                <div className="w-20 h-20 bg-[#1754D4]/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-[#1754D4]">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-[#1E2937] mb-6 leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{feature.title}</h3>
                <p className="text-[#1E2937]/70 leading-relaxed text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-extrabold text-[#1E2937] sm:text-6xl mb-8 leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
              How It Works
            </h2>
            <p className="text-2xl text-[#1E2937]/70 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              Get your professional landing page set up in 3 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Subscribe & Customize',
                description: 'Sign up for $19/month, add your business info, services, and photos.',
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                )
              },
              {
                step: '2',
                title: 'Get Your Custom URL',
                description: 'Receive your unique URL (servicehomie.com/yourname) and add it to your marketing.',
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )
              },
              {
                step: '3',
                title: 'Start Booking Clients',
                description: 'Customers book through your landing page. You handle payments with your preferred processor.',
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
            ].map((step) => (
              <div key={step.step} className="relative text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-[#1754D4] text-white text-3xl font-bold mb-8 shadow-2xl">
                    {step.step}
                  </div>
                  <div className="w-20 h-20 bg-[#1754D4]/10 rounded-3xl flex items-center justify-center mb-8">
                    <div className="text-[#1754D4]">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-3xl font-semibold text-[#1E2937] mb-6 leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{step.title}</h3>
                  <p className="text-[#1E2937]/70 text-xl leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-extrabold text-[#1E2937] sm:text-6xl mb-8 leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-2xl text-[#1E2937]/70 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              One plan. Everything included. No surprises.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-4xl shadow-3xl p-16 border-2 border-[#1754D4]/20 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#1754D4]/5 rounded-full -translate-y-20 translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1754D4]/5 rounded-full translate-y-16 -translate-x-16"></div>
              
              <div className="relative text-center">
                <div className="w-32 h-32 bg-[#1754D4] rounded-4xl flex items-center justify-center mx-auto mb-12 shadow-2xl">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-4xl font-bold text-[#1E2937] mb-6">Starter Plan</h3>
                <div className="mb-12">
                  <span className="text-6xl font-bold text-[#1754D4]">$19</span>
                  <span className="text-3xl text-gray-600">/month</span>
                </div>
                
                <div className="space-y-6 mb-16">
                  {[
                    'Professional landing page',
                    'Calendly booking integration',
                    'Google Reviews integration',
                    'Custom URL (servicehomie.com/yourname)',
                    'Mobile responsive design',
                    'Payment link integration'
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-5">
                      <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[#1E2937] text-xl">{feature}</span>
                    </div>
                  ))}
                </div>

                <a href="https://whop.com/apps/app_g0qSlT2gr0HBpX/" target="_blank" rel="noopener noreferrer" className="w-full bg-[#1754D4] text-white px-12 py-6 rounded-3xl font-bold hover:bg-[#1754D4]/90 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl block text-center text-2xl">
                  Start Your $19/month Plan
                </a>
                
                <p className="text-gray-600 mt-8 text-xl">
                  Cancel anytime. No setup fees or hidden charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1754D4]">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:py-32 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl mb-12 lg:mb-0 leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
            <span className="block">Ready to look professional?</span>
            <span className="block text-white/90 text-4xl mt-6">Get your landing page and start booking clients today.</span>
          </h2>
          <div className="lg:flex-shrink-0">
            <a href="https://whop.com/apps/app_g0qSlT2gr0HBpX/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-12 py-6 border-2 border-white/30 text-2xl font-bold rounded-3xl text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              <svg className="w-8 h-8 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Your $19/month Plan
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E2937]">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-white text-3xl font-semibold mb-8" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Service Homie</h3>
            <p className="text-gray-400 text-xl mb-10" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Professional landing pages for service businesses.</p>
            
            <div className="flex justify-center space-x-10 mb-10">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>About</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Contact</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Terms</Link>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-10">
            <p className="text-gray-500 text-center text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>&copy; 2025 Service Homie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
