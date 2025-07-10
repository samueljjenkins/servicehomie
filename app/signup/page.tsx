import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Join Service Homie</h1>
        <p className="text-lg text-gray-600 mb-12">
          Choose your account type to get started. Are you looking for services or providing them?
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          {/* Homeowner Card */}
          <Link href="/homeowner-signup" className="group">
            <div className="bg-white rounded-xl shadow-md p-10 flex flex-col items-center justify-center border-2 border-transparent group-hover:border-blue-600 group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">I'm a Homeowner</h2>
              <p className="text-gray-500 mb-6 text-center">
                Find and book trusted, local professionals for all your home service needs.
              </p>
              <div className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg group-hover:bg-blue-700 transition-colors duration-300">
                Sign Up as Homeowner
              </div>
            </div>
          </Link>

          {/* Technician Card */}
          <Link href="/technician-signup" className="group">
            <div className="bg-white rounded-xl shadow-md p-10 flex flex-col items-center justify-center border-2 border-transparent group-hover:border-green-600 group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">I'm a Technician</h2>
              <p className="text-gray-500 mb-6 text-center">
                Grow your business, find new clients, and manage your jobs all in one place.
              </p>
              <div className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg group-hover:bg-green-700 transition-colors duration-300">
                Sign Up as Technician
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 