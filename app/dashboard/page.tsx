"use client";

import { useState, useEffect } from "react";
import { useWhopUser } from "@/lib/hooks/useWhopUser";
import { useWhopData } from "@/lib/hooks/useWhopData";
import type { WeeklyAvailability, Weekday, TimeWindow } from "@/lib/availability";

const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export default function CreatorDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'availability' | 'bookings' | 'settings'>('overview');
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  // Whop data hooks
  const { user, loading: userLoading } = useWhopUser();
  const { 
    services, 
    availability, 
    bookings,
    addService: addServiceToDB, 
    updateService, 
    deleteService: deleteServiceFromDB,
    updateAvailability: saveAvailability,
    addBooking,
    updateBooking,
    getUpcomingBookings,
    getActiveServices,
    toggleServiceStatus,
    updateTimeWindow,
    addTimeWindow,
    removeTimeWindow,
    loading: dataLoading
  } = useWhopData();

  const upcomingBookings = getUpcomingBookings();
  const activeServices = getActiveServices();

  // Show loading state while data is being fetched
  if (userLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-whop-bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-whop-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-whop-text dark:text-whop-text-dark mb-3 font-inter">
            Loading Services...
          </h1>
          <p className="text-whop-text dark:text-whop-text-dark font-inter">
            Getting everything ready for you
          </p>
        </div>
      </div>
    );
  }

  async function persistAvailability(next: WeeklyAvailability) {
    try {
      await saveAvailability(next);
    } catch (error) {
      console.error('Failed to save availability:', error);
    }
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
    const newService = {
      id: '',
      name: '',
      description: '',
      price: 50,
      duration_minutes: 60,
      status: 'active' as const
    };
    setEditingService(newService);
    setShowAddService(true);
  }

  async function saveService() {
    if (!editingService?.name || !editingService?.price || !editingService?.duration_minutes) return;
    
    // Validate service data
    const validation = validateService(editingService);
    if (!validation.isValid) {
      alert(`Please fix the following errors:\n${validation.errors.join('\n')}`);
      return;
    }
    
    try {
      if (editingService.id) {
        // Update existing service
        await updateService(editingService.id, {
          name: editingService.name.trim(),
          description: editingService.description?.trim() || '',
          price: editingService.price,
          duration_minutes: editingService.duration_minutes
        });
      } else {
        // Add new service
        await addServiceToDB({
          name: editingService.name.trim(),
          description: editingService.description?.trim() || '',
          price: editingService.price,
          duration_minutes: editingService.duration_minutes,
          status: 'active'
        });
      }

      setEditingService(null);
      setShowAddService(false);
    } catch (error) {
      console.error('Failed to save service:', error);
      alert('Failed to save service. Please try again.');
    }
  }

  function validateService(service: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!service.name || service.name.trim().length < 2) {
      errors.push('Service name must be at least 2 characters');
    }
    
    if (!service.description || service.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters');
    }
    
    if (service.price <= 0) {
      errors.push('Price must be greater than $0');
    }
    
    if (service.duration_minutes < 15 || service.duration_minutes > 480) {
      errors.push('Duration must be between 15 minutes and 8 hours');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  async function deleteService(serviceId: string) {
    try {
      await deleteServiceFromDB(serviceId);
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  }

  async function toggleServiceActive(serviceId: string) {
    try {
      await toggleServiceStatus(serviceId);
    } catch (error) {
      console.error('Failed to toggle service:', error);
    }
  }

  const totalRevenue = upcomingBookings.reduce((sum, booking) => sum + booking.total_price, 0);
  const activeServicesCount = services.filter(s => s.status === 'active').length;
  const availableDaysCount = Object.values(availability).filter(day => day.length > 0).length;

  return (
    <div className="min-h-screen bg-white dark:bg-whop-bg-dark">
      {/* Header */}
      <div className="bg-white dark:bg-whop-bg-dark border-b border-whop-line dark:border-whop-line px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-whop-text dark:text-whop-text-dark font-inter">
            Dashboard
          </h1>
          <div className="text-sm text-whop-text dark:text-whop-text-dark bg-gray-100 dark:bg-whop-line-dark px-3 py-1 rounded-lg font-inter">
            Welcome, {user?.first_name || 'User'}!
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-whop-bg-dark border-b border-whop-line dark:border-whop-line">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'services', label: 'Services', icon: '⚙️' },
              { id: 'availability', label: 'Availability', icon: '📅' },
              { id: 'bookings', label: 'Bookings', icon: '📋' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm font-inter transition-colors ${
                  activeTab === tab.id
                    ? 'border-whop-blue text-whop-blue'
                    : 'border-transparent text-whop-text dark:text-whop-text-dark hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-whop-bg-dark rounded-2xl p-6 border border-whop-line dark:border-whop-line shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-whop-text dark:text-whop-text-dark font-inter">Total Revenue</p>
                    <p className="text-2xl font-bold text-whop-text dark:text-whop-text-dark font-inter">${totalRevenue}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-whop-bg-dark rounded-2xl p-6 border border-whop-line dark:border-whop-line shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-whop-text dark:text-whop-text-dark font-inter">Upcoming Bookings</p>
                    <p className="text-2xl font-bold text-whop-text dark:text-whop-text-dark font-inter">{upcomingBookings.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-whop-bg-dark rounded-2xl p-6 border border-whop-line dark:border-whop-line shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-whop-text dark:text-whop-text-dark font-inter">Active Services</p>
                    <p className="text-2xl font-bold text-whop-text dark:text-whop-text-dark font-inter">{activeServicesCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-whop-bg-dark rounded-2xl p-6 border border-whop-line dark:border-whop-line shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-whop-blue/10 dark:bg-whop-blue/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-whop-blue dark:text-whop-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-whop-text dark:text-whop-text-dark font-inter">Available Days</p>
                    <p className="text-2xl font-bold text-whop-text dark:text-whop-text-dark font-inter">{availableDaysCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white dark:bg-whop-bg-dark rounded-2xl p-6 border border-whop-line dark:border-whop-line shadow-sm">
              <h3 className="text-lg font-semibold text-whop-text dark:text-whop-text-dark mb-4 font-inter">Recent Bookings</h3>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-3">
                  {upcomingBookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-whop-line-dark rounded-lg">
                      <div>
                        <p className="font-medium text-whop-text dark:text-whop-text-dark font-inter">{booking.customer_name}</p>
                        <p className="text-sm text-whop-text dark:text-whop-text-dark font-inter">{new Date(booking.booking_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-whop-text dark:text-whop-text-dark font-inter">${booking.total_price}</p>
                        <p className="text-sm text-whop-text dark:text-whop-text-dark font-inter">{booking.start_time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-whop-text dark:text-whop-text-dark font-inter">No upcoming bookings</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-whop-text dark:text-whop-text-dark font-inter">Services</h2>
              <button
                onClick={addService}
                className="px-4 py-2 bg-whop-blue text-white rounded-lg hover:bg-whop-blue/90 transition-colors font-inter"
              >
                Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white dark:bg-whop-bg-dark rounded-2xl p-6 border border-whop-line dark:border-whop-line shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-whop-text dark:text-whop-text-dark font-inter">{service.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleServiceActive(service.id)}
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          service.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}
                      >
                        {service.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setShowAddService(true);
                        }}
                        className="text-whop-blue hover:text-whop-blue/80"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-whop-text dark:text-whop-text-dark mb-4 font-inter">{service.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-whop-text dark:text-whop-text-dark font-inter">{service.duration_minutes} min</span>
                    <span className="text-xl font-bold text-whop-blue font-inter">${service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-whop-text dark:text-whop-text-dark font-inter">Availability</h2>
              <button
                onClick={() => saveAvailability(availability)}
                className="px-4 py-2 bg-whop-blue text-white rounded-lg hover:bg-whop-blue/90 transition-colors font-inter"
              >
                Save
              </button>
            </div>

            <div className="bg-white dark:bg-whop-bg-dark rounded-2xl p-6 border border-whop-line dark:border-whop-line shadow-sm">
              <div className="grid grid-cols-7 gap-4 mb-6">
                {weekLabels.map((day, dayIndex) => (
                  <div key={day} className="text-center">
                    <div className="text-sm font-medium text-whop-text dark:text-whop-text-dark mb-2 font-inter">{day}</div>
                    <button
                      onClick={() => toggleDayEnabled(dayIndex as Weekday)}
                      className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        availability[dayIndex].length > 0
                          ? 'bg-whop-blue text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-whop-text dark:text-whop-text-dark hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {availability[dayIndex].length > 0 ? 'Available' : 'Unavailable'}
                    </button>
                  </div>
                ))}
              </div>

              {Object.entries(availability).map(([dayIndex, windows], index) => (
                windows.length > 0 && (
                  <div key={dayIndex} className="mb-6 p-4 bg-gray-50 dark:bg-whop-line-dark rounded-lg">
                    <h4 className="font-medium text-whop-text dark:text-whop-text-dark mb-3 font-inter">
                      {weekLabels[parseInt(dayIndex)]} - Time Windows
                    </h4>
                    <div className="space-y-3">
                      {windows.map((window, windowIndex) => (
                        <div key={windowIndex} className="flex items-center space-x-3">
                          <input
                            type="time"
                            value={window.start}
                            onChange={(e) => updateWindow(parseInt(dayIndex) as Weekday, windowIndex, 'start', e.target.value)}
                            className="px-3 py-2 border border-whop-line dark:border-whop-line rounded-lg bg-white dark:bg-whop-bg-dark text-whop-text dark:text-whop-text-dark focus:ring-2 focus:ring-whop-blue focus:border-transparent font-inter"
                          />
                          <span className="text-whop-text dark:text-whop-text-dark font-inter">to</span>
                          <input
                            type="time"
                            value={window.end}
                            onChange={(e) => updateWindow(parseInt(dayIndex) as Weekday, windowIndex, 'end', e.target.value)}
                            className="px-3 py-2 border border-whop-line dark:border-whop-line rounded-lg bg-white dark:bg-whop-bg-dark text-whop-text dark:text-whop-text-dark focus:ring-2 focus:ring-whop-blue focus:border-transparent font-inter"
                          />
                          <button
                            onClick={() => removeWindow(parseInt(dayIndex) as Weekday, windowIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addWindow(parseInt(dayIndex) as Weekday)}
                        className="w-full text-xs text-whop-blue hover:text-whop-blue/80 py-1 font-inter"
                      >
                        + Add Time Window
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-whop-text dark:text-whop-text-dark font-inter">Bookings</h2>
            
            <div className="bg-white dark:bg-whop-bg-dark rounded-2xl p-6 border border-whop-line dark:border-whop-line shadow-sm">
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-whop-line-dark rounded-lg">
                      <div>
                        <p className="font-medium text-whop-text dark:text-whop-text-dark font-inter">{booking.customer_name}</p>
                        <p className="text-sm text-whop-text dark:text-whop-text-dark font-inter">{booking.customer_email}</p>
                        <p className="text-sm text-whop-text dark:text-whop-text-dark font-inter">
                          {new Date(booking.booking_date).toLocaleDateString()} at {booking.start_time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-whop-text dark:text-whop-text-dark font-inter">${booking.total_price}</p>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-whop-text dark:text-whop-text-dark font-inter">No bookings yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-whop-text dark:text-whop-text-dark font-inter">Settings</h2>
            
            <div className="bg-white dark:bg-whop-bg-dark rounded-2xl p-6 border border-whop-line dark:border-whop-line shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-whop-text dark:text-whop-text-dark mb-2 font-inter">Account Information</h3>
                  <div className="text-sm text-whop-text dark:text-whop-text-dark font-inter">
                    <p>Connected to Whop account: {user?.email}</p>
                    <p>Company: {user?.company_id || 'Personal Account'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-whop-bg-dark rounded-2xl p-6 w-full max-w-md border border-whop-line dark:border-whop-line">
            <h3 className="text-lg font-semibold text-whop-text dark:text-whop-text-dark mb-4 font-inter">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-whop-text dark:text-whop-text-dark mb-1 font-inter">
                  Service Name
                </label>
                <input
                  type="text"
                  value={editingService?.name || ''}
                  onChange={(e) => setEditingService((prev: any) => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-whop-line dark:border-whop-line rounded-lg bg-white dark:bg-whop-bg-dark text-whop-text dark:text-whop-text-dark focus:ring-2 focus:ring-whop-blue focus:border-transparent font-inter"
                  placeholder="e.g., Consultation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-whop-text dark:text-whop-text-dark mb-1 font-inter">
                  Description
                </label>
                <textarea
                  value={editingService?.description || ''}
                  onChange={(e) => setEditingService((prev: any) => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-whop-line dark:border-whop-line rounded-lg bg-white dark:bg-whop-bg-dark text-whop-text dark:text-whop-text-dark focus:ring-2 focus:ring-whop-blue focus:border-transparent font-inter"
                  rows={3}
                  placeholder="Describe your service..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-whop-text dark:text-whop-text-dark mb-1 font-inter">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={editingService?.price || ''}
                    onChange={(e) => setEditingService((prev: any) => prev ? { ...prev, price: Number(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-whop-line dark:border-whop-line rounded-lg bg-white dark:bg-whop-bg-dark text-whop-text dark:text-whop-text-dark focus:ring-2 focus:ring-whop-blue focus:border-transparent font-inter"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-whop-text dark:text-whop-text-dark mb-1 font-inter">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={editingService?.duration_minutes || ''}
                    onChange={(e) => setEditingService((prev: any) => prev ? { ...prev, duration_minutes: Number(e.target.value) } : null)}
                    className="w-full px-3 py-2 border border-whop-line dark:border-whop-line rounded-lg bg-white dark:bg-whop-bg-dark text-whop-text dark:text-whop-text-dark focus:ring-2 focus:ring-whop-blue focus:border-transparent font-inter"
                    min="15"
                    step="15"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setEditingService(null);
                  setShowAddService(false);
                }}
                className="flex-1 px-4 py-2 border border-whop-line dark:border-whop-line text-whop-text dark:text-whop-text-dark rounded-lg hover:bg-gray-50 dark:hover:bg-whop-line-dark transition-colors font-inter"
              >
                Cancel
              </button>
              <button
                onClick={saveService}
                className="flex-1 px-4 py-2 bg-whop-blue text-white rounded-lg hover:bg-whop-blue/90 transition-colors font-inter"
              >
                {editingService ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
