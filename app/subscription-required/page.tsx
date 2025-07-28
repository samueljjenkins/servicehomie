"use client";

import { useAuth, useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { getUserProfile, getTechnicianProfile, createUserProfile, createTechnicianProfile } from '@/lib/supabase-utils';
import { createSubscriptionCheckoutSession } from '@/lib/stripe';
import Link from 'next/link';

export default function SubscriptionRequired() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [technicianProfileId, setTechnicianProfileId] = useState('');
  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function loadTechnicianData() {
      if (!isSignedIn || !userId || !user) return;
      
      try {
        // Get user email from Clerk
        if (user?.emailAddresses?.[0]?.emailAddress) {
          setUserEmail(user.emailAddresses[0].emailAddress);
        }

        // Try to get existing user profile
        let userProfile = await getUserProfile(userId);
        
        // If user profile doesn't exist, create it
        if (!userProfile) {
          console.log('Creating user profile for:', userId);
          userProfile = await createUserProfile(user as any);
        }

        // Try to get existing technician profile
        let techProfile = await getTechnicianProfile(userProfile.id);
        
        // If technician profile doesn't exist, create it
        if (!techProfile) {
          console.log('Creating technician profile for:', userProfile.id);
          techProfile = await createTechnicianProfile(userProfile.id, {
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'New Technician',
            email: user.emailAddresses[0]?.emailAddress || '',
            location: '',
            bio: '',
            services: []
          });
        }

        if (techProfile) {
          setTechnicianProfileId(techProfile.id);
          setName(techProfile.name || '');
        }
      } catch (error) {
        console.error('Error loading/creating technician data:', error);
      } finally {
        setInitializing(false);
      }
    }

    loadTechnicianData();
  }, [isSignedIn, userId, user]);

  const handleSubscribe = async () => {
    if (!technicianProfileId || !userEmail) {
      alert('Please wait while we load your account information...');
      return;
    }
    
    setLoading(true);
    try {
      const session = await createSubscriptionCheckoutSession(
        userEmail,
        technicianProfileId
      );
      
      if (session?.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Error creating checkout session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl">🔒</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h1>
            <p className="text-gray-600 mb-6">Please sign in to access this page.</p>
            <Link
              href="/login"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (initializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl">⏳</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Setting Up Your Account</h1>
            <p className="text-gray-600 mb-6">Please wait while we prepare your profile...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-4xl">💳</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Subscription Required</h1>
            <p className="text-xl text-gray-600">
              {name ? `Hi ${name}!` : 'Welcome!'} You need an active subscription to access Service Homie.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border-2 border-blue-200 mb-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">🚀</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Starter Plan</h2>
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">$19</span>
                <span className="text-xl text-gray-600">/month</span>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Professional landing page</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Calendly booking integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Service display & pricing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Google Reviews integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Mobile responsive design</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Profile photo upload</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSubscribe}
              disabled={loading || !technicianProfileId || !userEmail}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Subscribe Now - $19/month'}
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Cancel anytime. No setup fees or hidden charges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 