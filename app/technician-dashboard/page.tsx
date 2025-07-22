"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function TechnicianDashboard() {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700 mb-2 drop-shadow">Welcome to Your Dashboard</h1>
          <div className="text-lg text-gray-600 mb-4">Manage your business, bookings, and analytics all in one place.</div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link href="/technician-page" className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg shadow hover:bg-green-700 transition text-center">
              View Landing Page
            </Link>
            <Link href="/technician-page/edit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg shadow hover:bg-blue-700 transition text-center">
              Edit Your Landing Page
            </Link>
            <Link href="/technician-analytics" className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold text-lg shadow hover:bg-purple-700 transition text-center">
              View Analytics
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center flex flex-col items-center">
            {loading ? (
              <>
                <div className="h-8 bg-gray-200 rounded-md mb-2 w-24 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-md w-32 animate-pulse"></div>
              </>
            ) : (
              <>
                <div className="text-4xl font-extrabold text-green-600 mb-2">$0.00</div>
                <div className="text-lg text-gray-700 font-medium">Total Earnings</div>
              </>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center flex flex-col items-center">
            {loading ? (
              <>
                <div className="h-8 bg-gray-200 rounded-md mb-2 w-16 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-md w-32 animate-pulse"></div>
              </>
            ) : (
              <>
                <div className="text-4xl font-extrabold text-blue-600 mb-2">0</div>
                <div className="text-lg text-gray-700 font-medium">Jobs Completed</div>
              </>
            )}
          </div>
        </div>

        {/* Job Status Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Job Status Update</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => alert("No active jobs to update")}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-yellow-600 transition"
            >
              On the Way
            </button>
            <button
              onClick={() => alert("No active jobs to update")}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-600 transition"
            >
              Arrived
            </button>
            <button
              onClick={() => alert("No active jobs to update")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition"
            >
              Job Complete
            </button>
          </div>
        </div>

        {/* Earnings Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Earnings Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {loading ? (
              <>
                <div className="h-6 bg-gray-200 rounded-md w-32 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-md w-32 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-md w-32 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-md w-32 animate-pulse"></div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Earnings This Week</p>
                  <p className="text-xl font-semibold text-green-600">$0.00</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Earnings This Month</p>
                  <p className="text-xl font-semibold text-green-600">$0.00</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Most Booked Service</p>
                  <p className="text-xl font-semibold text-blue-600">No bookings yet</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Next Payout</p>
                  <p className="text-xl font-semibold text-purple-600">No earnings yet</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
