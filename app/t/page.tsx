export default function TenantIndexPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-whop-pomegranate to-whop-blue rounded-full mb-4">
          <span className="text-2xl text-white">🎯</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
          Service Homie
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
          Your All-In-One Whop Booking Platform
        </p>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            How to access your dashboard:
          </h2>
          <div className="text-left space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <p>1. Go to your Whop dashboard</p>
            <p>2. Navigate to "Service Homie Booking System"</p>
            <p>3. You'll see your personalized creator dashboard</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-whop-pomegranate/10 to-whop-blue/10 rounded-xl p-6 border border-whop-pomegranate/20">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Quick Access Links
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href="/t/demo/dashboard" 
              className="bg-whop-pomegranate text-white px-6 py-3 rounded-xl font-semibold hover:bg-whop-pomegranate/90 transition-colors block text-center"
            >
              View Demo Dashboard
            </a>
            <a 
              href="/t/demo/book" 
              className="bg-whop-blue text-white px-6 py-3 rounded-xl font-semibold hover:bg-whop-blue/90 transition-colors block text-center"
            >
              Try Demo Booking
            </a>
          </div>
        </div>
        
        <div className="mt-6 bg-whop-chartreuse/10 dark:bg-whop-chartreuse/20 rounded-lg p-4 border border-whop-chartreuse/20">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <strong>Note:</strong> This app is designed to work within Whop's ecosystem. 
            Please access it through your Whop dashboard for the full experience.
          </p>
        </div>
      </div>
    </div>
  );
}
