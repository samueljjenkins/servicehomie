"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function TenantPage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const tenant = params?.tenant as string;
    
    if (tenant) {
      // Simple, fast routing logic
      // Check if we're likely a creator (coming from Whop dashboard)
      const isLikelyCreator = document.referrer.includes('whop.com/dashboard') || 
                             document.referrer.includes('whop.com/apps') ||
                             window.location.search.includes('admin') ||
                             window.location.search.includes('creator');
      
      if (isLikelyCreator) {
        // Creator - go to dashboard
        router.replace(`/t/${tenant}/dashboard`);
      } else {
        // Customer - go to booking page
        router.replace(`/t/${tenant}/book`);
      }
    }
  }, [params.tenant, router]);

  // Show minimal loading while redirecting
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
            Redirecting...
          </p>
        </div>
      </div>
    </div>
  );
}
