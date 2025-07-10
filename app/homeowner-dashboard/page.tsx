"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { getBookingsByUser } from '@/lib/supabase-utils';
import { Booking } from '@/types/database';
import { useRouter } from 'next/navigation';

export default function HomeownerDashboard() {
  const { user, profile, loading: userLoading } = useUser();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!userLoading && profile?.user_type === 'admin') {
      router.replace('/admin');
    }
  }, [profile, userLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        try {
          setLoadingBookings(true);
          const userBookings = await getBookingsByUser(user.id, 'homeowner');
          setBookings(userBookings);
        } catch (error) {
          console.error('Error fetching bookings:', error);
          // Optionally set an error state to show in the UI
        } finally {
          setLoadingBookings(false);
        }
      };
      fetchBookings();
    }
  }, [user]);

  if (userLoading || profile?.user_type === 'admin') {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">You must be logged in to view this page.</p>
        <Link href="/login" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
          Go to Login
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {profile?.full_name || user.email}!
          </h1>
          <Link href="/marketplace" className="mt-4 md:mt-0 inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
            Browse Services
          </Link>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Profile Info */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                <div className="space-y-2">
                  <p><span className="font-semibold">Name:</span> {profile?.full_name}</p>
                  <p><span className="font-semibold">Email:</span> {user.email}</p>
                  <p><span className="font-semibold">Phone:</span> {profile?.phone}</p>
                </div>
                <Link href="/homeowner-profile" className="mt-4 inline-block text-blue-600 hover:underline">
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Job History */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Job History</h3>
                </div>
                <div className="p-6">
                  {loadingBookings ? (
                    <p>Loading bookings...</p>
                  ) : bookings.length > 0 ? (
                    <ul className="space-y-4">
                      {bookings.map(booking => (
                        <li key={booking.id} className="border p-4 rounded-md flex justify-between items-center">
                          <div>
                            <p className="font-bold">{booking.service}</p>
                            <p className="text-sm text-gray-600">
                              Date: {new Date(booking.scheduled_date).toLocaleDateString()} at {booking.scheduled_time}
                            </p>
                            <p className="text-sm text-gray-600">Status: 
                              <span className={`capitalize px-2 py-1 rounded-full text-xs ml-2 ${
                                booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {booking.status}
                              </span>
                            </p>
                          </div>
                          <Link href={`/jobs/${booking.id}`} className="text-blue-600 hover:underline">
                            View Details
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">You have no past or upcoming jobs.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
} 