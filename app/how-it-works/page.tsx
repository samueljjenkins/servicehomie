export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white text-4xl">⚡</span>
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl mb-6">
              How <span className="text-blue-600">Service Homie</span> Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get your professional landing page up and running in minutes, not months. 
              Here's exactly how our simple 3-step process works.
            </p>
          </div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
            <div className="lg:w-1/2">
              <div className="bg-white rounded-lg shadow-lg p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                    1
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Subscribe & Customize</h2>
                </div>
                <div className="space-y-4 text-lg text-gray-600">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                    <p>Sign up for our $19/month Starter Plan</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                    <p>Add your business name, services, and pricing</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                    <p>Upload your profile photo and business description</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                    <p>Connect your Calendly for easy booking</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">What You Get</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">✅</span>
                    <span>Professional landing page template</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">✅</span>
                    <span>Easy customization dashboard</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">✅</span>
                    <span>Mobile-responsive design</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">✅</span>
                    <span>Google Reviews integration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-24">
            <div className="lg:w-1/2">
              <div className="bg-white rounded-lg shadow-lg p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                    2
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Get Your Custom URL</h2>
                </div>
                <div className="space-y-4 text-lg text-gray-600">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                    <p>Your page goes live instantly at <span className="font-mono bg-gray-100 px-2 py-1 rounded">servicehomie.com/yourname</span></p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                    <p>Share your URL on business cards, social media, and ads</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                    <p>Customers can find you easily with a professional web presence</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                    <p>No technical setup or domain management required</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Your Landing Page Includes</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    <span>Hero section with your business info</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">⭐</span>
                    <span>Google Reviews display</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📅</span>
                    <span>Calendly booking integration</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💰</span>
                    <span>Service pricing and descriptions</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📞</span>
                    <span>Contact information</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
            <div className="lg:w-1/2">
              <div className="bg-white rounded-lg shadow-lg p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                    3
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Start Booking Clients</h2>
                </div>
                <div className="space-y-4 text-lg text-gray-600">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                    <p>Customers visit your page and see your services</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                    <p>They book appointments through your Calendly</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                    <p>You handle payments directly (no commission fees)</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 mr-3 flex-shrink-0"></div>
                    <p>Keep 100% of your earnings</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">The Results</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📈</span>
                    <span>More professional online presence</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">⏰</span>
                    <span>24/7 booking availability</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💳</span>
                    <span>Direct payment processing</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    <span>Higher conversion rates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Service Homie */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Service Homie?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're not just another website builder. We're built specifically for service professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💸</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Hidden Fees</h3>
              <p className="text-gray-500">
                Just $19/month. No setup fees, no commission on your earnings, no surprises.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Setup</h3>
              <p className="text-gray-500">
                Your page is live in minutes, not weeks. No technical knowledge required.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile-First</h3>
              <p className="text-gray-500">
                Designed for phones first, where 70% of your customers will find you.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Purpose-Built</h3>
              <p className="text-gray-500">
                Built specifically for service professionals, not generic businesses.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Keep Your Earnings</h3>
              <p className="text-gray-500">
                Handle payments directly. No platform taking a cut of your hard work.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Updates</h3>
              <p className="text-gray-500">
                Update your services, pricing, or photos anytime from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join hundreds of service professionals who've transformed their business with Service Homie.
            </p>
            <a 
              href="/signup" 
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Your $19/month Plan
            </a>
            <p className="text-sm opacity-75 mt-4">No setup fees • Cancel anytime • 30-day money-back guarantee</p>
          </div>
        </div>
      </section>
    </div>
  );
} 