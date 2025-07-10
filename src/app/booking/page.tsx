"use client";
import { Suspense } from "react";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTechnicianById } from '@/lib/supabase-utils';
import { Technician } from '@/types/database';

const fallbackTechnician = {
  name: 'Alice Johnson',
  service: 'Window Cleaning',
  price: 120,
};

function BookingPageInner() {
  const searchParams = useSearchParams();
  const technicianId = searchParams.get('technician');
  const service = searchParams.get('service') || fallbackTechnician.service;
  const price = searchParams.get('price') ? Number(searchParams.get('price')) : fallbackTechnician.price;

  const [technician, setTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchTechnician() {
      if (!technicianId) {
        setLoading(false);
        return;
      }

      try {
        const tech = await getTechnicianById(Number(technicianId));
        setTechnician(tech);
      } catch (err) {
        console.error('Error fetching technician:', err);
        setError('Failed to load technician information');
      } finally {
        setLoading(false);
      }
    }

    fetchTechnician();
  }, [technicianId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 min-h-[80vh]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading technician information...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50 min-h-[80vh]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-10">
            <div className="text-center">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong className="font-bold">Error:</strong> {error}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const technicianName = technician?.name || fallbackTechnician.name;
  const technicianPrice = technician?.price || price;

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Book Your Service</h1>
          {submitted ? (
            <div className="text-center py-12">
              <span className="text-5xl block mb-4">🎉</span>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-700">Your booking with {technicianName} is confirmed. We look forward to serving you!</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Technician Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="font-semibold text-blue-700 text-lg">Technician: {technicianName}</div>
                <div className="text-gray-700">Service: {service}</div>
                <div className="text-gray-700">Price: <span className="font-bold text-green-600">${technicianPrice}</span></div>
                {technician && (
                  <div className="text-gray-700 mt-2">
                    <div>Location: {technician.location}</div>
                    <div>Experience: {technician.experience}</div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{technician.rating} ({technician.reviews} reviews)</span>
                    </div>
                  </div>
                )}
              </div>
              {/* Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Select Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              {/* Time */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Select Time</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              {/* Optional Message */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Message (optional)</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Add any details or requests for your technician..."
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition">Book Now</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingPageInner />
    </Suspense>
  );
} 