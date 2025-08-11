export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-whop-pomegranate to-whop-blue rounded-full mb-4">
          <span className="text-2xl text-white">🎯</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Loading Service Homie...
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Please wait while we prepare your experience
        </p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whop-pomegranate mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
