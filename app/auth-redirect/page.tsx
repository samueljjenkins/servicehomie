"use client";

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      // Check if user is admin (you can customize this logic based on your needs)
      const isAdmin = user.emailAddresses.some(email => 
        email.emailAddress === 'samuel@servicehomie.com'
      );

      if (isAdmin) {
        router.replace('/admin');
      } else {
        // Default to technician dashboard for other users
        router.replace('/technician-dashboard');
      }
    }
  }, [user, isLoaded, router]);

  // Show loading state while determining redirect
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
} 