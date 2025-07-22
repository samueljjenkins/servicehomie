"use client";

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TechnicianAnalytics() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isLoaded, isSignedIn, router]);

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

  // Mock analytics data
  const stats = {
    earnings: 2450.75,
    jobsCompleted: 38,
    upcomingJobs: 3,
    avgJobValue: 64.5,
    last30Days: 720.0,
    mostPopularService: "Window Cleaning",
    lastJobDate: "2024-07-10",
  };

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
            <div className="text-2xl font-bold text-green-600 mb-2">${stats.earnings.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
            <div className="text-gray-700">Total Earnings</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{stats.jobsCompleted}</div>
            <div className="text-gray-700">Jobs Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">{stats.upcomingJobs}</div>
            <div className="text-gray-700">Upcoming Jobs</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">${stats.avgJobValue.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
            <div className="text-gray-700">Avg. Job Value</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">More Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-gray-700"><span className="font-semibold">Earnings (Last 30 Days):</span> ${stats.last30Days.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
            <div className="text-gray-700"><span className="font-semibold">Most Popular Service:</span> {stats.mostPopularService}</div>
            <div className="text-gray-700"><span className="font-semibold">Last Job Date:</span> {stats.lastJobDate}</div>
          </div>
        </div>
      </div>
    </section>
  );
} 