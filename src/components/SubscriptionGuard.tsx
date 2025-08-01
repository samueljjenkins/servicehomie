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

      // Force fresh check by clearing any cached data
      console.log('SubscriptionGuard: Starting fresh subscription check');
      setLoading(true);
      setHasSubscription(false);

      try {
        console.log('SubscriptionGuard: Checking subscription for userId:', userId);
        const userProfile = await getUserProfile(userId);
        console.log('SubscriptionGuard: User profile found:', !!userProfile);
        
        if (userProfile) {
          const techProfile = await getTechnicianProfile(userProfile.id);
          console.log('SubscriptionGuard: Technician profile found:', !!techProfile);
          console.log('SubscriptionGuard: Tech profile data:', techProfile ? {
            subscription_status: techProfile.subscription_status,
            stripe_subscription_id: techProfile.stripe_subscription_id,
            has_stripe_id: !!techProfile.stripe_subscription_id
          } : 'No profile');
          
          if (techProfile) {
            // Check if user has an active subscription
            if (techProfile.subscription_status === 'active' && techProfile.stripe_subscription_id) {
              console.log('Active subscription found, allowing access');
              setHasSubscription(true);
            } else {
              console.log('No active subscription found, redirecting to subscription page');
              console.log('Status:', techProfile.subscription_status);
              console.log('Stripe ID:', techProfile.stripe_subscription_id);
              router.push('/subscription-required');
              return;
            }
          } else {
            // No technician profile found, redirect to subscription
            console.log('No technician profile found, redirecting to subscription page');
            router.push('/subscription-required');
            return;
          }
        } else {
          // No user profile found, redirect to subscription
          console.log('No user profile found, redirecting to subscription page');
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