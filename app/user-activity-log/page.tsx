"use client";
import { useState } from 'react';

const mockActivities = [
  {
    id: 1,
    type: 'booking',
    title: 'Booked Window Cleaning Service',
    description: 'Scheduled window cleaning with John Smith for March 15, 2024',
    timestamp: '2024-03-10T14:30:00Z',
    status: 'completed',
    technician: 'John Smith',
    amount: 120,
  },
  {
    id: 2,
    type: 'review',
    title: 'Left a Review',
    description: 'Rated John Smith 5 stars for window cleaning service',
    timestamp: '2024-03-12T10:15:00Z',
    status: 'completed',
    rating: 5,
  },
  {
    id: 3,
    type: 'message',
    title: 'Sent Message',
    description: 'Messaged Sarah Wilson about pressure washing quote',
    timestamp: '2024-03-08T16:45:00Z',
    status: 'completed',
    recipient: 'Sarah Wilson',
  },
  {
    id: 4,
    type: 'profile',
    title: 'Updated Profile',
    description: 'Changed phone number and address information',
    timestamp: '2024-03-05T09:20:00Z',
    status: 'completed',
  },
  {
    id: 5,
    type: 'payment',
    title: 'Payment Method Updated',
    description: 'Added new credit card ending in 1234',
    timestamp: '2024-03-03T11:30:00Z',
    status: 'completed',
  },
  {
    id: 6,
    type: 'booking',
    title: 'Cancelled Gutter Cleaning',
    description: 'Cancelled appointment with Mike Johnson for March 20',
    timestamp: '2024-03-01T13:15:00Z',
    status: 'cancelled',
    technician: 'Mike Johnson',
    amount: 95,
  },
  {
    id: 7,
    type: 'booking',
    title: 'Rescheduled Service',
    description: 'Rescheduled pressure washing from March 18 to March 22',
    timestamp: '2024-02-28T15:45:00Z',
    status: 'rescheduled',
    technician: 'Sarah Wilson',
    amount: 130,
  },
  {
    id: 8,
    type: 'support',
    title: 'Contacted Support',
    description: 'Submitted support ticket about billing question',
    timestamp: '2024-02-25T12:00:00Z',
    status: 'completed',
  },
];

const activityTypes = [
  { value: 'all', label: 'All Activities' },
  { value: 'booking', label: 'Bookings' },
  { value: 'review', label: 'Reviews' },
  { value: 'message', label: 'Messages' },
  { value: 'profile', label: 'Profile Updates' },
  { value: 'payment', label: 'Payments' },
  { value: 'support', label: 'Support' },
];

const statuses = [
  { value: 'all', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'rescheduled', label: 'Rescheduled' },
];

function getActivityIcon(type: string) {
  switch (type) {
    case 'booking':
      return '📅';
    case 'review':
      return '⭐';
    case 'message':
      return '💬';
    case 'profile':
      return '👤';
    case 'payment':
      return '💳';
    case 'support':
      return '🆘';
    default:
      return '📝';
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'rescheduled':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function UserActivityLogPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredActivities = mockActivities.filter(activity => {
    const matchesType = selectedType === 'all' || activity.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus;
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-8">Activity Log</h1>
          <p className="text-lg text-gray-600 mb-8">
            Track all your activities, bookings, and interactions on Service Homie.
          </p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Activities</label>
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {activityTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Activity List */}
          <div className="space-y-4">
            {paginatedActivities.map(activity => (
              <div key={activity.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                      <p className="text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{formatDate(activity.timestamp)}</span>
                        {activity.technician && (
                          <span>Technician: {activity.technician}</span>
                        )}
                        {activity.amount && (
                          <span className="text-green-600 font-medium">${activity.amount}</span>
                        )}
                        {activity.rating && (
                          <span className="text-yellow-500">{'★'.repeat(activity.rating)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}

          {paginatedActivities.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 