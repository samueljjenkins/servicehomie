"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TenantPage({ params }: { params: Promise<{ tenant: string }> }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [tenant, setTenant] = useState<string>('');

  useEffect(() => {
    // Extract tenant from params
    params.then(({ tenant: tenantParam }) => {
      setTenant(tenantParam);
      // This is the main tenant page that Whop loads
      // We'll redirect to the dashboard by default
      // In production, you might want to check user permissions here
      
      // Simulate a brief loading state
      const timer = setTimeout(() => {
        router.push(`/t/${tenantParam}/dashboard`);
      }, 100);

      return () => clearTimeout(timer);
    });
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
      </div>
    </div>
  );
}
