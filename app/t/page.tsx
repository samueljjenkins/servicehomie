export default function TenantIndexPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111111] flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Service Homie
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
          Your All-In-One Whop Booking Platform
        </p>
        
        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            How to access your dashboard:
          </h2>
          <div className="text-left space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <p>1. Go to your Whop dashboard</p>
            <p>2. Navigate to "Service Homie Booking System"</p>
            <p>3. You'll see your personalized creator dashboard</p>
          </div>
        </div>
        
        <div className="bg-whop-pomegranate/10 dark:bg-whop-pomegranate/20 rounded-lg p-4">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <strong>Note:</strong> This app is designed to work within Whop's ecosystem. 
            Please access it through your Whop dashboard for the full experience.
          </p>
        </div>
      </div>
    </div>
  );
}
