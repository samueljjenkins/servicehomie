"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getTechnicianById, getReviewsByTechnician } from '@/lib/supabase-utils';
import { Technician, Review } from '@/types/database';

function renderStars(rating: number) {
  const roundedRating = Math.round(rating);
  return '★'.repeat(roundedRating) + '☆'.repeat(5 - roundedRating);
}

export default function TechnicianProfile() {
  const searchParams = useSearchParams();
  const technicianId = searchParams.get('id');

  const [technician, setTechnician] = useState<Technician | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTechnicianData() {
      if (!technicianId) {
        setError('No technician ID provided');
        setLoading(false);
        return;
      }

      try {
        // Fetch technician data
        const tech = await getTechnicianById(Number(technicianId));
        setTechnician(tech);

        // Fetch reviews for this technician
        const techReviews = await getReviewsByTechnician(Number(technicianId));
        setReviews(techReviews);
      } catch (err) {
        console.error('Error fetching technician data:', err);
        setError('Failed to load technician information');
      } finally {
        setLoading(false);
      }
    }

    fetchTechnicianData();
  }, [technicianId]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
            <p className="mt-6 text-lg text-gray-700 font-medium">Loading technician profile...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !technician) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
              <strong className="font-bold text-lg">Error:</strong> {error || 'Technician not found'}
            </div>
            <Link href="/marketplace" className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Marketplace
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/marketplace" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Marketplace
          </Link>
        </div>

        {/* Technician Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {technician.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            {/* Main Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold text-gray-900">{technician.name}</h1>
                {technician.verified && (
                  <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-2 text-xl">{renderStars(technician.rating)}</span>
                  <span className="font-semibold">{technician.rating.toFixed(1)}</span>
                  <span className="ml-1">({technician.reviews} reviews)</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {technician.location}
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  {technician.experience} experience
                </div>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed max-w-3xl">{technician.description}</p>
              
              <div className="flex flex-wrap gap-3">
                {technician.services.map((service) => (
                  <span key={service} className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full border border-blue-200">
                    {service}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Price & Booking */}
            <div className="text-center lg:text-right space-y-4">
              <div className="text-4xl font-bold text-green-600">${technician.price}</div>
              <div className="text-gray-500 text-sm">per service</div>
              <Link 
                href={`/booking?technician=${technician.id}&service=${technician.services[0]}&price=${technician.price}`}
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>

        {/* Services & Specialties */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Services Offered
            </h2>
            <div className="space-y-4">
              {technician.services.map((service) => (
                <div key={service} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-800 font-medium">{service}</span>
                  <span className="text-green-600 font-bold text-lg">${technician.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Specialties
            </h2>
            <div className="flex flex-wrap gap-3">
              {technician.specialties.map((specialty) => (
                <span key={specialty} className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2 rounded-full border border-gray-200">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Customer Reviews
          </h2>
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-yellow-400 text-xl">{renderStars(review.rating)}</span>
                    <span className="text-gray-600 font-medium">{review.rating}/5</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(review.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500 text-lg">No reviews yet. Be the first to review this technician!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 