"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';
import { getUserProfile } from '@/lib/auth-utils';

const statusOptions = ['On the Way', 'Arrived', 'In Progress', 'Completed'];

export default function TechnicianDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobStatuses, setJobStatuses] = useState<{ [key: number]: string }>({});
  const [tab, setTab] = useState<'upcoming' | 'reviews'>('upcoming');
  const [profile, setProfile] = useState<{ full_name?: string } | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        // Fetch profile from users table
        const profileData = await getUserProfile(session.user.id);
        setProfile(profileData);
      }
      setLoading(false);
    };
    getUser();
  }, [supabase]);

  const handleStatusChange = (jobId: number, status: string) => {
    setJobStatuses(prev => ({ ...prev, [jobId]: status }));
  };

  const mockUpcomingJobs: any[] = [];
  const mockReviews: any[] = [];
  const mockNotifications: any[] = [];
  const mockEarnings = 0;

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 min-h-[80vh] flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading your dashboard...</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-8 text-center">Technician Dashboard</h1>
        {/* Profile & Earnings */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {profile?.full_name || user?.email || ''}</h2>
            <p className="text-gray-600 mb-1">Email: {user?.email}</p>
            <p className="text-gray-600 mb-1">Service: {user?.user_metadata?.service_category || 'Not Set'}</p>
            <Link href="/technician-profile" className="mt-4 inline-block text-blue-600 hover:underline font-semibold">
              Edit Profile
            </Link>
            <div className="mt-6">
              <Link href="/technician-application" className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition">
                Start Selling
              </Link>
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="text-lg text-gray-500">Total Earnings</div>
            <div className="text-3xl font-bold text-green-600">${mockEarnings.toLocaleString()}</div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-6 mb-10">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Notifications</h3>
          <ul className="list-disc list-inside text-blue-900 space-y-1">
            {mockNotifications.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>

        {/* Tabs for Jobs and Reviews */}
        <div className="flex justify-end mb-6">
          <Link href="/technician-new-job" className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition">
            + Create Job
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded-md font-medium transition ${tab === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-blue-600 hover:bg-blue-50'}`}
              onClick={() => setTab('upcoming')}
            >
              Upcoming Jobs
            </button>
            <button
              className={`px-4 py-2 rounded-md font-medium transition ${tab === 'reviews' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-blue-600 hover:bg-blue-50'}`}
              onClick={() => setTab('reviews')}
            >
              Reviews
            </button>
          </div>
          {tab === 'upcoming' ? (
            <div>
              {mockUpcomingJobs.length === 0 ? (
                <p className="text-gray-500">No upcoming jobs.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {mockUpcomingJobs.map(job => (
                    <li key={job.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <span className="font-semibold text-blue-700">{job.service}</span> at <span className="font-semibold">{job.address}</span>
                        <span className="block text-gray-500 text-sm">{job.date}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        {statusOptions.map(status => (
                          <button
                            key={status}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${jobStatuses[job.id] === status ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
                            onClick={() => handleStatusChange(job.id, status)}
                            type="button"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div>
              {mockReviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {mockReviews.map(review => (
                    <li key={review.id} className="py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-blue-700">{review.reviewer}</span>
                        <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 