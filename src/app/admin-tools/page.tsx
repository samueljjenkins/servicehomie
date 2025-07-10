"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Define types for our data
interface User {
  id: string;
  full_name: string;
  email: string;
  user_type: string;
  created_at: string;
}

interface SystemStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingApprovals: number;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
    case 'technician':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'homeowner':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatDate(dateString: string) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AdminToolsPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  
  const [selectedUserRole, setSelectedUserRole] = useState('all');

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all data in parallel
        const [
          { count: totalUsers, error: usersError },
          { count: totalBookings, error: bookingsError },
          { data: revenueData, error: revenueError },
          { count: pendingApprovals, error: approvalsError },
          { data: usersData, error: allUsersError }
        ] = await Promise.all([
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase.from('bookings').select('*', { count: 'exact', head: true }),
          supabase.from('bookings').select('price').eq('status', 'completed'),
          supabase.from('technician_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('users').select('id, full_name, email, user_type, created_at')
        ]);

        if (usersError || bookingsError || revenueError || approvalsError || allUsersError) {
          throw new Error('Failed to fetch some admin data.');
        }

        const totalRevenue = revenueData?.reduce((sum, booking) => sum + (booking.price || 0), 0) || 0;

        setStats({
          totalUsers: totalUsers ?? 0,
          totalBookings: totalBookings ?? 0,
          totalRevenue: totalRevenue,
          pendingApprovals: pendingApprovals ?? 0,
        });

        setUsers(usersData || []);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [supabase]);

  const filteredUsers = users.filter(user => {
    return selectedUserRole === 'all' || user.user_type === selectedUserRole;
  });

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-blue-600">Admin Tools</h1>
            <Link 
              href="/admin"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <span>&#8592;</span> Back to Dashboard
            </Link>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'users', label: 'User Management', icon: '👥' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Dashboard Tab */}
          {!loading && !error && stats && activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon="👥" label="Total Users" value={stats.totalUsers} color="blue" />
                <StatCard icon="💰" label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} color="green" />
                <StatCard icon="📅" label="Total Bookings" value={stats.totalBookings} color="purple" />
                <StatCard icon="📋" label="Pending Approvals" value={stats.pendingApprovals} color="orange" />
              </div>
            </div>
          )}

          {/* User Management Tab */}
          {!loading && !error && activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                <div className="flex space-x-4">
                  <select
                    value={selectedUserRole}
                    onChange={(e) => setSelectedUserRole(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="homeowner">Homeowners</option>
                    <option value="technician">Technicians</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.user_type)}`}>
                            {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-red-600 hover:text-red-900">Suspend</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// A reusable StatCard component
const StatCard = ({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) => {
  const colors: { [key: string]: string } = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };
  const bgColors: { [key: string]: string } = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
  };
  const textColors: { [key: string]: string } = {
    blue: 'text-blue-900',
    green: 'text-green-900',
    purple: 'text-purple-900',
    orange: 'text-orange-900',
  };

  return (
    <div className={`${colors[color]} p-6 rounded-lg`}>
      <div className="flex items-center">
        <div className={`p-2 ${bgColors[color]} rounded-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium">{label}</p>
          <p className={`text-2xl font-bold ${textColors[color]}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}; 