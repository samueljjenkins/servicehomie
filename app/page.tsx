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
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">
                create your free website <span className="text-blue-600">in 60 seconds</span>
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              For local technicians & service businesses: Instantly launch a professional profile, accept bookings, and get paid—all with your own shareable link.
            </p>
            <div className="mt-5 flex justify-center gap-4 md:mt-8">
              <Link href="/technician-signup" className="rounded-md shadow w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                Get Started Free
              </Link>
              <Link href="/about" className="rounded-md shadow w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
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
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Service Homie?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Everything you need to look professional and get booked—no coding, no waiting, no approvals.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Instant Landing Page',
                description: 'Create a beautiful, mobile-friendly profile for your business in under a minute.',
                icon: '⚡️',
              },
              {
                title: 'Easy Bookings',
                description: 'Let customers book you online 24/7. No more phone tag or DMs.',
                icon: '📅',
              },
              {
                title: 'Get Paid Online',
                description: 'Secure payments with automatic 15% fee. Funds go straight to your account.',
                icon: '💳',
              }
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 block cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Get your business online in 3 simple steps.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Sign Up & Customize',
                  description: 'Create your account, add your services, pricing, photos, and business info.',
                },
                {
                  step: '2',
                  title: 'Share Your Link',
                  description: 'Get a unique URL for your landing page. Add it to your social media, website, or business card.',
                },
                {
                  step: '3',
                  title: 'Get Booked & Paid',
                  description: 'Customers book and pay online. You get notified instantly and keep 85% of every booking.',
                },
              ].map((step) => (
                <div key={step.step} className="relative">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white text-xl font-bold">
                      {step.step}
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-gray-500 text-center">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to look professional?</span>
            <span className="block text-blue-200">Create your landing page and start booking clients today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/technician-signup" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                Get Started Free
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
              <h3 className="text-white text-lg font-semibold mb-4">Service Homie</h3>
              <p className="text-gray-400">Your trusted home service marketplace.</p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><Link href="/marketplace/window-cleaning" className="text-gray-400 hover:text-white">Window Cleaning</Link></li>
                <li><Link href="/marketplace/gutter-cleaning" className="text-gray-400 hover:text-white">Gutter Cleaning</Link></li>
                <li><Link href="/marketplace/pressure-washing" className="text-gray-400 hover:text-white">Pressure Washing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link></li>
                <li><Link href="/cookies" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-center">&copy; 2025 Service Homie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}