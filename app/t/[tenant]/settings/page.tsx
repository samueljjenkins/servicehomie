"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTenants } from "@/lib/hooks/useTenants";
import { useWhopUser } from "@/lib/hooks/useWhopUser";
import { isValidTenant } from "@/lib/tenant-utils";

export default function TenantSettingsPage() {
  const params = useParams();
  const [tenantValid, setTenantValid] = useState(false);
  const [tenant, setTenant] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: ''
  });

  // Supabase hooks
  const { user, loading: userLoading, isAuthenticated } = useWhopUser(tenant || '');
  const { getTenantByWhopCompanyId, updateTenant, loading: tenantLoading } = useTenants();

  useEffect(() => {
    // Validate tenant before proceeding
    const routeTenant = params?.tenant as string;
    
    if (routeTenant && isValidTenant(routeTenant)) {
      setTenant(routeTenant);
      setTenantValid(true);
      loadTenantData(routeTenant);
    } else {
      console.error('Invalid tenant detected:', routeTenant);
      setTenantValid(false);
    }
  }, [params?.tenant]);

  async function loadTenantData(tenantSlug: string) {
    try {
      const tenantData = await getTenantByWhopCompanyId(tenantSlug);
      if (tenantData) {
        setFormData({
          name: tenantData.name || '',
          description: tenantData.description || '',
          logo_url: tenantData.logo_url || ''
        });
      }
    } catch (error) {
      console.error('Failed to load tenant data:', error);
    }
  }

  async function handleSave() {
    if (!tenant) return;

    try {
      await updateTenant(tenant, formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update tenant:', error);
    }
  }

  // Show loading state while validating tenant and loading user
  if (!tenantValid || !tenant || userLoading || tenantLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Loading Settings...
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Setting up your workspace
          </p>
        </div>
      </div>
    );
  }

  // Show error state if user authentication failed
  if (!user || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You need to be authenticated to access settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      {/* Header */}
      <div className="bg-white dark:bg-[#111111] border-b border-[#E1E1E1] dark:border-[#2A2A2A] px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5]">
            Business Settings
          </h1>
          <div className="text-sm text-[#626262] dark:text-[#B5B5B5] bg-gray-100 dark:bg-[#2A2A2A] px-3 py-1 rounded-lg">
            Tenant: {tenant}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-[#2A2A2A] rounded-lg border border-[#E1E1E1] dark:border-[#2A2A2A] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#626262] dark:text-[#B5B5B5]">
              Business Information
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#1754d8] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#1347b8] transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-2">
                Business Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#111111] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent"
                  placeholder="Enter business name"
                />
              ) : (
                <p className="text-[#626262] dark:text-[#B5B5B5] py-2">
                  {formData.name || 'Not set'}
                </p>
              )}
            </div>

            {/* Business Description */}
            <div>
              <label className="block text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-2">
                Business Description
              </label>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#111111] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent"
                  placeholder="Describe your business"
                />
              ) : (
                <p className="text-[#626262] dark:text-[#B5B5B5] py-2">
                  {formData.description || 'No description provided'}
                </p>
              )}
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-2">
                Logo URL
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#111111] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
              ) : (
                <div className="py-2">
                  {formData.logo_url ? (
                    <div className="flex items-center space-x-3">
                      <img 
                        src={formData.logo_url} 
                        alt="Business logo" 
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <a 
                        href={formData.logo_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#1754d8] hover:underline"
                      >
                        View Logo
                      </a>
                    </div>
                  ) : (
                    <p className="text-[#626262] dark:text-[#B5B5B5]">
                      No logo uploaded
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  className="bg-[#1754d8] text-white px-6 py-2 rounded-lg text-sm hover:bg-[#1347b8] transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    loadTenantData(tenant);
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
