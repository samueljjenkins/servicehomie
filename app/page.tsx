import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/backgroundimage.png"
            alt="Business background"
            className="w-full h-full object-cover object-center"
            draggable="false"
          />
          {/* White overlay for better text readability */}
          <div className="absolute inset-0 bg-white/90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto z-10">
          <div className="text-center">
            <h1 className="text-5xl tracking-tight font-extrabold text-[#1E2937] sm:text-6xl md:text-7xl mb-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900 }}>
              <span className="block">
                Your Professional <span className="text-[#1754D4]">Landing Page</span>
              </span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-[#1E2937]/80 sm:text-2xl md:mt-8 md:text-3xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              Professional landing pages for service businesses. Get your custom URL, Calendly booking, and Google Reviews—all for $19/month.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 md:mt-12">
              <a href="https://whop.com/apps/app_g0qSlT2gr0HBpX/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold text-white bg-[#1754D4] hover:bg-[#1754D4]/90 md:py-5 md:text-xl md:px-12 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Your $19/month Plan
              </a>
              <Link href="#features" className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#1754D4]/30 text-lg font-bold text-[#1754D4] bg-white hover:bg-[#1754D4]/5 md:py-5 md:text-xl md:px-12 rounded-2xl transition-all duration-200 transform hover:scale-105" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-[#1E2937] sm:text-5xl mb-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
              See Your Landing Page in Action
            </h2>
            <p className="text-xl text-[#1E2937]/70 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              This is exactly what your customers will see when they visit your custom URL.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Mock Browser Header */}
              <div className="bg-gray-100 px-6 py-4 flex items-center space-x-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white rounded-lg px-4 py-2 text-sm text-gray-600 mx-6 font-mono">
                  servicehomie.com/johns-window-cleaning
                </div>
              </div>

              {/* Landing Page Preview */}
              <div className="bg-white p-12">
                <div className="max-w-4xl mx-auto">
                  {/* Hero Section */}
                  <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#1754D4] flex items-center justify-center text-white text-3xl md:text-4xl font-bold border-4 border-white shadow-xl">
                        JW
                      </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-[#1E2937] mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                      John's Window Cleaning
                    </h1>
                    <p className="text-xl text-[#1E2937]/70 mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      Austin, TX
                    </p>
                    <p className="text-[#1E2937]/80 max-w-3xl mx-auto text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      Professional window cleaning services for residential and commercial properties. Crystal clear results guaranteed.
                    </p>
                  </div>

                  {/* Services Section */}
                  <div className="mb-12">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl md:text-4xl font-bold text-[#1E2937] mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                        Our Services
                      </h2>
                      <p className="text-[#1E2937]/70 max-w-2xl mx-auto text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        Professional services tailored to your needs
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Window Cleaning Service */}
                      <div className="group bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl hover:border-[#1754D4]/30 transition-all duration-300 transform hover:-translate-y-2">
                        <div className="flex flex-col h-full">
                          <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 bg-[#1754D4]/10 rounded-xl flex items-center justify-center">
                              <svg className="w-6 h-6 text-[#1754D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl md:text-4xl font-bold text-[#1754D4]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                                $199+
                              </div>
                              <div className="text-sm text-gray-500 font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                Starting Price
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#1E2937] mb-4 group-hover:text-[#1754D4] transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                              Window Cleaning
                            </h3>
                            <p className="text-[#1E2937]/70 leading-relaxed text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              Professional window cleaning for residential and commercial properties. Crystal clear results guaranteed.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pressure Washing Service */}
                      <div className="group bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl hover:border-[#1754D4]/30 transition-all duration-300 transform hover:-translate-y-2">
                        <div className="flex flex-col h-full">
                          <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 bg-[#1754D4]/10 rounded-xl flex items-center justify-center">
                              <svg className="w-6 h-6 text-[#1754D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl md:text-4xl font-bold text-[#1754D4]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                                $249+
                              </div>
                              <div className="text-sm text-gray-500 font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                Starting Price
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#1E2937] mb-4 group-hover:text-[#1754D4] transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                              Pressure Washing
                            </h3>
                            <p className="text-[#1E2937]/70 leading-relaxed text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              Exterior cleaning and pressure washing services. Restore your property's curb appeal.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Gutter Cleaning Service */}
                      <div className="group bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl hover:border-[#1754D4]/30 transition-all duration-300 transform hover:-translate-y-2">
                        <div className="flex flex-col h-full">
                          <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 bg-[#1754D4]/10 rounded-xl flex items-center justify-center">
                              <svg className="w-6 h-6 text-[#1754D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl md:text-4xl font-bold text-[#1754D4]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
                                $229+
                              </div>
                              <div className="text-sm text-gray-500 font-medium" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                Starting Price
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#1E2937] mb-4 group-hover:text-[#1754D4] transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                              Gutter Cleaning
                            </h3>
                            <p className="text-[#1E2937]/70 leading-relaxed text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              Complete gutter cleaning and maintenance. Prevent water damage and keep your home protected.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Powered by Service Homie */}
                  <div className="text-center pt-8 border-t border-gray-200">
                    <p className="text-gray-500 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      Powered by Service Homie
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-[#1E2937]/70 mb-6 text-lg">Your custom URL will be: <span className="font-mono bg-gray-100 px-3 py-2 rounded-lg text-[#1754D4] font-semibold">servicehomie.com/yourname</span></p>
              <a href="https://whop.com/apps/app_g0qSlT2gr0HBpX/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-2xl text-white bg-[#1754D4] hover:bg-[#1754D4]/90 transition-all duration-200 transform hover:scale-105 shadow-xl">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Create Your Landing Page
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-[#1E2937] sm:text-5xl mb-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
              Everything You Need for $19/month
            </h2>
            <p className="text-xl text-[#1E2937]/70 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              Professional tools to grow your business—no hidden fees, no commission on bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Professional Landing Page',
                description: 'Beautiful, mobile-friendly profile with your custom URL (servicehomie.com/yourname).',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                color: '[#1754D4]'
              },
              {
                title: 'Calendly Integration',
                description: 'Seamless booking integration. Customers book directly through your landing page.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                color: '[#1754D4]'
              },
              {
                title: 'Google Reviews Display',
                description: 'Display your Google Business rating and review count to build trust.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ),
                color: '[#1754D4]'
              },
              {
                title: 'Payment Link Integration',
                description: 'Add your payment links (Stripe, Venmo, PayPal, etc.) and keep 100% of earnings.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ),
                color: '[#1754D4]'
              },
              {
                title: 'Mobile Responsive',
                description: 'Looks perfect on phones, tablets, and computers. No technical setup required.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                color: '[#1754D4]'
              },
              {
                title: 'Photo Upload',
                description: 'Upload up to 3 photos and your profile picture to showcase your work.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                color: '[#1754D4]'
              }
            ].map((feature, index) => (
              <div key={feature.title} className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200">
                <div className="w-16 h-16 bg-[#1754D4]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <div className="text-[#1754D4]">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-[#1E2937] mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{feature.title}</h3>
                <p className="text-[#1E2937]/70 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-[#1E2937] sm:text-5xl mb-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
              How It Works
            </h2>
            <p className="text-xl text-[#1E2937]/70 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              Get your professional landing page set up in 3 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Subscribe & Customize',
                description: 'Sign up for $19/month, add your business info, services, and photos.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                )
              },
              {
                step: '2',
                title: 'Get Your Custom URL',
                description: 'Receive your unique URL (servicehomie.com/yourname) and add it to your marketing.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )
              },
              {
                step: '3',
                title: 'Start Booking Clients',
                description: 'Customers book through your landing page. You handle payments with your preferred processor.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
            ].map((step) => (
              <div key={step.step} className="relative text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#1754D4] text-white text-2xl font-bold mb-6 shadow-xl">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 bg-[#1754D4]/10 rounded-2xl flex items-center justify-center mb-6">
                    <div className="text-[#1754D4]">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-[#1E2937] mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{step.title}</h3>
                  <p className="text-[#1E2937]/70 text-lg leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-[#1E2937] sm:text-5xl mb-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-[#1E2937]/70 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              One plan. Everything included. No surprises.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-[#1754D4]/20 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1754D4]/5 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#1754D4]/5 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative text-center">
                <div className="w-24 h-24 bg-[#1754D4] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-[#1E2937] mb-4">Starter Plan</h3>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-[#1754D4]">$19</span>
                  <span className="text-2xl text-gray-600">/month</span>
                </div>
                
                <div className="space-y-5 mb-10">
                  {[
                    'Professional landing page',
                    'Calendly booking integration',
                    'Google Reviews integration',
                    'Custom URL (servicehomie.com/yourname)',
                    'Mobile responsive design',
                    'Payment link integration'
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[#1E2937] text-lg">{feature}</span>
                    </div>
                  ))}
                </div>

                <a href="https://whop.com/apps/app_g0qSlT2gr0HBpX/" target="_blank" rel="noopener noreferrer" className="w-full bg-[#1754D4] text-white px-10 py-5 rounded-2xl font-bold hover:bg-[#1754D4]/90 transition-all duration-200 transform hover:scale-105 shadow-2xl block text-center text-xl">
                  Start Your $19/month Plan
                </a>
                
                <p className="text-gray-600 mt-6 text-lg">
                  Cancel anytime. No setup fees or hidden charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1754D4]">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-8 lg:mb-0" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
            <span className="block">Ready to look professional?</span>
            <span className="block text-white/90 text-3xl mt-4">Get your landing page and start booking clients today.</span>
          </h2>
          <div className="lg:flex-shrink-0">
            <a href="https://whop.com/apps/app_g0qSlT2gr0HBpX/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-xl font-bold rounded-2xl text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 transform hover:scale-105" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Your $19/month Plan
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E2937]">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-white text-2xl font-semibold mb-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Service Homie</h3>
            <p className="text-gray-400 text-lg mb-8" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Professional landing pages for service businesses.</p>
            
            <div className="flex justify-center space-x-8 mb-8">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>About</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Contact</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Terms</Link>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-500 text-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>&copy; 2025 Service Homie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
