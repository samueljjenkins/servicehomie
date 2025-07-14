"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Technician } from '@/types/database';
import { getTechnicians } from '@/lib/supabase-utils';

export default function GutterCleaningMarketplace() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTechnicians() {
      try {
        setLoading(true);
        // This service name must exactly match what's in your 'services' array in the database
        const data = await getTechnicians('Gutter Cleaning'); 
        setTechnicians(data);
      } catch (err) {
        setError('Failed to load technicians. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadTechnicians();
  }, []);

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Gutter Cleaning</h1>
          <p className="text-lg text-gray-500">Keep your gutters clear and your home protected. Book a top-rated pro below:</p>
        </div>

        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading technicians...</p>
          </div>
        )}

        {error && (
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {technicians.map((tech) => (
              <div key={tech.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-400 text-3xl">
                  {/* Placeholder for avatar */}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{tech.name}</h3>
                <div className="text-blue-700 font-bold text-lg mb-1">${tech.price}</div>
                <div className="text-gray-500 text-sm mb-2">{tech.location}</div>
                <div className="flex gap-2">
                  <Link href={`/booking?technician=${tech.id}&service=Gutter%20Cleaning&price=${tech.price}`} className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition">Book Now</Link>
                  <Link href={`/technician-profile?id=${tech.id}`} className="bg-gray-100 text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition">View Profile</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 