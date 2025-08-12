import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section with Full Background Image */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/backgroundimage.png"
            alt="Business background"
            className="w-full h-full object-cover object-center"
            draggable="false"
          />
        </div>
        <div className="relative max-w-6xl mx-auto z-10 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl mb-8 shadow-2xl border border-white/30">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-6xl tracking-tight font-extrabold text-white sm:text-7xl md:text-8xl mb-8 leading-tight drop-shadow-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900 }}>
            <span className="block mb-4">
              Service <span className="text-[#1754D4] drop-shadow-lg">Homie</span>
            </span>
          </h1>
          <p className="mt-8 max-w-4xl mx-auto text-2xl text-white/95 sm:text-3xl md:mt-10 md:text-4xl leading-relaxed mb-12 drop-shadow-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            Transform your service business with a professional landing page that converts visitors into customers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 md:mt-16">
            <a href="https://whop.com/apps/app_g0qSlT2gr0HBpX/" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center justify-center px-10 py-5 border border-transparent text-xl font-bold text-white bg-[#1754D4] hover:bg-[#1754D4]/90 md:py-6 md:text-2xl md:px-16 rounded-3xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl hover:shadow-[#1754D4]/50" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              <svg className="w-7 h-7 mr-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Your $19/month Plan
            </a>
            <Link href="#demo" className="group inline-flex items-center justify-center px-10 py-5 border-2 border-white/40 text-xl font-bold text-white bg-white/10 backdrop-blur-md hover:bg-white/20 md:py-6 md:text-2xl md:px-16 rounded-3xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              <svg className="w-7 h-7 mr-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              See Demo
            </Link>
          </div>
          
          {/* Social Proof */}
          <div className="mt-16 flex items-center justify-center space-x-8 text-white/80">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/30"></div>
                <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/30"></div>
                <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/30"></div>
              </div>
              <span className="text-sm font-medium">500+ businesses trust us</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-sm font-medium">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Problem Side */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                The Problem
              </div>
              <h2 className="text-4xl font-bold text-[#1E2937] leading-tight">
                Service businesses struggle with <span className="text-red-600">poor online presence</span> and <span className="text-red-600">lost opportunities</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-600">Generic websites that don't convert visitors</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-600">Complex booking systems that confuse customers</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-600">No social proof to build trust</p>
                </div>
              </div>
            </div>

            {/* Solution Side */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                The Solution
              </div>
              <h2 className="text-4xl font-bold text-[#1E2937] leading-tight">
                Professional landing pages that <span className="text-green-600">convert visitors into customers</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-600">Beautiful, conversion-focused designs</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-600">Seamless Calendly booking integration</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-600">Google Reviews to build credibility</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-[#1754D4]/10 text-[#1754D4] rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Live Demo
            </div>
            <h2 className="text-5xl font-bold text-[#1E2937] mb-6 leading-tight">
              See Your Landing Page in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-12">
                <div className="max-w-4xl mx-auto">
                  {/* Hero Section */}
                  <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#1754D4] to-blue-600 flex items-center justify-center text-white text-3xl md:text-4xl font-bold border-4 border-white shadow-xl">
                        JW
                      </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-[#1E2937] mb-4">
                      John's Window Cleaning
                    </h1>
                    <p className="text-xl text-gray-600 mb-4">Austin, TX</p>
                    <p className="text-gray-700 max-w-3xl mx-auto text-lg">
                      Professional window cleaning services for residential and commercial properties. Crystal clear results guaranteed.
                    </p>
                  </div>

                  {/* Services Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-[#1754D4]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <svg className="w-6 h-6 text-[#1754D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-[#1E2937] mb-2">Window Cleaning</h3>
                        <p className="text-2xl font-bold text-[#1754D4]">$199+</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-[#1754D4]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <svg className="w-6 h-6 text-[#1754D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-[#1E2937] mb-2">Pressure Washing</h3>
                        <p className="text-2xl font-bold text-[#1754D4]">$249+</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-[#1754D4]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <svg className="w-6 h-6 text-[#1754D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-[#1E2937] mb-2">Gutter Cleaning</h3>
                        <p className="text-2xl font-bold text-[#1754D4]">$229+</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="text-center">
                    <button className="bg-[#1754D4] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#1754D4]/90 transition-colors shadow-lg">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-6">Your custom URL will be: <span className="font-mono bg-gray-100 px-3 py-2 rounded-lg text-[#1754D4] font-semibold">servicehomie.com/yourname</span></p>
              <a href="https://whop.com/apps/app_g0qSlT2gr0HBpX/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-8 py-4 bg-[#1754D4] text-white rounded-2xl font-semibold hover:bg-[#1754D4]/90 transition-colors shadow-lg">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Create Your Landing Page
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-[#1E2937] mb-6">
              Everything You Need for $19/month
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional tools to grow your business—no hidden fees, no commission on bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Professional Landing Page',
                description: 'Beautiful, mobile-friendly profile with your custom URL.',
                icon: '🚀',
                color: 'from-blue-500 to-blue-600'
              },
              {
                title: 'Calendly Integration',
                description: 'Seamless booking integration. Customers book directly through your page.',
                icon: '📅',
                color: 'from-green-500 to-green-600'
              },
              {
                title: 'Google Reviews Display',
                description: 'Display your Google Business rating and review count to build trust.',
                icon: '⭐',
                color: 'from-yellow-500 to-yellow-600'
              },
              {
                title: 'Payment Link Integration',
                description: 'Add your payment links and keep 100% of earnings.',
                icon: '💳',
                color: 'from-purple-500 to-purple-600'
              },
              {
                title: 'Mobile Responsive',
                description: 'Looks perfect on phones, tablets, and computers.',
                icon: '📱',
                color: 'from-indigo-500 to-indigo-600'
              },
              {
                title: 'Photo Upload',
                description: 'Upload photos and profile picture to showcase your work.',
                icon: '📸',
                color: 'from-pink-500 to-pink-600'
              }
            ].map((feature, index) => (
              <div key={feature.title} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#1E2937] mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-[#1E2937] mb-6">
              Trusted by Service Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join hundreds of businesses that have transformed their online presence with Service Homie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                business: 'Clean Pro Services',
                rating: 5,
                review: 'Service Homie transformed our business. We went from 2-3 bookings per week to 15+ within a month!'
              },
              {
                name: 'Mike Chen',
                business: 'Elite Landscaping',
                rating: 5,
                review: 'The professional look and seamless booking process has increased our conversion rate by 300%.'
              },
              {
                name: 'Lisa Rodriguez',
                business: 'Quick Fix Plumbing',
                rating: 5,
                review: 'Best investment we\'ve made. Our customers love how easy it is to book our services.'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.review}"</p>
                <div>
                  <p className="font-semibold text-[#1E2937]">{testimonial.name}</p>
                  <p className="text-gray-600">{testimonial.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-[#1E2937] mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            One plan. Everything included. No surprises.
          </p>

          <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-[#1754D4]/20">
            <div className="w-24 h-24 bg-[#1754D4] rounded-3xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-[#1E2937] mb-4">Starter Plan</h3>
            <div className="mb-8">
              <span className="text-6xl font-bold text-[#1754D4]">$19</span>
              <span className="text-2xl text-gray-600">/month</span>
            </div>
            
            <div className="space-y-4 mb-12 text-left max-w-md mx-auto">
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
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <a href="https://whop.com/apps/app_g0qSlT2gr0HBpX/" target="_blank" rel="noopener noreferrer" className="w-full bg-[#1754D4] text-white px-10 py-5 rounded-2xl font-bold hover:bg-[#1754D4]/90 transition-colors shadow-2xl block text-center text-xl">
              Start Your $19/month Plan
            </a>
            
            <p className="text-gray-600 mt-6">
              Cancel anytime. No setup fees or hidden charges.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-[#1754D4]">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-8">
            Ready to Transform Your Business?
          </h2>
          <p className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
            Get your professional landing page today and start booking more clients tomorrow.
          </p>
          <a href="https://whop.com/apps/app_g0qSlT2gr0HBpX/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-12 py-6 bg-white text-[#1754D4] rounded-3xl font-bold hover:bg-gray-100 transition-colors shadow-2xl text-xl">
            <svg className="w-8 h-8 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Your $19/month Plan
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E2937] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-white text-2xl font-semibold mb-6">Service Homie</h3>
          <p className="text-gray-400 mb-8">Professional landing pages for service businesses.</p>
          
          <div className="flex justify-center space-x-8 mb-8">
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-500">&copy; 2025 Service Homie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
