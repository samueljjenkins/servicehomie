"use client";

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TechnicianAnalytics() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) {
      // Simulate loading time for real data
      setTimeout(() => setLoading(false), 1000);
    }
  }, [isSignedIn]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Will redirect to login
  }

  return (
    <section className="py-20 min-h-[80vh] bg-gray-50">
      {/* Back Button */}
      <a href="/technician-dashboard" className="fixed top-4 left-4 z-50 bg-white border border-gray-200 rounded-full px-4 py-2 shadow hover:bg-gray-100 text-blue-700 font-semibold flex items-center gap-2 transition">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Dashboard
      </a>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-8 text-center">Your Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            {loading ? (
              <>
                <div className="h-8 bg-gray-200 rounded-md mb-2 w-24 animate-pulse mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded-md w-32 animate-pulse mx-auto"></div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600 mb-2">$0.00</div>
                <div className="text-gray-700">Total Earnings</div>
              </>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            {loading ? (
              <>
                <div className="h-8 bg-gray-200 rounded-md mb-2 w-16 animate-pulse mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded-md w-32 animate-pulse mx-auto"></div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600 mb-2">0</div>
                <div className="text-gray-700">Jobs Completed</div>
              </>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            {loading ? (
              <>
                <div className="h-8 bg-gray-200 rounded-md mb-2 w-16 animate-pulse mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded-md w-32 animate-pulse mx-auto"></div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-purple-600 mb-2">0</div>
                <div className="text-gray-700">Upcoming Jobs</div>
              </>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            {loading ? (
              <>
                <div className="h-8 bg-gray-200 rounded-md mb-2 w-20 animate-pulse mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded-md w-32 animate-pulse mx-auto"></div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-yellow-600 mb-2">$0.00</div>
                <div className="text-gray-700">Avg. Job Value</div>
              </>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">More Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <>
                <div className="h-6 bg-gray-200 rounded-md w-48 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-md w-40 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-md w-32 animate-pulse"></div>
              </>
            ) : (
              <>
                <div className="text-gray-700"><span className="font-semibold">Earnings (Last 30 Days):</span> $0.00</div>
                <div className="text-gray-700"><span className="font-semibold">Most Popular Service:</span> No bookings yet</div>
                <div className="text-gray-700"><span className="font-semibold">Last Job Date:</span> No jobs yet</div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 