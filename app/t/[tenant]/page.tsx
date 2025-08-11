"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function TenantPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get tenant from useParams instead of async params
    const tenant = params?.tenant as string;
    
    if (tenant) {
      // This is the main tenant page that Whop loads
      // We'll redirect to the dashboard by default
      const timer = setTimeout(() => {
        router.push(`/t/${tenant}/dashboard`);
      }, 500); // Slightly longer delay to ensure Whop loads properly

      return () => clearTimeout(timer);
    }
  }, [params, router]);

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
          Redirecting to your dashboard
        </p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whop-pomegranate mx-auto"></div>
        </div>
        <div className="mt-6 text-sm text-slate-500">
          If you're not redirected automatically, click below:
        </div>
        <button 
          onClick={() => {
            const tenant = params?.tenant as string;
            if (tenant) {
              router.push(`/t/${tenant}/dashboard`);
            }
          }}
          className="mt-3 bg-whop-pomegranate text-white px-4 py-2 rounded-lg hover:bg-whop-pomegranate/90 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
