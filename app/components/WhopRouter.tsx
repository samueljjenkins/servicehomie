"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type UserRole = 'creator' | 'customer' | 'loading';

export default function WhopRouter({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const [userRole, setUserRole] = useState<UserRole>('loading');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function determineUserRole() {
      try {
        const tenant = params?.tenant as string;
        if (!tenant) {
          setIsChecking(false);
          return;
        }

        // Check if we're in a Whop iframe
        const isInWhop = window.location !== window.parent.location;
        
        // For now, we'll use a simple heuristic:
        // - If accessing from Whop dashboard (likely creator)
        // - If accessing from Whop experience (likely customer)
        // - We can enhance this later with proper user detection
        
        // Check URL parameters or referrer for hints
        const urlParams = new URLSearchParams(window.location.search);
        const isCreator = urlParams.get('role') === 'creator' || 
                         urlParams.get('type') === 'admin' ||
                         document.referrer.includes('whop.com/dashboard');
        
        if (isCreator) {
          setUserRole('creator');
          // Redirect to dashboard if not already there
          const currentPath = window.location.pathname;
          if (currentPath === `/t/${tenant}` || currentPath === `/t/${tenant}/`) {
            router.push(`/t/${tenant}/dashboard`);
          }
        } else {
          setUserRole('customer');
          // Redirect to booking page if not already there
          const currentPath = window.location.pathname;
          if (currentPath === `/t/${tenant}` || currentPath === `/t/${tenant}/`) {
            router.push(`/t/${tenant}/book`);
          }
        }
      } catch (error) {
        console.error('Error determining user role:', error);
        // Default to customer on error
        setUserRole('customer');
        
        const tenant = params?.tenant as string;
        if (tenant) {
          const currentPath = window.location.pathname;
          if (currentPath === `/t/${tenant}` || currentPath === `/t/${tenant}/`) {
            router.push(`/t/${tenant}/book`);
          }
        }
      } finally {
        setIsChecking(false);
      }
    }

    determineUserRole();
  }, [params.tenant, router]);

  // Show loading while determining user role
  if (isChecking) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-whop-pomegranate rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Checking Access...
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Determining your role in this Whop experience
          </p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whop-pomegranate mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Render children once role is determined
  return <>{children}</>;
}
