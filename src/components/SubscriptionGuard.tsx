"use client";

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getUserProfile, getTechnicianProfile } from '@/lib/supabase-utils';
import { checkSubscriptionStatus } from '@/lib/subscription-utils';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export default function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { isSignedIn, userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);

  // Immediate debugging
  console.log('🔒 SUBSCRIPTION GUARD RENDERED');
  console.log('🔒 IsSignedIn:', isSignedIn);
  console.log('🔒 UserId:', userId);
  console.log('🔒 Pathname:', pathname);
  console.log('🔒 Loading:', loading);
  console.log('🔒 HasSubscription:', hasSubscription);

  const checkSubscription = useCallback(async () => {
    if (!isSignedIn || !userId) {
      console.log('SubscriptionGuard: Not signed in or no userId');
      setLoading(false);
      return false;
    }

    // Force fresh check by clearing any cached data
    console.log('SubscriptionGuard: Starting fresh subscription check for path:', pathname);
    console.log('SubscriptionGuard: Current userId:', userId);
    setLoading(true);
    setHasSubscription(false);

    try {
      console.log('SubscriptionGuard: Checking subscription for userId:', userId);
      const userProfile = await getUserProfile(userId);
      console.log('SubscriptionGuard: User profile found:', !!userProfile);
      console.log('SubscriptionGuard: User profile data:', userProfile);
      
      if (userProfile) {
        const techProfile = await getTechnicianProfile(userProfile.id);
        console.log('SubscriptionGuard: Technician profile found:', !!techProfile);
        console.log('SubscriptionGuard: Full tech profile data:', techProfile);
        console.log('SubscriptionGuard: Tech profile data:', techProfile ? {
          subscription_status: techProfile.subscription_status,
          stripe_subscription_id: techProfile.stripe_subscription_id,
          has_stripe_id: !!techProfile.stripe_subscription_id
        } : 'No profile');
        
        if (techProfile) {
          // Check if user has an active subscription with real Stripe ID
          const hasActiveSubscription = techProfile.subscription_status === 'active' && 
                                      techProfile.stripe_subscription_id && 
                                      techProfile.stripe_subscription_id.trim() !== '';
          
          console.log('SubscriptionGuard: Has active subscription?', hasActiveSubscription);
          console.log('SubscriptionGuard: Status:', techProfile.subscription_status);
          console.log('SubscriptionGuard: Stripe ID:', techProfile.stripe_subscription_id);
          
          if (hasActiveSubscription) {
            console.log('Active subscription found, allowing access');
            setHasSubscription(true);
            setLoading(false);
            return true;
          } else {
            console.log('No active subscription found, redirecting to subscription page');
            console.log('Status:', techProfile.subscription_status);
            console.log('Stripe ID:', techProfile.stripe_subscription_id);
            console.log('Redirecting to /subscription-required');
            router.push('/subscription-required');
            setLoading(false);
            return false;
          }
        } else {
          // No technician profile found, redirect to subscription
          console.log('No technician profile found, redirecting to subscription page');
          router.push('/subscription-required');
          setLoading(false);
          return false;
        }
      } else {
        // No user profile found, redirect to subscription
        console.log('No user profile found, redirecting to subscription page');
        router.push('/subscription-required');
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      console.log('Error occurred, redirecting to subscription page');
      router.push('/subscription-required');
      setLoading(false);
      return false;
    }
  }, [isSignedIn, userId, router, pathname]);

  // Check subscription on mount and route changes
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Check subscription when window gains focus (user comes back to tab)
  useEffect(() => {
    const handleFocus = () => {
      console.log('SubscriptionGuard: Window focused, re-checking subscription');
      if (!loading && isSignedIn && userId) {
        checkSubscription();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [checkSubscription, loading, isSignedIn, userId]);

  // Check subscription on visibility change (user switches tabs)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !loading && isSignedIn && userId) {
        console.log('SubscriptionGuard: Page visible, re-checking subscription');
        checkSubscription();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [checkSubscription, loading, isSignedIn, userId]);

  // Also check subscription on every render when not loading
  useEffect(() => {
    if (!loading && isSignedIn && userId && !hasSubscription) {
      console.log('SubscriptionGuard: Re-checking subscription on render');
      router.push('/subscription-required');
    }
  }, [loading, isSignedIn, userId, hasSubscription, router]);

  // Force redirect if no subscription - this runs on every render
  useEffect(() => {
    if (!loading && isSignedIn && userId) {
      console.log('SubscriptionGuard: Force checking subscription status');
      console.log('SubscriptionGuard: Loading:', loading);
      console.log('SubscriptionGuard: IsSignedIn:', isSignedIn);
      console.log('SubscriptionGuard: UserId:', userId);
      console.log('SubscriptionGuard: HasSubscription:', hasSubscription);
      
      if (!hasSubscription) {
        console.log('SubscriptionGuard: No subscription found, forcing redirect');
        router.push('/subscription-required');
      }
    }
  });

  // Immediate redirect if no subscription - this runs on every render
  useEffect(() => {
    if (!loading && isSignedIn && userId && !hasSubscription) {
      console.log('SubscriptionGuard: IMMEDIATE REDIRECT - No subscription');
      router.push('/subscription-required');
    }
  });

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
    console.log('SubscriptionGuard: No subscription, returning null');
    return null; // Will redirect to subscription page
  }

  console.log('SubscriptionGuard: Subscription valid, rendering children');
  return <>{children}</>;
} 