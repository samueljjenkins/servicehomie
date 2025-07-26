export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white text-4xl">🏡</span>
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl mb-6">
              Why We Built <span className="text-blue-600">Service Homie</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We saw a huge problem in the home services industry and decided to fix it. 
              Here's our story and how we're making things better for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Problems We Found</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Problem 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">💸</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expensive Website Builders</h3>
              <p className="text-gray-500">
                Technicians were spending $500-2000+ on website builders like Wix or Squarespace, 
                plus monthly fees, just to have a basic online presence.
              </p>
            </div>

            {/* Problem 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Phone Tag & Missed Calls</h3>
              <p className="text-gray-500">
                Customers had to call around, leave voicemails, and wait for callbacks. 
                Technicians missed jobs while on other calls or working.
              </p>
            </div>

            {/* Problem 3 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-red-500 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🤷‍♂️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Unclear Pricing</h3>
              <p className="text-gray-600 leading-relaxed">
                Customers never knew what they'd pay until after the work was done. 
                "It depends" was the standard answer, creating anxiety and distrust.
              </p>
            </div>

            {/* Problem 4 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-red-500 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Poor Mobile Experience</h3>
              <p className="text-gray-600 leading-relaxed">
                Most service websites looked terrible on phones, where 70% of customers 
                were trying to book services.
              </p>
            </div>

            {/* Problem 5 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-red-500 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hidden Reviews</h3>
              <p className="text-gray-600 leading-relaxed">
                Great Google reviews were buried on Google Maps. Customers couldn't easily 
                see a technician's reputation and track record.
              </p>
            </div>

            {/* Problem 6 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-red-500 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">💳</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Payment Hassles</h3>
              <p className="text-gray-600 leading-relaxed">
                Cash-only or "check in the mail" payments were common. No easy way to 
                pay online or track payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Solution</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We created a simple, affordable platform that solves all these problems
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 shadow-2xl">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold mb-2">$19/month</h3>
                  <p className="text-blue-100">Everything included</p>
                  <div className="mt-6 space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-green-300">✓</span>
                      <span>Professional landing page</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-300">✓</span>
                      <span>Calendly booking integration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-300">✓</span>
                      <span>Google Reviews display</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-300">✓</span>
                      <span>Custom URL (servicehomie.com/yourname)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-300">✓</span>
                      <span>Mobile responsive design</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-300">✓</span>
                      <span>Handle your own payments (0% commission)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Benefits */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Save Thousands</h3>
                  <p className="text-gray-600">
                    Instead of $500-2000+ for website builders, technicians get everything they need for just $19/month.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Booking</h3>
                  <p className="text-gray-600">
                    Customers can book anytime, anywhere. No more missed calls or phone tag. 
                    Calendly integration handles scheduling automatically.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📱</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile-First Design</h3>
                  <p className="text-gray-600">
                    Every landing page looks perfect on phones, tablets, and computers. 
                    No technical setup required.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Showcase Reviews</h3>
                  <p className="text-gray-600">
                    Google Reviews are prominently displayed to build trust. 
                    Customers can see your reputation at a glance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💳</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Keep 100% of Earnings</h3>
                  <p className="text-gray-600">
                    No commission on bookings. You handle your own payments and keep every dollar you earn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Impact</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here's what happens when technicians use Service Homie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">More Bookings</h3>
              <p className="text-gray-600">
                Professional online presence attracts more customers and reduces no-shows
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⏰</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Save Time</h3>
              <p className="text-gray-600">
                No more phone calls, scheduling conflicts, or administrative headaches
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💪</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Look Professional</h3>
              <p className="text-gray-600">
                Stand out from competitors with a modern, trustworthy online presence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of service professionals who are already using Service Homie to grow their business
          </p>
          <a
            href="/technician-signup"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-blue-600 bg-white hover:bg-blue-50 transition-colors shadow-lg"
          >
            Start Your $19/month Plan
          </a>
        </div>
      </section>
    </div>
  );
} 