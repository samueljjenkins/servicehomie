"use client";
import { useState } from 'react';
import { useParams } from 'next/navigation';

// Mock job/technician data
const mockJob = {
  service: 'Window Cleaning',
  technician: 'Alice Johnson',
};

export default function ReviewSubmissionPage() {
  const { jobId } = useParams();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Leave a Review</h1>
          <div className="mb-6 text-center text-gray-500">Job ID: <span className="font-mono">{jobId}</span></div>
          <div className="mb-6 bg-blue-50 rounded-lg p-4 text-center">
            <div className="font-semibold text-blue-700 text-lg">Technician: {mockJob.technician}</div>
            <div className="text-gray-700">Service: {mockJob.service}</div>
          </div>
          {submitted ? (
            <div className="text-center py-12">
              <span className="text-5xl block mb-4">⭐️</span>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Thank you for your review!</h2>
              <p className="text-gray-700">Your feedback helps us improve our service.</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Rating</label>
                <div className="flex gap-2 text-2xl">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Review</label>
                <textarea
                  value={review}
                  onChange={e => setReview(e.target.value)}
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Share your experience..."
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition">Submit Review</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
} 