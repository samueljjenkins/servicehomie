"use client";

import { useState } from "react";
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

export default function DashboardPage() {
  const [availability, setAvailability] = useState<WeeklyAvailability>(getDefaultWeeklyAvailability());
  const [upcoming, setUpcoming] = useState<{ date: string; time: string; customer: string; service: string; price: number }[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'availability' | 'bookings'>('overview');
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

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
  const activeServicesCount = services.filter(s => s.isActive).length;
  const availableDaysCount = Object.values(availability).filter(day => day.length > 0).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-[#111111] border-b border-[#E1E1E1] dark:border-[#2A2A2A] px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">
            Manage your booking business
          </h1>
          <div className="text-sm text-[#626262] dark:text-[#B5B5B5] bg-gray-50 dark:bg-[#2A2A2A] px-3 py-1 rounded-lg font-inter">
            Demo Mode
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-[#111111] border-b border-[#E1E1E1] dark:border-[#2A2A2A]">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'services', label: 'Services', icon: '⚙️' },
              { id: 'availability', label: 'Availability', icon: '📅' },
              { id: 'bookings', label: 'Bookings', icon: '📋' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm font-inter ${
                  activeTab === tab.id
                    ? 'border-[#1754d8] text-[#1754d8]'
                    : 'border-transparent text-[#626262] dark:text-[#B5B5B5] hover:text-gray-700 dark:hover:text-[#B5B5B5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 bg-white dark:bg-[#111111]">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[#1754d8] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl text-[#626262] dark:text-[#B5B5B5] font-inter">
                Here's what's happening with your booking business today
              </h2>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl p-6 border border-[#E1E1E1] dark:border-[#2A2A2A]">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#626262] dark:text-[#B5B5B5] font-inter">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">${totalRevenue}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl p-6 border border-[#E1E1E1] dark:border-[#2A2A2A]">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#626262] dark:text-[#B5B5B5] font-inter">Upcoming Bookings</p>
                    <p className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">{upcoming.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl p-6 border border-[#E1E1E1] dark:border-[#2A2A2A]">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#626262] dark:text-[#B5B5B5] font-inter">Active Services</p>
                    <p className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">{activeServicesCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl p-6 border border-[#E1E1E1] dark:border-[#2A2A2A]">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#1754d8]/10 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#1754d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#626262] dark:text-[#B5B5B5] font-inter">Days Available</p>
                    <p className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">{availableDaysCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl p-6 border border-[#E1E1E1] dark:border-[#2A2A2A]">
                <h3 className="text-lg font-semibold text-[#626262] dark:text-[#B5B5B5] mb-4 font-inter">Recent Activity</h3>
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-[#626262] dark:text-[#B5B5B5] font-inter">No recent activity</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl p-6 border border-[#E1E1E1] dark:border-[#2A2A2A]">
                <h3 className="text-lg font-semibold text-[#626262] dark:text-[#B5B5B5] mb-4 font-inter">Recent Bookings</h3>
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-[#626262] dark:text-[#B5B5B5] font-inter">No recent bookings</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">Services</h2>
              <button
                onClick={addService}
                className="bg-[#1754d8] text-white px-4 py-2 rounded-xl hover:bg-[#1754d8]/90 transition-colors font-inter"
              >
                Add Service
              </button>
            </div>

            {services.length === 0 ? (
              <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl p-8 text-center border border-[#E1E1E1] dark:border-[#2A2A2A]">
                <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="text-lg font-medium text-[#626262] dark:text-[#B5B5B5] mb-2 font-inter">No services yet</h3>
                <p className="text-[#626262] dark:text-[#B5B5B5] mb-4 font-inter">Create your first service to start accepting bookings</p>
                <button
                  onClick={addService}
                  className="bg-[#1754d8] text-white px-6 py-3 rounded-xl hover:bg-[#1754d8]/90 transition-colors font-inter"
                >
                  Create Service
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {services.map(service => (
                  <div key={service.id} className="bg-white dark:bg-[#2A2A2A] rounded-2xl p-6 border border-[#E1E1E1] dark:border-[#2A2A2A]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#1754d8]/10 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-[#1754d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#626262] dark:text-[#B5B5B5] font-inter">{service.name}</h3>
                          <p className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">{service.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">${service.price}</span>
                            <span className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">{service.duration} min</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleServiceActive(service.id)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium font-inter ${
                            service.isActive
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                              : 'bg-gray-100 dark:bg-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5]'
                          }`}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => setEditingService(service)}
                          className="text-gray-400 dark:text-[#B5B5B5] hover:text-gray-600 dark:hover:text-[#B5B5B5]"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">Set Your Weekly Schedule</h2>
              <div className="text-sm text-[#626262] dark:text-[#B5B5B5] bg-gray-50 dark:bg-[#2A2A2A] px-3 py-2 rounded-lg font-inter">
                Availability is automatically saved
              </div>
            </div>

            <div className="grid gap-4">
              {weekLabels.map((day, dayIndex) => {
                const dayAvailability = availability[dayIndex as Weekday];
                const isEnabled = dayAvailability.length > 0;
                
                return (
                  <div key={day} className="bg-white dark:bg-[#2A2A2A] rounded-2xl p-6 border border-[#E1E1E1] dark:border-[#2A2A2A]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-[#626262] dark:text-[#B5B5B5] font-inter">{day}</h3>
                      <button
                        onClick={() => toggleDayEnabled(dayIndex as Weekday)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all font-inter ${
                          isEnabled
                            ? 'bg-[#1754d8] text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5] hover:bg-gray-200 dark:hover:bg-[#2A2A2A]'
                        }`}
                      >
                        {isEnabled ? '✓ Available' : 'Set Available'}
                      </button>
                    </div>

                    {isEnabled && (
                      <div className="space-y-3">
                        {dayAvailability.map((window, windowIndex) => (
                          <div key={windowIndex} className="flex items-center space-x-3">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-1 font-inter">
                                Time Slot {windowIndex + 1}
                              </label>
                              <div className="flex space-x-2">
                                <input
                                  type="time"
                                  value={window.start}
                                  onChange={(e) => updateWindow(dayIndex as Weekday, windowIndex, 'start', e.target.value)}
                                  className="flex-1 px-3 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter"
                                />
                                <span className="text-[#626262] dark:text-[#B5B5B5] self-center font-inter">to</span>
                                <input
                                  type="time"
                                  value={window.end}
                                  onChange={(e) => updateWindow(dayIndex as Weekday, windowIndex, 'end', e.target.value)}
                                  className="flex-1 px-3 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter"
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => removeWindow(dayIndex as Weekday, windowIndex)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addWindow(dayIndex as Weekday)}
                          className="w-full py-2 px-4 border-2 border-dashed border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg text-[#626262] dark:text-[#B5B5B5] hover:border-gray-300 dark:hover:border-[#2A2A2A] hover:text-gray-700 dark:hover:text-[#B5B5B5] transition-colors flex items-center justify-center space-x-2 font-inter"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Add time slot</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">Bookings</h2>
            </div>

            {upcoming.length === 0 ? (
              <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl p-8 text-center border border-[#E1E1E1] dark:border-[#2A2A2A]">
                <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-[#626262] dark:text-[#B5B5B5] mb-2 font-inter">No bookings yet</h3>
                <p className="text-[#626262] dark:text-[#B5B5B5] font-inter">Bookings will appear here once customers start scheduling</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl border border-[#E1E1E1] dark:border-[#2A2A2A] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E1E1E1] dark:border-[#2A2A2A]">
                  <h3 className="text-lg font-semibold text-[#626262] dark:text-[#B5B5B5] font-inter">Upcoming Bookings</h3>
                </div>
                <div className="divide-y divide-[#E1E1E1] dark:divide-[#2A2A2A]">
                  {upcoming.map((booking, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#626262] dark:text-[#B5B5B5] font-inter">{booking.customer}</p>
                          <p className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">{booking.service}</p>
                          <p className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">{booking.date} at {booking.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#626262] dark:text-[#B5B5B5] font-inter">${booking.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Add/Edit Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl p-6 w-full max-w-md border border-[#E1E1E1] dark:border-[#2A2A2A]">
            <h3 className="text-lg font-semibold text-[#626262] dark:text-[#B5B5B5] mb-4 font-inter">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-1 font-inter">
                  Service Name
                </label>
                <input
                  type="text"
                  value={editingService?.name || ''}
                  onChange={(e) => setEditingService(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter"
                  placeholder="e.g., Consultation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-1 font-inter">
                  Description
                </label>
                <textarea
                  value={editingService?.description || ''}
                  onChange={(e) => setEditingService(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter"
                  rows={3}
                  placeholder="Describe your service..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-1 font-inter">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={editingService?.price || ''}
                    onChange={(e) => setEditingService(prev => prev ? { ...prev, price: Number(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-1 font-inter">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={editingService?.duration || ''}
                    onChange={(e) => setEditingService(prev => prev ? { ...prev, duration: Number(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter"
                    min="15"
                    step="15"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddService(false);
                  setEditingService(null);
                }}
                className="flex-1 px-4 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg text-[#626262] dark:text-[#B5B5B5] hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors font-inter"
              >
                Cancel
              </button>
              <button
                onClick={() => editingService && saveService(editingService)}
                disabled={!editingService?.name}
                className="flex-1 px-4 py-2 bg-[#1754d8] text-white rounded-lg hover:bg-[#1754d8]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-inter"
              >
                {editingService ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
