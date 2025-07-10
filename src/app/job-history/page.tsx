"use client";
import { useState } from 'react';
import Link from 'next/link';

const mockJobHistory = [
  {
    id: 1,
    service: 'Window Cleaning',
    technician: 'John Smith',
    homeowner: 'Sarah Johnson',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'completed',
    rating: 5,
    price: 120,
    address: '123 Main St, New York, NY 10001',
    description: 'Full house window cleaning including second floor windows',
    beforePhotos: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop',
    ],
    afterPhotos: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop',
    ],
    notes: 'Windows cleaned thoroughly. Removed all dirt and grime. Customer was very satisfied with the results.',
    review: {
      rating: 5,
      title: 'Excellent service and very professional',
      content: 'John did an amazing job cleaning our windows. He was punctual, professional, and the results were outstanding.',
      date: '2024-01-16',
    },
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
  },
  {
    id: 2,
    service: 'Gutter Cleaning',
    technician: 'Mike Johnson',
    homeowner: 'David Thompson',
    date: '2024-01-12',
    time: '2:00 PM',
    status: 'completed',
    rating: 4,
    price: 150,
    address: '456 Oak Ave, Brooklyn, NY 11201',
    description: 'Gutter cleaning and downspout inspection',
    beforePhotos: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop',
    ],
    afterPhotos: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop',
    ],
    notes: 'Gutters cleared of all debris. Downspouts flowing properly. Minor repair needed on one section.',
    review: {
      rating: 4,
      title: 'Good work, thorough cleaning',
      content: 'Mike did a good job cleaning the gutters. Found and fixed a small issue with the downspout.',
      date: '2024-01-13',
    },
    paymentStatus: 'paid',
    paymentMethod: 'PayPal',
  },
  {
    id: 3,
    service: 'Pressure Washing',
    technician: 'Sarah Wilson',
    homeowner: 'Emily Rodriguez',
    date: '2024-01-10',
    time: '9:00 AM',
    status: 'completed',
    rating: 5,
    price: 200,
    address: '789 Pine St, Queens, NY 11375',
    description: 'Driveway and walkway pressure washing',
    beforePhotos: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    ],
    afterPhotos: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    ],
    notes: 'Driveway and walkway pressure washed. Removed all stains and dirt. Surfaces look like new.',
    review: {
      rating: 5,
      title: 'Fantastic results!',
      content: 'Sarah did an incredible job. Our driveway looks brand new. Very professional and thorough.',
      date: '2024-01-11',
    },
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
  },
  {
    id: 4,
    service: 'Window Cleaning',
    technician: 'John Smith',
    homeowner: 'Lisa Park',
    date: '2024-01-08',
    time: '11:00 AM',
    status: 'completed',
    rating: 3,
    price: 120,
    address: '321 Elm St, Manhattan, NY 10002',
    description: 'Apartment window cleaning',
    beforePhotos: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    ],
    afterPhotos: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    ],
    notes: 'Windows cleaned but some high spots were missed due to access limitations.',
    review: {
      rating: 3,
      title: 'Decent work, but missed some spots',
      content: 'Overall okay, but some areas were missed. John was professional though.',
      date: '2024-01-09',
    },
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
  },
];

export default function JobHistoryPage() {
  const [jobs, setJobs] = useState(mockJobHistory);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = job.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.homeowner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-600 mb-2">Job History</h1>
              <p className="text-gray-600">View all your completed jobs and service history</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by service, technician, homeowner, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Jobs</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Jobs List */}
          <div className="space-y-6">
            {filteredJobs.map(job => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.service}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(job.paymentStatus)}`}>
                        {job.paymentStatus.charAt(0).toUpperCase() + job.paymentStatus.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      <strong>Technician:</strong> {job.technician} • <strong>Homeowner:</strong> {job.homeowner}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Date:</strong> {job.date} at {job.time} • <strong>Address:</strong> {job.address}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Price:</strong> ${job.price} • <strong>Payment:</strong> {job.paymentMethod}
                    </p>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400">{renderStars(job.rating)}</span>
                      <span className="text-lg font-semibold text-gray-900">{job.rating}</span>
                    </div>
                    <button
                      onClick={() => setSelectedJob(job.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Quick Review Preview */}
                {job.review && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400">{renderStars(job.review.rating)}</span>
                      <span className="font-semibold text-gray-900">{job.review.title}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{job.review.content}</p>
                    <p className="text-gray-500 text-xs mt-2">{job.review.date}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {(() => {
              const job = jobs.find(j => j.id === selectedJob);
              if (!job) return null;

              return (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{job.service} - Job Details</h2>
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Job Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h3>
                      <div className="space-y-3">
                        <div>
                          <strong>Technician:</strong> {job.technician}
                        </div>
                        <div>
                          <strong>Homeowner:</strong> {job.homeowner}
                        </div>
                        <div>
                          <strong>Date & Time:</strong> {job.date} at {job.time}
                        </div>
                        <div>
                          <strong>Address:</strong> {job.address}
                        </div>
                        <div>
                          <strong>Description:</strong> {job.description}
                        </div>
                        <div>
                          <strong>Price:</strong> ${job.price}
                        </div>
                        <div>
                          <strong>Payment Method:</strong> {job.paymentMethod}
                        </div>
                        <div>
                          <strong>Status:</strong> 
                          <span className={`ml-2 inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      {job.notes && (
                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-900 mb-2">Job Notes</h4>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{job.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Photos and Review */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos & Review</h3>
                      
                      {/* Before Photos */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-2">Before Photos</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {job.beforePhotos.map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Before ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>

                      {/* After Photos */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-2">After Photos</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {job.afterPhotos.map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`After ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review */}
                      {job.review && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-yellow-400">{renderStars(job.review.rating)}</span>
                            <span className="font-semibold text-gray-900">{job.review.title}</span>
                          </div>
                          <p className="text-gray-600 mb-2">{job.review.content}</p>
                          <p className="text-gray-500 text-sm">{job.review.date}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
} 