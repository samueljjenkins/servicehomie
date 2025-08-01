"use client";

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { getUserProfile, getTechnicianProfile } from '@/lib/supabase-utils';

export default function DebugSubscription() {
  const { isSignedIn, userId } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDebugInfo() {
      if (!isSignedIn || !userId) {
        setDebugInfo({ error: 'Not signed in' });
        setLoading(false);
        return;
      }

      try {
        console.log('Debug: Getting user profile for:', userId);
        const userProfile = await getUserProfile(userId);
        console.log('Debug: User profile:', userProfile);

        if (userProfile) {
          const techProfile = await getTechnicianProfile(userProfile.id);
          console.log('Debug: Tech profile:', techProfile);

          setDebugInfo({
            userId,
            userProfile,
            techProfile,
            hasActiveSubscription: techProfile ? 
              (techProfile.subscription_status === 'active' && techProfile.stripe_subscription_id) : false,
            subscriptionStatus: techProfile?.subscription_status,
            stripeSubscriptionId: techProfile?.stripe_subscription_id
          });
        } else {
          setDebugInfo({
            userId,
            userProfile: null,
            techProfile: null,
            hasActiveSubscription: false,
            subscriptionStatus: null,
            stripeSubscriptionId: null
          });
        }
      } catch (error) {
        console.error('Debug: Error getting info:', error);
        setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' });
      }

      setLoading(false);
    }

    getDebugInfo();
  }, [isSignedIn, userId]);

  if (loading) {
    return <div>Loading debug info...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Subscription Debug Info</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Current State:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      <div className="bg-blue-100 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Summary:</h2>
        <ul className="list-disc list-inside">
          <li>User ID: {debugInfo?.userId || 'Not available'}</li>
          <li>User Profile: {debugInfo?.userProfile ? 'Found' : 'Not found'}</li>
          <li>Tech Profile: {debugInfo?.techProfile ? 'Found' : 'Not found'}</li>
          <li>Subscription Status: {debugInfo?.subscriptionStatus || 'None'}</li>
          <li>Stripe Subscription ID: {debugInfo?.stripeSubscriptionId || 'None'}</li>
          <li>Has Active Subscription: {debugInfo?.hasActiveSubscription ? 'Yes' : 'No'}</li>
        </ul>
      </div>

      <div className="bg-yellow-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Actions:</h2>
        <button 
          onClick={() => window.location.href = '/subscription-required'}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Go to Subscription Required
        </button>
        <button 
          onClick={() => window.location.href = '/technician-dashboard'}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Go to Dashboard
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
} 