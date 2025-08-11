"use client";

import { useState, useEffect } from "react";
import type { WeeklyAvailability, Weekday, TimeWindow } from "@/lib/availability";
import { getDefaultWeeklyAvailability } from "@/lib/availability";

const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  isActive: boolean;
}

export default function CreatorDashboardPage() {
  const [availability, setAvailability] = useState<WeeklyAvailability>(getDefaultWeeklyAvailability());
  const [upcoming, setUpcoming] = useState<{ date: string; time: string; customer: string; service: string; price: number }[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'availability' | 'bookings'>('overview');
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);
    
    // TODO: Load data from Supabase instead of localStorage
    // For now, we'll start with empty data
  }, []);

  function persistAvailability(next: WeeklyAvailability) {
    setAvailability(next);
    // TODO: Save to Supabase instead of localStorage
    console.log('Saving availability to Supabase:', next);
  }

  function persistServices(next: Service[]) {
    setServices(next);
    // TODO: Save to Supabase instead of localStorage
    console.log('Saving services to Supabase:', next);
  }

  function toggleDayEnabled(dayIndex: Weekday) {
    const windows = availability[dayIndex];
    const next = { ...availability, [dayIndex]: windows.length ? [] : [{ start: "09:00", end: "17:00" }] } as WeeklyAvailability;
    persistAvailability(next);
  }

  function updateWindow(dayIndex: Weekday, windowIndex: number, field: keyof TimeWindow, value: string) {
    const next = structuredClone(availability);
    next[dayIndex][windowIndex][field] = value;
    persistAvailability(next);
  }

  function addWindow(dayIndex: Weekday) {
    const next = structuredClone(availability);
    next[dayIndex].push({ start: "09:00", end: "17:00" });
    persistAvailability(next);
  }

  function removeWindow(dayIndex: Weekday, windowIndex: number) {
    const next = structuredClone(availability);
    next[dayIndex].splice(windowIndex, 1);
    persistAvailability(next);
  }

  function addService() {
    const newService: Service = {
      id: Date.now().toString(),
      name: '',
      description: '',
      price: 50,
      duration: 60,
      isActive: true
    };
    setEditingService(newService);
    setShowAddService(true);
  }

  function saveService(service: Service) {
    if (editingService) {
      // Update existing service
      const updated = services.map(s => s.id === service.id ? service : s);
      persistServices(updated);
    } else {
      // Add new service
      persistServices([...services, service]);
    }
    setEditingService(null);
    setShowAddService(false);
  }

  function deleteService(serviceId: string) {
    const updated = services.filter(s => s.id !== serviceId);
    persistServices(updated);
  }

  function toggleServiceActive(serviceId: string) {
    const updated = services.map(s => 
      s.id === serviceId ? { ...s, isActive: !s.isActive } : s
    );
    persistServices(updated);
  }

  const totalRevenue = upcoming.reduce((sum, booking) => sum + booking.price, 0);
  const activeServices = services.filter(s => s.isActive).length;
  const availableDays = Object.values(availability).filter(day => day.length > 0).length;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header - Clean, professional design */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Service Homie</h1>
              <p className="text-slate-600 dark:text-slate-400">Manage your booking business</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-whop-pomegranate rounded-full"></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Clean, flat design */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {[
              { 
                id: 'overview', 
                label: 'Overview', 
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              { 
                id: 'services', 
                label: 'Services', 
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                )
              },
              { 
                id: 'availability', 
                label: 'Availability', 
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              { 
                id: 'bookings', 
                label: 'Bookings', 
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-whop-pomegranate text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {!isClient ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-whop-pomegranate rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Loading Service Homie...
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Initializing your dashboard
            </p>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whop-pomegranate mx-auto"></div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Welcome Section - Clean, professional */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-whop-pomegranate rounded-2xl mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                    Welcome back!
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Here's what's happening with your booking business today
                  </p>
                </div>

                {/* Stats Grid - Clean cards with proper contrast */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-whop-pomegranate/10 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-whop-pomegranate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <span className="text-2xl font-bold text-whop-pomegranate">${totalRevenue}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">Total Revenue</p>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-whop-blue/10 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-whop-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-2xl font-bold text-whop-blue">{upcoming.length}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">Upcoming Bookings</p>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-whop-pomegranate/10 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-whop-pomegranate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-2xl font-bold text-whop-pomegranate">{activeServices}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">Active Services</p>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">{availableDays}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">Days Available</p>
                  </div>
                </div>

                {/* Quick Actions - Clean, flat design */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setActiveTab('services')}
                        className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                      >
                        Manage Services & Pricing
                      </button>
                      <button
                        onClick={() => setActiveTab('availability')}
                        className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                      >
                        Set Your Availability
                      </button>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                      >
                        View All Bookings
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Recent Activity
                    </h3>
                    {upcoming.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">No recent bookings</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {upcoming.slice(-3).map((booking, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white text-sm">{booking.customer}</p>
                              <p className="text-slate-500 dark:text-slate-400 text-xs">{booking.service}</p>
                            </div>
                            <span className="text-whop-pomegranate font-semibold text-sm">${booking.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      Services & Pricing
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Manage your service offerings and pricing
                    </p>
                  </div>
                  <button
                    onClick={addService}
                    className="bg-whop-pomegranate text-white px-6 py-3 rounded-xl font-semibold hover:bg-whop-pomegranate/90 transition-colors shadow-sm"
                  >
                    + Add Service
                  </button>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {service.name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              service.isActive
                                ? 'bg-whop-pomegranate/20 text-whop-pomegranate'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                            }`}>
                              {service.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                            {service.description}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-whop-pomegranate">${service.price}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-600 dark:text-slate-400">{service.duration} min</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => toggleServiceActive(service.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            service.isActive
                              ? 'bg-whop-pomegranate text-slate-800'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                          }`}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => setEditingService(service)}
                          className="text-whop-blue hover:text-whop-blue/80 text-sm px-3 py-1.5 rounded-lg hover:bg-whop-blue/10 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="text-red-500 hover:text-red-600 text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add/Edit Service Modal */}
                {showAddService && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        {editingService ? 'Edit Service' : 'Add New Service'}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Service Name
                          </label>
                          <input
                            type="text"
                            value={editingService?.name || ''}
                            onChange={(e) => setEditingService(prev => prev ? { ...prev, name: e.target.value } : null)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                            placeholder="e.g., 1-on-1 Consultation"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Description
                          </label>
                          <textarea
                            value={editingService?.description || ''}
                            onChange={(e) => setEditingService(prev => prev ? { ...prev, description: e.target.value } : null)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                            rows={3}
                            placeholder="Describe your service..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Price ($)
                            </label>
                            <input
                              type="number"
                              value={editingService?.price || 0}
                              onChange={(e) => setEditingService(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Duration (min)
                            </label>
                            <input
                              type="number"
                              value={editingService?.duration || 60}
                              onChange={(e) => setEditingService(prev => prev ? { ...prev, duration: Number(e.target.value) } : null)}
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                              min="15"
                              step="15"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={() => {
                              setShowAddService(false);
                              setEditingService(null);
                            }}
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => editingService && saveService(editingService)}
                            disabled={!editingService?.name}
                            className="flex-1 bg-whop-pomegranate text-white px-4 py-2 rounded-lg font-medium hover:bg-whop-pomegranate/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Save Service
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-whop-blue/10 rounded-2xl mb-4">
                    <svg className="w-8 h-8 text-whop-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                    Set Your Weekly Schedule
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Choose which days and times you're available for customer bookings
                  </p>
                </div>

                {/* Enhanced Availability Editor */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {weekLabels.map((label, idx) => {
                      const dayIndex = idx as Weekday;
                      const windows = availability[dayIndex];
                      const enabled = windows.length > 0;
                      return (
                        <div key={label} className={`rounded-2xl p-6 transition-all duration-200 ${
                          enabled 
                            ? 'bg-gradient-to-br from-whop-pomegranate/5 to-whop-blue/5 border-2 border-whop-pomegranate/20 shadow-lg' 
                            : 'bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600'
                        }`}>
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                enabled 
                                  ? 'bg-whop-pomegranate text-white' 
                                  : 'bg-slate-200 dark:bg-slate-600 text-slate-500'
                              }`}>
                                <span className="font-bold text-sm">{label}</span>
                              </div>
                              <div>
                                <h3 className={`font-semibold text-sm ${
                                  enabled 
                                    ? 'text-slate-900 dark:text-white' 
                                    : 'text-slate-600 dark:text-slate-400'
                                }`}>
                                  {label === 'Sun' ? 'Sunday' : 
                                   label === 'Mon' ? 'Monday' : 
                                   label === 'Tue' ? 'Tuesday' : 
                                   label === 'Wed' ? 'Wednesday' : 
                                   label === 'Thu' ? 'Thursday' : 
                                   label === 'Fri' ? 'Friday' : 'Saturday'}
                                </h3>
                                <p className={`text-xs ${
                                  enabled 
                                    ? 'text-whop-pomegranate font-medium' 
                                    : 'text-slate-500'
                                }`}>
                                  {enabled ? `${windows.length} time slot${windows.length > 1 ? 's' : ''}` : 'Not available'}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleDayEnabled(dayIndex)}
                              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                enabled 
                                  ? "bg-whop-pomegranate text-white shadow-md hover:shadow-lg transform hover:scale-105" 
                                  : "bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-whop-pomegranate/50"
                              }`}
                            >
                              {enabled ? "✓ Available" : "Set Available"}
                            </button>
                          </div>
                          
                          {enabled && (
                            <div className="space-y-4">
                              {windows.map((w, wi) => (
                                <div key={wi} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-600 shadow-sm">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-6 h-6 bg-whop-blue/10 rounded-lg flex items-center justify-center">
                                      <svg className="w-3 h-3 text-whop-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Time Slot {wi + 1}</span>
                                    <button 
                                      onClick={() => removeWindow(dayIndex, wi)} 
                                      className="ml-auto text-red-500 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Start Time</label>
                                      <input
                                        type="time"
                                        value={w.start}
                                        onChange={(e) => updateWindow(dayIndex, wi, "start", e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                                      />
                                    </div>
                                    <div className="flex items-center justify-center w-8">
                                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                      </svg>
                                    </div>
                                    <div className="flex-1">
                                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">End Time</label>
                                      <input
                                        type="time"
                                        value={w.end}
                                        onChange={(e) => updateWindow(dayIndex, wi, "end", e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              <button 
                                onClick={() => addWindow(dayIndex)} 
                                className="w-full bg-gradient-to-r from-whop-blue/10 to-whop-pomegranate/10 hover:from-whop-blue/20 hover:to-whop-pomegranate/20 text-whop-blue dark:text-whop-pomegranate border-2 border-dashed border-whop-blue/30 dark:border-whop-pomegranate/30 rounded-xl py-3 text-sm font-semibold transition-all duration-200 hover:scale-105 group"
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                  Add Another Time Slot
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-8 p-6 bg-gradient-to-r from-whop-pomegranate/5 to-whop-blue/5 rounded-xl border border-whop-pomegranate/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-whop-pomegranate/20 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-whop-pomegranate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Your availability is automatically saved</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Changes are applied immediately and will be used for customer bookings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      Upcoming Bookings
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Manage and view all your customer appointments
                    </p>
                  </div>

                </div>

                {upcoming.length === 0 ? (
                  <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                    <p className="text-slate-500 mb-2 text-lg">No upcoming bookings yet</p>
                    <p className="text-slate-400 mb-6">When customers book sessions, they'll appear here</p>

                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Customer
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Service
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Date & Time
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          {upcoming.map((booking, index) => (
                            <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-slate-900 dark:text-white">
                                  {booking.customer}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-slate-900 dark:text-white">
                                  {booking.service || 'General Session'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-slate-900 dark:text-white">
                                  {booking.date} · {booking.time}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-whop-pomegranate">
                                  ${booking.price || 50}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-whop-pomegranate/20 text-whop-pomegranate">
                                  Confirmed
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button className="text-whop-blue hover:text-whop-blue/80 mr-3 hover:bg-whop-blue/10 px-2 py-1 rounded transition-colors">
                                  View
                                </button>
                                <button className="text-whop-pomegranate hover:text-whop-pomegranate/80 hover:bg-whop-pomegranate/10 px-2 py-1 rounded transition-colors">
                                  Edit
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
