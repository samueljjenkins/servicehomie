"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { detectTenant, isInWhopIframe } from "@/lib/tenant-utils";

export default function TenantPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [tenantInfo, setTenantInfo] = useState<{ id: string; source: string } | null>(null);

  useEffect(() => {
    // Use robust tenant detection utility
    const queryTenant = searchParams.get('tenant');
    const routeTenant = params?.tenant as string;
    
    const detected = detectTenant(queryTenant, routeTenant, 'demo');
    
    // Set tenant info and proceed with routing
    setTenantInfo({
      id: detected.id,
      source: detected.source
    });
    setIsLoading(false);
    
    // Route based on user role detection
    const isLikelyCreator = isInWhopIframe() && (
      document.referrer.includes('whop.com/dashboard') || 
      document.referrer.includes('whop.com/apps') ||
      searchParams.get('role') === 'creator' ||
      searchParams.get('type') === 'admin'
    );
    
    if (isLikelyCreator) {
      // Creator - go to dashboard
      router.replace(`/t/${detected.id}/dashboard`);
    } else {
      // Customer - go to booking page
      router.replace(`/t/${detected.id}/book`);
    }
  }, [params?.tenant, searchParams, router]);

  // Show loading while detecting tenant
  if (isLoading) {
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
              Initializing...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show redirect message once tenant is detected
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
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Tenant: {tenantInfo?.id}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Source: {tenantInfo?.source}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting...
          </p>
        </div>
      </div>
    </div>
  );
}
