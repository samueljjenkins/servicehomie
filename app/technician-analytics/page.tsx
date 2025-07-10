"use client";
import { useState } from 'react';

const mockStats = {
  earnings: 4820.75,
  jobsCompleted: 38,
  avgRating: 4.85,
  upcomingJobs: 3,
};

const mockEarningsData = [
  { month: 'Jan', amount: 600 },
  { month: 'Feb', amount: 800 },
  { month: 'Mar', amount: 950 },
  { month: 'Apr', amount: 700 },
  { month: 'May', amount: 900 },
  { month: 'Jun', amount: 870 },
  { month: 'Jul', amount: 1000 },
];

const mockRecentReviews = [
  {
    id: 1,
    reviewer: 'Sarah Johnson',
    rating: 5,
    date: '2024-07-01',
    content: 'Excellent work! Very professional and thorough. Highly recommend.',
  },
  {
    id: 2,
    reviewer: 'David Thompson',
    rating: 4,
    date: '2024-06-28',
    content: 'Good job overall, but arrived a bit late.',
  },
  {
    id: 3,
    reviewer: 'Emily Rodriguez',
    rating: 5,
    date: '2024-06-20',
    content: 'Amazing service and great communication throughout.',
  },
];

function renderStars(rating: number) {
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
}

export default function TechnicianAnalyticsPage() {
  const [stats] = useState(mockStats);
  const [earningsData] = useState(mockEarningsData);
  const [recentReviews] = useState(mockRecentReviews);

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-8 text-center">Technician Analytics Dashboard</h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-2xl font-bold text-blue-700">${stats.earnings.toLocaleString()}</div>
              <div className="text-gray-600 text-sm mt-1">Total Earnings</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-2xl mb-2">🧹</div>
              <div className="text-2xl font-bold text-green-700">{stats.jobsCompleted}</div>
              <div className="text-gray-600 text-sm mt-1">Jobs Completed</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-6 text-center">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.avgRating.toFixed(2)}</div>
              <div className="text-gray-600 text-sm mt-1">Average Rating</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <div className="text-2xl mb-2">📅</div>
              <div className="text-2xl font-bold text-purple-700">{stats.upcomingJobs}</div>
              <div className="text-gray-600 text-sm mt-1">Upcoming Jobs</div>
            </div>
          </div>

          {/* Earnings Chart */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Earnings (Last 7 Months)</h2>
            <div className="w-full h-48 flex items-end gap-4">
              {earningsData.map((data, idx) => (
                <div key={data.month} className="flex flex-col items-center flex-1">
                  <div
                    className="w-8 rounded-t bg-blue-600 mb-2"
                    style={{ height: `${data.amount / 12}px`, minHeight: '10px' }}
                    title={`$${data.amount}`}
                  ></div>
                  <span className="text-xs text-gray-500">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Reviews</h2>
            <div className="space-y-4">
              {recentReviews.map(review => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-400">{renderStars(review.rating)}</span>
                    <span className="font-semibold text-gray-900">{review.reviewer}</span>
                    <span className="text-gray-500 text-xs">{review.date}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 