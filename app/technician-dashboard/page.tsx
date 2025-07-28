"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import SubscriptionGuard from '@/components/SubscriptionGuard';

type TabType = 'overview' | 'bookings' | 'payments' | 'reviews';

export default function TechnicianDashboard() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [isSignedIn]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
  ];

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
    return null;
  }

  return (
    <SubscriptionGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Manage your landing page and business tools</p>
              </div>
              <div className="flex space-x-3">
                <Link 
                  href="/technician-page" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Landing Page
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Landing Page Management */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Landing Page Management</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Current Landing Page */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Current Landing Page</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2">Your landing page URL:</p>
                        <p className="font-mono text-blue-600">servicehomie.com/your-name</p>
                        <div className="mt-3 flex space-x-2">
                          <Link 
                            href="/technician-page" 
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            View Page
                          </Link>
                          <Link 
                            href="/technician-page/edit" 
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Edit Page
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Custom Domain */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Custom Domain</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2">Want your own domain?</p>
                        <p className="text-sm text-gray-500 mb-3">Connect your own domain like: yourbusiness.com</p>
                        <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors">
                          Set Up Custom Domain
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <span className="text-2xl">👁️</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Page Views</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <span className="text-2xl">📅</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Bookings</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 border">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Reviews</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              {/* Calendly Integration */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Calendly Integration</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Connection Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">Not Connected</span>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Connect Calendly
                      </button>
                    </div>

                    {/* Setup Instructions */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">How to Connect Calendly</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</span>
                          <p className="text-gray-700">Go to <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">calendly.com</a> and create your account</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</span>
                          <p className="text-gray-700">Create your booking calendar and set your availability</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</span>
                          <p className="text-gray-700">Copy your Calendly link and paste it below</p>
                        </div>
                      </div>
                    </div>

                    {/* Calendly Link Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Your Calendly Link</label>
                      <div className="flex space-x-2">
                        <input 
                          type="url" 
                          placeholder="https://calendly.com/your-name"
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              {/* Stripe Integration */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Integration</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Stripe Connection */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">Stripe Connected</span>
                      </div>
                      <span className="text-sm text-gray-500">Active</span>
                    </div>

                    {/* Calendly + Stripe Integration */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Connect Stripe to Calendly</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800 mb-3">
                          <strong>Important:</strong> To accept payments through Calendly, you need to connect your Stripe account to Calendly.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</span>
                            <p className="text-sm text-blue-800">Go to your Calendly dashboard</p>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</span>
                            <p className="text-sm text-blue-800">Navigate to "Integrations" → "Stripe"</p>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</span>
                            <p className="text-sm text-blue-800">Connect your Stripe account</p>
                          </div>
                          <div className="flex items-start space-x-3">
                            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">4</span>
                            <p className="text-sm text-blue-800">Add payment options to your booking events</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Settings */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Payment Settings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Service Pricing</h5>
                          <p className="text-sm text-gray-600 mb-3">Set your service prices in Calendly</p>
                          <button className="text-blue-600 hover:text-blue-700 text-sm">Configure Pricing</button>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Payment Methods</h5>
                          <p className="text-sm text-gray-600 mb-3">Accept credit cards, ACH, and more</p>
                          <button className="text-blue-600 hover:text-blue-700 text-sm">View Methods</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Google Reviews Integration */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Google Reviews Integration</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Connection Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">Not Connected</span>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Connect Google Reviews
                      </button>
                    </div>

                    {/* Setup Instructions */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">How to Connect Google Reviews</h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</span>
                          <p className="text-gray-700">Go to <a href="https://business.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google My Business</a></p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</span>
                          <p className="text-gray-700">Find or create your business listing</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</span>
                          <p className="text-gray-700">Copy your Google Business ID or reviews URL</p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">4</span>
                          <p className="text-gray-700">Paste it below to connect your reviews</p>
                        </div>
                      </div>
                    </div>

                    {/* Google Business Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Google Business URL or ID</label>
                      <div className="flex space-x-2">
                        <input 
                          type="text" 
                          placeholder="https://g.page/your-business or your-business-id"
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                          Connect
                        </button>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Reviews Preview</h4>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <span className="text-4xl mb-2 block">⭐</span>
                        <p className="text-gray-500">No reviews connected yet</p>
                        <p className="text-sm text-gray-400">Your Google reviews will appear here and on your landing page</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SubscriptionGuard>
  );
}
