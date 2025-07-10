export default function AboutPage() {
  return (
    <section className="py-24 bg-gray-50 min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl mb-6">About Service Homie</h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Our mission is to make home services simple, trustworthy, and accessible for everyone.
          </p>
        </div>

        {/* Why This Was Created */}
        <div className="bg-white rounded-lg shadow-lg py-14 px-8 mb-16">
          <div className="flex flex-col items-center text-center">
            <span className="text-6xl mb-6" role="img" aria-label="Home">🏡</span>
            <h2 className="text-3xl font-bold text-blue-600 mb-3">Why We Created Service Homie</h2>
            <p className="text-lg text-gray-700 mb-4">
              Finding reliable home service professionals can be stressful and time-consuming. Many people struggle with unclear pricing, difficulty finding trusted technicians, and unreliable service providers.
            </p>
            <p className="text-lg text-gray-700">
              We wanted to create a platform that takes the guesswork out of booking home services, so you can focus on what matters most.
            </p>
          </div>
        </div>

        {/* How It Solves Problems */}
        <div className="bg-white rounded-lg shadow-lg py-14 px-8">
          <div className="flex flex-col items-center text-center">
            <span className="text-6xl mb-6" role="img" aria-label="Solution">🤝</span>
            <h2 className="text-3xl font-bold text-blue-600 mb-3">How Service Homie Solves These Problems</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6 text-left max-w-lg mx-auto text-lg">
              <li><span className="font-semibold text-gray-900">Transparent Pricing:</span> Know exactly what you'll pay before you book.</li>
              <li><span className="font-semibold text-gray-900">Vetted Technicians:</span> All pros are background-checked and reviewed by real customers.</li>
              <li><span className="font-semibold text-gray-900">Easy Booking:</span> Book a service in just a few clicks—no phone calls or waiting around.</li>
              <li><span className="font-semibold text-gray-900">Reliable Support:</span> Our team is here to help you every step of the way.</li>
            </ul>
            <p className="text-lg text-gray-700">
              With Service Homie, you can book with confidence and get the job done right, every time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 