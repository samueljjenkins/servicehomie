"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for tenant in query parameters
    const queryTenant = searchParams.get('tenant');
    
    if (queryTenant) {
      // Redirect to tenant route with query param
      router.replace(`/t/${queryTenant}?tenant=${queryTenant}`);
    } else {
      // No tenant specified, redirect to default demo tenant
      router.replace('/t/demo');
    }
    
    // Set loading to false after redirect
    setIsLoading(false);
  }, [searchParams, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-whop-pomegranate rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Service Homie
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting to your experience...
          </p>
        </div>
      </div>
    </div>
  );
}
