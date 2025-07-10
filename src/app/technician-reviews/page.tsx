"use client";
import { useState } from 'react';

const mockTechnician = {
  id: 1,
  name: 'John Smith',
  service: 'Window Cleaning',
  rating: 4.8,
  totalReviews: 127,
  location: 'New York, NY',
  verified: true,
  memberSince: '2022',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
};

const mockReviews = [
  {
    id: 1,
    reviewer: 'Sarah Johnson',
    rating: 5,
    date: '2024-01-15',
    title: 'Excellent service and very professional',
    content: 'John did an amazing job cleaning our windows. He was punctual, professional, and the results were outstanding. Our windows look brand new! Highly recommend.',
    service: 'Window Cleaning',
    verified: true,
    helpful: 12,
    technicianResponse: {
      date: '2024-01-16',
      content: 'Thank you Sarah! I\'m glad you were happy with the service. It was a pleasure working with you.',
    },
  },
  {
    id: 2,
    reviewer: 'Mike Chen',
    rating: 4,
    date: '2024-01-12',
    title: 'Good work, but a bit pricey',
    content: 'The window cleaning was done well and John was professional. However, I found the price to be a bit higher than expected. Quality was good though.',
    service: 'Window Cleaning',
    verified: true,
    helpful: 8,
  },
  {
    id: 3,
    reviewer: 'Emily Rodriguez',
    rating: 5,
    date: '2024-01-10',
    title: 'Fantastic job on difficult windows',
    content: 'We have some very high windows that are hard to reach, but John handled them perfectly. He was careful, thorough, and left everything spotless. Great communication throughout the process.',
    service: 'Window Cleaning',
    verified: true,
    helpful: 15,
  },
  {
    id: 4,
    reviewer: 'David Thompson',
    rating: 3,
    date: '2024-01-08',
    title: 'Decent work, but missed some spots',
    content: 'Overall the service was okay, but I noticed some spots were missed on the higher windows. John was friendly and professional, but the quality could have been better.',
    service: 'Window Cleaning',
    verified: false,
    helpful: 3,
    technicianResponse: {
      date: '2024-01-09',
      content: 'I apologize for missing those spots. I\'d be happy to come back and address any areas that weren\'t cleaned to your satisfaction.',
    },
  },
  {
    id: 5,
    reviewer: 'Lisa Park',
    rating: 5,
    date: '2024-01-05',
    title: 'Best window cleaner we\'ve ever had',
    content: 'John exceeded our expectations in every way. He was on time, professional, and the results were incredible. Our windows have never looked better. Will definitely hire again!',
    service: 'Window Cleaning',
    verified: true,
    helpful: 20,
  },
  {
    id: 6,
    reviewer: 'Robert Wilson',
    rating: 4,
    date: '2024-01-03',
    title: 'Reliable and thorough service',
    content: 'Good experience overall. John was reliable and did a thorough job. The windows look great and he cleaned up after himself. Would recommend.',
    service: 'Window Cleaning',
    verified: true,
    helpful: 6,
  },
];

export default function TechnicianReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = filter === 'all' || 
      (filter === '5' && review.rating === 5) ||
      (filter === '4' && review.rating === 4) ||
      (filter === '3' && review.rating === 3) ||
      (filter === '2' && review.rating === 2) ||
      (filter === '1' && review.rating === 1);
    
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.reviewer.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Technician Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start gap-6">
            <img
              src={mockTechnician.avatar}
              alt={mockTechnician.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{mockTechnician.name}</h1>
                {mockTechnician.verified && (
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-2">{mockTechnician.service} • {mockTechnician.location}</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-yellow-400">{renderStars(mockTechnician.rating)}</span>
                  <span className="text-lg font-semibold text-gray-900">{mockTechnician.rating}</span>
                </div>
                <span className="text-gray-500">({mockTechnician.totalReviews} reviews)</span>
                <span className="text-gray-500">Member since {mockTechnician.memberSince}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Reviews</h3>
              
              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={filter === rating.toString()}
                          onChange={(e) => setFilter(e.target.value)}
                          className="accent-blue-600"
                        />
                        <span className="text-yellow-400">{renderStars(rating)}</span>
                      </div>
                      <span className="text-sm text-gray-500">({ratingDistribution[rating as keyof typeof ratingDistribution]})</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="rating"
                      value="all"
                      checked={filter === 'all'}
                      onChange={(e) => setFilter(e.target.value)}
                      className="accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">All Ratings</span>
                  </label>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="date">Most Recent</option>
                  <option value="rating">Highest Rated</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Reviews */}
            <div className="space-y-6">
              {sortedReviews.map(review => (
                <div key={review.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{review.title}</h3>
                        {review.verified && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="text-yellow-400">{renderStars(review.rating)}</span>
                        <span>by {review.reviewer}</span>
                        <span>{review.date}</span>
                        <span>{review.service}</span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      ⋮
                    </button>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{review.content}</p>
                  
                  {review.technicianResponse && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-blue-900">Response from {mockTechnician.name}</span>
                        <span className="text-sm text-blue-600">{review.technicianResponse.date}</span>
                      </div>
                      <p className="text-blue-800">{review.technicianResponse.content}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 text-sm">
                        👍 Helpful ({review.helpful})
                      </button>
                      <button className="text-gray-500 hover:text-blue-600 text-sm">
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedReviews.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                <p className="text-gray-500 text-lg">No reviews found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 