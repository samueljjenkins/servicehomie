"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Job, Technician } from '@/types/database';
import { getJobsByService } from '@/lib/supabase-utils';

function renderStars(rating: number) {
  const roundedRating = Math.round(rating);
  return '★'.repeat(roundedRating) + '☆'.repeat(5 - roundedRating);
}

export default function WindowCleaningMarketplace() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const data = await getJobsByService('Window Cleaning');
        setJobs(data || []);
      } catch (err) {
        setError('Failed to load jobs. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Window Cleaning</h1>
          <p className="text-lg text-gray-500">Professional window cleaning for a streak-free shine. Book a top-rated pro below:</p>
        </div>

        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        )}

        {error && (
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                No window cleaning jobs are currently available. Please check back later.
              </div>
            ) : jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-400 text-3xl">
                  {/* Placeholder for avatar */}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.technician?.name || 'Technician'}</h3>
                {job.technician && (
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 mr-1">{renderStars(job.technician.rating)}</span>
                    <span className="text-gray-600 text-sm">({job.technician.rating?.toFixed(1) || '0.0'})</span>
                  </div>
                )}
                <div className="text-blue-700 font-bold text-lg mb-1">${job.price}</div>
                <div className="text-gray-700 text-sm mb-2">{job.description}</div>
                <div className="text-gray-400 text-xs mb-4">{job.technician?.reviews || 0} reviews</div>
                <div className="flex gap-2">
                  <Link href={`/booking?technician=${job.technician_id}&service=Window%20Cleaning&price=${job.price}`} className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition">Book Now</Link>
                  <Link href={`/technician-profile?id=${job.technician_id}`} className="bg-gray-100 text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition">View Profile</Link>
                  <Link href={`/technician-public-profile?id=${job.technician_id}`} className="bg-green-100 text-green-700 px-4 py-2 rounded-md font-medium hover:bg-green-200 transition">View Public Profile</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 