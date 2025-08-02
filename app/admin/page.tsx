"use client";
import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Stat {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  description?: string;
}

interface Technician {
  id: string;
  name: string;
  email: string;
  location: string;
  subscription_status: string;
  created_at: string;
  stripe_subscription_id?: string;
  monthly_fee: number;
  url_slug?: string;
}

export default function AdminPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<Stat[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (user && user.emailAddresses) {
      const userEmail = user.emailAddresses[0]?.emailAddress;
      if (userEmail === 'samuel@servicehomie.com') {
        setIsAdmin(true);
      } else {
        // Redirect non-admin users to technician dashboard
        router.push('/technician-dashboard');
      }
    }
  }, [user, router]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isLoaded, isSignedIn, router]);

  // Fetch admin data
  useEffect(() => {
    if (isSignedIn && isAdmin) {
      fetchAdminData();
    }
  }, [isSignedIn, isAdmin]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch all technician profiles
      const { data: techProfiles, error: techError } = await supabase
        .from('technician_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (techError) {
        console.error('Error fetching technicians:', techError);
      } else {
        setTechnicians(techProfiles || []);
      }

      // Calculate stats for subscription-based business model
      const totalTechnicians = techProfiles?.length || 0;
      const activeSubscriptions = techProfiles?.filter(t => t.subscription_status === 'active').length || 0;
      const pendingSubscriptions = techProfiles?.filter(t => t.subscription_status === 'pending').length || 0;
      const cancelledSubscriptions = techProfiles?.filter(t => t.subscription_status === 'cancelled').length || 0;
      
      // Calculate revenue (only from active subscriptions)
      const activeTechnicians = techProfiles?.filter(t => t.subscription_status === 'active') || [];
      const monthlyRevenue = activeTechnicians.reduce((sum, t) => sum + (t.monthly_fee || 19), 0);
      const annualRevenue = monthlyRevenue * 12;
      
      // Calculate conversion rate
      const conversionRate = totalTechnicians > 0 ? ((activeSubscriptions / totalTechnicians) * 100).toFixed(1) : 0;
      const conversionRateNumber = parseFloat(conversionRate as string);
      
      // Get recent signups (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentSignups = techProfiles?.filter(t => new Date(t.created_at) > thirtyDaysAgo).length || 0;

      setStats([
        { 
          label: 'Total Technicians', 
          value: totalTechnicians,
          change: recentSignups > 0 ? `+${recentSignups} this month` : '0 this month',
          changeType: recentSignups > 0 ? 'positive' : 'neutral',
          description: 'All registered technicians'
        },
        { 
          label: 'Active Subscriptions', 
          value: activeSubscriptions,
          change: `${conversionRate}% conversion`,
          changeType: conversionRateNumber > 50 ? 'positive' : conversionRateNumber > 25 ? 'neutral' : 'negative',
          description: 'Paying $19/month'
        },
        { 
          label: 'Monthly Revenue', 
          value: `$${monthlyRevenue.toLocaleString()}`,
          change: `$${annualRevenue.toLocaleString()}/year`,
          changeType: 'positive',
          description: 'From active subscriptions'
        },
        { 
          label: 'Pending Approvals', 
          value: pendingSubscriptions,
          change: pendingSubscriptions > 0 ? `${pendingSubscriptions} need review` : 'All caught up',
          changeType: pendingSubscriptions > 0 ? 'negative' : 'positive',
          description: 'Awaiting activation'
        },
        { 
          label: 'Cancelled Subscriptions', 
          value: cancelledSubscriptions,
          change: cancelledSubscriptions > 0 ? `${cancelledSubscriptions} churned` : 'No churn',
          changeType: cancelledSubscriptions > 0 ? 'negative' : 'positive',
          description: 'Churned customers'
        },
        { 
          label: 'Conversion Rate', 
          value: `${conversionRate}%`,
          change: conversionRateNumber > 50 ? 'Excellent' : conversionRateNumber > 25 ? 'Good' : 'Needs improvement',
          changeType: conversionRateNumber > 50 ? 'positive' : conversionRateNumber > 25 ? 'neutral' : 'negative',
          description: 'Signup to paid conversion'
        }
      ]);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardTechnician = () => {
    router.push('/admin/onboard');
  };

  const handleReviewApplications = () => {
    router.push('/admin/applications');
  };

  const handleViewTechnician = (technicianId: string) => {
    router.push(`/admin/technicians/${technicianId}`);
  };

  const handleActivateSubscription = async (technicianId: string) => {
    try {
      const { error } = await supabase
        .from('technician_profiles')
        .update({ 
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', technicianId);

      if (error) {
        alert('Error activating subscription: ' + error.message);
      } else {
        alert('Subscription activated successfully!');
        fetchAdminData(); // Refresh data
      }
    } catch (error) {
      alert('Error activating subscription');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Will redirect to login
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-600 text-xl font-bold mb-4">Access Denied</div>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Subscription-based landing page platform management</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleOnboardTechnician}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Onboard Technician
              </button>
              <button
                onClick={handleReviewApplications}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Review Applications
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded-md mb-2"></div>
                <div className="h-6 bg-gray-200 rounded-md mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-md"></div>
              </div>
            ))
          ) : (
            stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  {stat.change && (
                    <div className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </div>
                  )}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
                {stat.description && (
                  <div className="text-sm text-gray-500 mt-1">{stat.description}</div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Technicians Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Technicians</h2>
            <p className="text-sm text-gray-600 mt-1">Manage technician accounts and subscriptions</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technician
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Landing Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                    </tr>
                  ))
                ) : technicians.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No technicians found
                    </td>
                  </tr>
                ) : (
                  technicians.slice(0, 10).map((technician) => (
                    <tr key={technician.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{technician.name}</div>
                            <div className="text-sm text-gray-500">{technician.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {technician.location || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          technician.subscription_status === 'active' ? 'bg-green-100 text-green-800' :
                          technician.subscription_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          technician.subscription_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {technician.subscription_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${technician.monthly_fee || 19}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {technician.url_slug ? (
                          <a 
                            href={`/preview/${technician.url_slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Page
                          </a>
                        ) : (
                          <span className="text-gray-400">No URL set</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(technician.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewTechnician(technician.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          {technician.subscription_status === 'pending' && (
                            <button
                              onClick={() => handleActivateSubscription(technician.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 