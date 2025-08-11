'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Service Homie Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
          <span className="text-2xl text-white">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Something went wrong!
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          We encountered an error while loading Service Homie. This might be a temporary issue.
        </p>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Try these steps:
          </h2>
          <div className="text-left space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <p>1. Refresh the page</p>
            <p>2. Check your internet connection</p>
            <p>3. Try accessing from a different browser</p>
            <p>4. Contact support if the issue persists</p>
          </div>
        </div>

        <div className="space-x-4">
          <button
            onClick={reset}
            className="bg-whop-pomegranate text-white px-6 py-3 rounded-xl font-semibold hover:bg-whop-pomegranate/90 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
