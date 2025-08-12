"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function TenantPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tenant = params?.tenant as string;
    
    if (tenant) {
      // Immediate redirect to dashboard
      router.push(`/t/${tenant}/dashboard`);
    } else {
      setError("No tenant ID found");
      setIsLoading(false);
    }
  }, [params, router]);

  // If we have an error, show it
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Configuration Error
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-whop-pomegranate text-white px-6 py-3 rounded-xl font-semibold hover:bg-whop-pomegranate/90 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Show minimal loading state
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-whop-pomegranate rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Loading Service Homie...
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Redirecting to your dashboard
        </p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whop-pomegranate mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
