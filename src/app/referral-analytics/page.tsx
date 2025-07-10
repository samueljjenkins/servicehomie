"use client";
import { useState } from 'react';

const mockReferralData = {
  totalReferrals: 47,
  successfulReferrals: 32,
  pendingReferrals: 8,
  failedReferrals: 7,
  totalEarnings: 640,
  thisMonthEarnings: 160,
  conversionRate: 68.1,
  averageReferralValue: 20,
  referralHistory: [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      status: 'completed',
      date: '2024-03-15',
      earnings: 20,
      service: 'Window Cleaning',
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      status: 'completed',
      date: '2024-03-14',
      earnings: 20,
      service: 'Pressure Washing',
    },
    {
      id: 3,
      name: 'Lisa Rodriguez',
      email: 'lisa.r@email.com',
      status: 'pending',
      date: '2024-03-13',
      earnings: 0,
      service: 'Gutter Cleaning',
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@email.com',
      status: 'completed',
      date: '2024-03-12',
      earnings: 20,
      service: 'Window Cleaning',
    },
    {
      id: 5,
      name: 'Emma Wilson',
      email: 'emma.w@email.com',
      status: 'failed',
      date: '2024-03-11',
      earnings: 0,
      service: 'Pressure Washing',
    },
    {
      id: 6,
      name: 'James Brown',
      email: 'james.b@email.com',
      status: 'completed',
      date: '2024-03-10',
      earnings: 20,
      service: 'Window Cleaning',
    },
  ],
  monthlyData: [
    { month: 'Jan', referrals: 8, earnings: 160 },
    { month: 'Feb', referrals: 12, earnings: 240 },
    { month: 'Mar', referrals: 15, earnings: 300 },
    { month: 'Apr', referrals: 10, earnings: 200 },
    { month: 'May', referrals: 18, earnings: 360 },
    { month: 'Jun', referrals: 22, earnings: 440 },
  ],
  topServices: [
    { service: 'Window Cleaning', referrals: 18, earnings: 360 },
    { service: 'Pressure Washing', referrals: 12, earnings: 240 },
    { service: 'Gutter Cleaning', referrals: 8, earnings: 160 },
  ],
};

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
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
  });
}

export default function ReferralAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredHistory = mockReferralData.referralHistory.filter(referral => {
    const matchesStatus = selectedStatus === 'all' || referral.status === selectedStatus;
    return matchesStatus;
  });

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-8">Referral Analytics</h1>
          <p className="text-lg text-gray-600 mb-8">
            Track your referral performance, earnings, and success metrics.
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">Total Referrals</p>
                  <p className="text-2xl font-bold text-blue-900">{mockReferralData.totalReferrals}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-900">${mockReferralData.totalEarnings}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-purple-900">{mockReferralData.conversionRate}%</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-orange-600">Avg. Value</p>
                  <p className="text-2xl font-bold text-orange-900">${mockReferralData.averageReferralValue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Referral Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-600">Completed</span>
                  <span className="font-semibold">{mockReferralData.successfulReferrals}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600">Pending</span>
                  <span className="font-semibold">{mockReferralData.pendingReferrals}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-600">Failed</span>
                  <span className="font-semibold">{mockReferralData.failedReferrals}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold text-green-600">${mockReferralData.thisMonthEarnings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Month</span>
                  <span className="font-semibold">$240</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average</span>
                  <span className="font-semibold">$213</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Services</h3>
              <div className="space-y-3">
                {mockReferralData.topServices.map((service, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{service.service}</span>
                    <span className="font-semibold">{service.referrals}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Referral History</h2>
            <div className="flex space-x-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.map((referral) => (
                  <tr key={referral.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{referral.name}</div>
                        <div className="text-sm text-gray-500">{referral.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{referral.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(referral.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${referral.earnings}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals found</h3>
              <p className="text-gray-600">Try adjusting your filters or start referring friends!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 