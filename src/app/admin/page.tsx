"use client";
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Stat {
  label: string;
  value: string | number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all stats in parallel
        const [
          { count: totalUsers },
          { count: totalTechnicians },
          { count: totalJobs },
          { data: revenueData, error: revenueError }
        ] = await Promise.all([
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('users').select('*', { count: 'exact', head: true }).eq('user_type', 'technician'),
          supabase.from('bookings').select('*', { count: 'exact', head: true }),
          supabase.from('bookings').select('price').eq('status', 'completed')
        ]);

        if (revenueError) throw revenueError;

        const totalRevenue = revenueData.reduce((sum, booking) => sum + (booking.price || 0), 0);

        setStats([
          { label: 'Total Users', value: totalUsers ?? 0 },
          { label: 'Technicians', value: totalTechnicians ?? 0 },
          { label: 'Total Jobs', value: totalJobs ?? 0 },
          { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}` },
        ]);

      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [supabase]);

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600">Admin Dashboard</h1>
          <div className="flex gap-4">
            <a
              href="/technician-onboarding"
              className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <span>👤+</span>
              Onboard Technician
            </a>
            <a
              href="/admin/applications"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <span>📋</span>
              Review Applications
            </a>
            <a
              href="/admin-tools"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>⚙️</span>
              Admin Tools
            </a>
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