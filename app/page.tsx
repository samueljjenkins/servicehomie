"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWhopUser } from '@/lib/hooks/useWhopUser';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useWhopUser();
  const [isRouting, setIsRouting] = useState(false);

  useEffect(() => {
    if (loading || isRouting) return;

    const routeUser = async () => {
      setIsRouting(true);
      
      try {
        // Check if we're in a Whop iframe
        const isInWhopIframe = window.location !== window.parent.location;
        
        if (isInWhopIframe) {
          // We're in Whop - route based on user role
          if (user?.company_id) {
            // User has a company - they're a creator
            console.log('Routing creator to dashboard');
            router.replace('/dashboard');
          } else {
            // User doesn't have a company - they're a customer
            console.log('Routing customer to booking');
            router.replace('/book');
          }
        } else {
          // We're not in Whop - show landing page
          console.log('Not in Whop iframe, showing landing page');
        }
      } catch (error) {
        console.error('Error routing user:', error);
        // Fallback to landing page
      } finally {
        setIsRouting(false);
      }
    };

    routeUser();
  }, [user, loading, router, isRouting]);

  // Show loading while determining routing
  if (loading || isRouting) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-whop-pomegranate rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Loading...
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Getting everything ready for you
          </p>
        </div>
      </div>
    );
  }

  // Landing page content (only shown when not in Whop iframe)
  return (
    <div className="min-h-screen bg-white dark:bg-whop-bg-dark">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-whop-blue via-whop-blue/90 to-whop-blue/80 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              ServiceHomie
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              The easiest way to manage your service business and let customers book appointments online
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-whop-blue font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Get Started
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-whop-blue transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50 dark:bg-whop-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to run your service business
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              From managing services to handling bookings, we've got you covered
            </p>
          </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-whop-bg-dark rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-whop-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Manage Services
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage your services with pricing, descriptions, and availability
              </p>
            </div>

                          <div className="bg-white dark:bg-whop-bg-dark rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-whop-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-whop-text dark:text-whop-text-dark mb-4 font-inter">
                  Set Availability
                </h3>
                <p className="text-whop-text dark:text-whop-text-dark font-inter">
                  Set your working hours and availability for each day of the week
                </p>
              </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-whop-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Accept Bookings
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Let customers book appointments online with secure payments through Whop
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-whop-blue">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to streamline your service business?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of service providers who trust ServiceHomie to manage their bookings
          </p>
                        <button className="px-8 py-4 bg-white text-whop-blue font-semibold rounded-lg hover:bg-gray-100 transition-colors">
            Start Free Trial
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 ServiceHomie. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
