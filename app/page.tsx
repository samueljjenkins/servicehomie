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
            alt="Neighborhood background"
            className="w-full h-full object-cover object-center"
            draggable="false"
          />
        </div>
        <div className="relative max-w-7xl mx-auto z-10">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">
                book a local technician <span className="text-blue-600">today</span>
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              pick a service, choose technician, book a time, done.
            </p>
            <div className="mt-5 flex justify-center gap-4 md:mt-8">
              <Link href="/marketplace" className="rounded-md shadow w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                Find a Service
              </Link>
              <Link href="/technician-signup" className="rounded-md shadow w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                Become a Technician
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              We specialize in exterior home cleaning services.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Window Cleaning',
                description: 'Professional window cleaning for a streak-free shine.',
                icon: '🪟',
                href: '/marketplace/window-cleaning',
              },
              {
                title: 'Gutter Cleaning',
                description: 'Keep your gutters clear and your home protected.',
                icon: '🧹',
                href: '/marketplace/gutter-cleaning',
              },
              {
                title: 'Pressure Washing',
                description: 'Restore the look of your driveway, siding, and more.',
                icon: '💦',
                href: '/marketplace/pressure-washing',
              }
            ].map((service) => (
              <Link key={service.title} href={service.href} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 block cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                <p className="mt-2 text-gray-500">{service.description}</p>
              </Link>
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
              Getting started is easy. Just follow these simple steps.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  step: '1',
                  title: 'Book a Service',
                  description: 'Choose from our wide range of services and book your appointment.',
                },
                {
                  step: '2',
                  title: 'Get Matched',
                  description: "We'll connect you with the perfect professional for your needs.",
                },
                {
                  step: '3',
                  title: 'Enjoy the Results',
                  description: 'Sit back and relax while our professionals handle the job.',
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
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Find your perfect service professional today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/homeowner-signup" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                Get started
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