"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface Stat {
  label: string;
  value: string | number;
}

export default function AdminPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) {
      // Simulate loading time for real data
      setTimeout(() => {
        setStats([
          { label: 'Total Users', value: 0 },
          { label: 'Technicians', value: 0 },
          { label: 'Total Jobs', value: 0 },
          { label: 'Revenue', value: '$0' },
        ]);
        setLoading(false);
      }, 1000);
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
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => alert("Feature coming soon")}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <span>👤+</span>
              Onboard Technician
            </button>
            <button
              onClick={() => alert("Feature coming soon")}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <span>📋</span>
              Review Applications
            </button>
            <button
              onClick={() => alert("Feature coming soon")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>⚙️</span>
              Admin Tools
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6 text-center animate-pulse">
                <div className="h-8 bg-gray-200 rounded-md mb-2"></div>
                <div className="h-6 bg-gray-200 rounded-md"></div>
              </div>
            ))
          ) : (
            stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6 text-center">
                <div className="text-2xl font-bold text-blue-700 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))
          )}
        </div>
        
        {/* Placeholder for future detailed tables */}
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">More Insights Coming Soon</h2>
          <p className="text-gray-500">Detailed tables for recent users, jobs, and reviews will be added here.</p>
        </div>
      </div>
    </section>
  );
} 