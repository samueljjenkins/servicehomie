"use client";

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile, getTechnicianProfile } from '@/lib/supabase-utils';
import { checkSubscriptionStatus } from '@/lib/subscription-utils';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export default function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { isSignedIn, userId } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      if (!isSignedIn || !userId) {
        setLoading(false);
        return;
      }

      try {
        const userProfile = await getUserProfile(userId);
        if (userProfile) {
          const techProfile = await getTechnicianProfile(userProfile.id);
          if (techProfile) {
            const subscriptionStatus = await checkSubscriptionStatus(techProfile.id);
            
            if (!subscriptionStatus.isActive) {
              router.push('/subscription-required');
              return;
            }
            
            setHasSubscription(true);
          } else {
            // No technician profile found, redirect to subscription
            router.push('/subscription-required');
            return;
          }
        } else {
          // No user profile found, redirect to subscription
          router.push('/subscription-required');
          return;
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        router.push('/subscription-required');
        return;
      }

      setLoading(false);
    }

    checkSubscription();
  }, [isSignedIn, userId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking subscription status...</p>
        </div>
      </div>
    );
  }

  if (!hasSubscription) {
    return null; // Will redirect to subscription page
  }

  return <>{children}</>;
} 