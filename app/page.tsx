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
              Professional landing pages for service businesses. Get your custom URL, Calendly booking, and Google Reviews—all for $19/month.
            </p>
            <div className="mt-5 flex justify-center gap-4 md:mt-8">
              <a href="https://whop.com/apps/app_g0qSlT2gr0HBpX/" target="_blank" rel="noopener noreferrer" className="rounded-md shadow w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                Start Your $19/month Plan
              </a>
              <Link href="/about" className="rounded-md shadow w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                How It Works
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
                description: 'Display your Google Business rating and review count to build trust.',
                icon: '⭐',
              },
              {
                title: 'Payment Link Integration',
                description: 'Add your payment links (Stripe, Venmo, PayPal, etc.) and keep 100% of earnings.',
                icon: '💳',
              },
              {
                title: 'Mobile Responsive',
                description: 'Looks perfect on phones, tablets, and computers. No technical setup required.',
                icon: '📱',
              },
              {
                title: 'Photo Upload',
                description: 'Upload up to 3 photos and your profile picture to showcase your work.',
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

      {/* Pricing Section */}
      <section className="py-20 bg-white">
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
                    <span className="text-gray-700">Payment link integration</span>
                  </div>
                </div>

                <a href="https://whop.com/apps/app_g0qSlT2gr0HBpX/" target="_blank" rel="noopener noreferrer" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg block text-center">
                  Start Your $19/month Plan
                </a>
                
                <p className="text-sm text-gray-600 mt-4">
                  Cancel anytime. No setup fees or hidden charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-white text-lg font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Service Homie</h3>
            <p className="text-gray-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Professional landing pages for service businesses.</p>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>&copy; 2025 Service Homie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
