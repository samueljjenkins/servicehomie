import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/background.png"
            alt="Business background"
            className="w-full h-full object-cover object-center"
            draggable="false"
          />
        </div>
        <div className="relative max-w-7xl mx-auto z-10">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
              <span className="block">
                Your Professional <span className="text-blue-600">Landing Page</span>
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              For local technicians & service businesses: Get a professional landing page, Calendly integration, Google Reviews, and handle your own payments—all with your own custom URL.
            </p>
            <div className="mt-5 flex justify-center gap-4 md:mt-8">
              <Link href="/technician-signup" className="rounded-md shadow w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                Start Your $19/month Plan
              </Link>
              <Link href="/about" className="rounded-md shadow w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
              See Your Landing Page in Action
            </h2>
            <p className="mt-4 text-lg text-gray-500" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              This is exactly what your customers will see when they visit your custom URL.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Mock Browser Header */}
              <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600 mx-4">
                  servicehomie.com/johns-window-cleaning
                </div>
              </div>

              {/* Compact Landing Page Preview */}
              <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
                <div className="max-w-md mx-auto">
                  {/* Hero Section - Compact */}
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 shadow-lg flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">JW</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">John's Window Cleaning</h1>
                    <p className="text-lg text-gray-600 mb-3">Austin, TX</p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Professional window cleaning services for residential and commercial properties. 
                      Crystal clear results guaranteed.
                    </p>
                  </div>

                  {/* Reviews - Compact with Real Mock Data */}
                  <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-blue-100 p-4 mb-6">
                    <div className="flex items-center justify-center gap-1 mb-3">
                      <span className="text-yellow-400 text-lg">★★★★★</span>
                      <span className="text-gray-600 text-sm font-semibold">4.9</span>
                      <span className="text-gray-500 text-xs">(127 reviews)</span>
                    </div>
                    
                    {/* Sample Reviews */}
                    <div className="space-y-3 mb-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-yellow-400 text-sm">★★★★★</span>
                          <span className="text-gray-700 text-xs font-semibold">Sarah M.</span>
                          <span className="text-gray-500 text-xs">2 days ago</span>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          "John did an amazing job on our house windows. Professional, punctual, and the results were incredible!"
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-yellow-400 text-sm">★★★★★</span>
                          <span className="text-gray-700 text-xs font-semibold">Mike R.</span>
                          <span className="text-gray-500 text-xs">1 week ago</span>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          "Best window cleaning service in Austin. Fair pricing and spotless results!"
                        </p>
                      </div>
                    </div>
                    
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors text-xs font-medium">
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
                            <h3 className="font-bold text-gray-900 text-sm">Residential Cleaning</h3>
                            <p className="text-gray-600 text-xs">Houses, apartments, condos</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">$120+</p>
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
                            <h3 className="font-bold text-gray-900 text-sm">Commercial Cleaning</h3>
                            <p className="text-gray-600 text-xs">Office buildings, storefronts</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">$200+</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking CTA - Compact with Real Calendly */}
                  <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-blue-100 p-4 text-center">
                    <h3 className="font-bold text-gray-900 mb-2">Book Your Window Cleaning</h3>
                    <p className="text-gray-600 text-xs mb-3">Schedule your service today</p>
                    
                    {/* Mock Calendly Calendar */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
                      <div className="text-center mb-4">
                        <h4 className="font-semibold text-gray-900 text-sm">Select a Date & Time</h4>
                        <p className="text-gray-500 text-xs">Available times for John's Window Cleaning</p>
                      </div>
                      
                      {/* Mock Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1 mb-4">
                        {/* Calendar Header */}
                        <div className="text-center text-xs font-semibold text-gray-500 p-1">S</div>
                        <div className="text-center text-xs font-semibold text-gray-500 p-1">M</div>
                        <div className="text-center text-xs font-semibold text-gray-500 p-1">T</div>
                        <div className="text-center text-xs font-semibold text-gray-500 p-1">W</div>
                        <div className="text-center text-xs font-semibold text-gray-500 p-1">T</div>
                        <div className="text-center text-xs font-semibold text-gray-500 p-1">F</div>
                        <div className="text-center text-xs font-semibold text-gray-500 p-1">S</div>
                        
                        {/* Calendar Days */}
                        <div className="text-center text-xs text-gray-400 p-1">28</div>
                        <div className="text-center text-xs text-gray-400 p-1">29</div>
                        <div className="text-center text-xs text-gray-400 p-1">30</div>
                        <div className="text-center text-xs text-gray-400 p-1">1</div>
                        <div className="text-center text-xs text-gray-400 p-1">2</div>
                        <div className="text-center text-xs text-gray-400 p-1">3</div>
                        <div className="text-center text-xs text-gray-400 p-1">4</div>
                        
                        <div className="text-center text-xs text-gray-400 p-1">5</div>
                        <div className="text-center text-xs text-gray-400 p-1">6</div>
                        <div className="text-center text-xs text-gray-400 p-1">7</div>
                        <div className="text-center text-xs text-gray-400 p-1">8</div>
                        <div className="text-center text-xs text-gray-400 p-1">9</div>
                        <div className="text-center text-xs text-gray-400 p-1">10</div>
                        <div className="text-center text-xs text-gray-400 p-1">11</div>
                        
                        <div className="text-center text-xs text-gray-400 p-1">12</div>
                        <div className="text-center text-xs text-gray-400 p-1">13</div>
                        <div className="text-center text-xs text-gray-400 p-1">14</div>
                        <div className="text-center text-xs text-gray-400 p-1">15</div>
                        <div className="text-center text-xs text-gray-400 p-1">16</div>
                        <div className="text-center text-xs text-gray-400 p-1">17</div>
                        <div className="text-center text-xs text-gray-400 p-1">18</div>
                        
                        <div className="text-center text-xs text-gray-400 p-1">19</div>
                        <div className="text-center text-xs text-gray-400 p-1">20</div>
                        <div className="text-center text-xs text-gray-400 p-1">21</div>
                        <div className="text-center text-xs text-gray-400 p-1">22</div>
                        <div className="text-center text-xs text-gray-400 p-1">23</div>
                        <div className="text-center text-xs text-gray-400 p-1">24</div>
                        <div className="text-center text-xs text-gray-400 p-1">25</div>
                        
                        <div className="text-center text-xs text-gray-400 p-1">26</div>
                        <div className="text-center text-xs text-gray-400 p-1">27</div>
                        <div className="text-center text-xs text-gray-400 p-1">28</div>
                        <div className="text-center text-xs text-gray-400 p-1">29</div>
                        <div className="text-center text-xs text-gray-400 p-1">30</div>
                        <div className="text-center text-xs text-gray-400 p-1">31</div>
                        <div className="text-center text-xs text-gray-400 p-1">1</div>
                      </div>
                      
                      {/* Mock Time Slots */}
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-700 mb-2">Available Times</div>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="bg-blue-50 border border-blue-200 rounded px-3 py-2 text-xs text-blue-700 hover:bg-blue-100 transition-colors">
                            9:00 AM
                          </button>
                          <button className="bg-blue-50 border border-blue-200 rounded px-3 py-2 text-xs text-blue-700 hover:bg-blue-100 transition-colors">
                            10:30 AM
                          </button>
                          <button className="bg-blue-50 border border-blue-200 rounded px-3 py-2 text-xs text-blue-700 hover:bg-blue-100 transition-colors">
                            1:00 PM
                          </button>
                          <button className="bg-blue-50 border border-blue-200 rounded px-3 py-2 text-xs text-blue-700 hover:bg-blue-100 transition-colors">
                            2:30 PM
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-semibold text-sm">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">Your custom URL will be: <span className="font-mono bg-gray-100 px-2 py-1 rounded">servicehomie.com/yourname</span></p>
              <Link href="/technician-signup" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Create Your Landing Page
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
              Everything You Need for $19/month
            </h2>
            <p className="mt-4 text-lg text-gray-500" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              Professional tools to grow your business—no hidden fees, no commission on bookings.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Professional Landing Page',
                description: 'Beautiful, mobile-friendly profile with your custom URL (servicehomie.com/yourname).',
                icon: '⚡️',
              },
              {
                title: 'Calendly Integration',
                description: 'Seamless booking integration. Customers book directly through your landing page.',
                icon: '📅',
              },
              {
                title: 'Google Reviews Display',
                description: 'Showcase your Google Business reviews to build trust with potential customers.',
                icon: '⭐',
              },
              {
                title: 'Handle Your Own Payments',
                description: 'No commission on bookings. You keep 100% of what you charge your customers.',
                icon: '💳',
              },
              {
                title: 'Mobile Responsive',
                description: 'Looks perfect on phones, tablets, and computers. No technical setup required.',
                icon: '📱',
              },
              {
                title: 'Profile Photo Upload',
                description: 'Add your professional photo and customize your page to match your brand.',
                icon: '🖼️',
              }
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 block cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{feature.title}</h3>
                <p className="mt-2 text-gray-500" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-500" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              Get your professional landing page set up in 3 simple steps.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Subscribe & Customize',
                  description: 'Sign up for $19/month, add your services, pricing, photos, and business info.',
                },
                {
                  step: '2',
                  title: 'Get Your Custom URL',
                  description: 'Receive your unique URL (servicehomie.com/yourname) and add it to your marketing.',
                },
                {
                  step: '3',
                  title: 'Start Booking Clients',
                  description: 'Customers book through your landing page. You handle payments and keep 100% of your earnings.',
                },
              ].map((step) => (
                <div key={step.step} className="relative">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white text-xl font-bold">
                      {step.step}
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{step.title}</h3>
                    <p className="mt-2 text-gray-500 text-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-500" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              One plan. Everything included. No surprises.
            </p>
          </div>

          <div className="mt-16 max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-3xl">🚀</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter Plan</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-blue-600">$19</span>
                  <span className="text-xl text-gray-600">/month</span>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Professional landing page</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Calendly booking integration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Google Reviews integration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Custom URL (servicehomie.com/yourname)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Mobile responsive design</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">Handle your own payments (0% commission)</span>
                  </div>
                </div>

                <Link href="/technician-signup" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg block text-center">
                  Start Your $19/month Plan
                </Link>
                
                <p className="text-sm text-gray-600 mt-4">
                  Cancel anytime. No setup fees or hidden charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>
            <span className="block">Ready to look professional?</span>
            <span className="block text-blue-200">Get your landing page and start booking clients today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/technician-signup" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-bold rounded-md text-blue-600 bg-white hover:bg-blue-50" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                Start Your $19/month Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Service Homie</h3>
              <p className="text-gray-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Professional landing pages for service businesses.</p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>About</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Terms</Link></li>
                <li><Link href="/cookies" className="text-gray-400 hover:text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>&copy; 2025 Service Homie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}