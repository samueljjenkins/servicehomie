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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [quickAddDay, setQuickAddDay] = useState<Weekday | null>(null);
  const [globalWorkingHours, setGlobalWorkingHours] = useState({ start: "09:00", end: "17:00" });

  // Load global working hours from localStorage on component mount
  useEffect(() => {
    const savedHours = localStorage.getItem('globalWorkingHours');
    if (savedHours) {
      try {
        const parsed = JSON.parse(savedHours);
        setGlobalWorkingHours(parsed);
      } catch (error) {
        console.error('Failed to parse saved working hours:', error);
      }
    }
  }, []);

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

  // Debug logging
  console.log('Dashboard render - availability:', availability);
  console.log('Dashboard render - availability type:', typeof availability);
  console.log('Dashboard render - availability is array:', Array.isArray(availability));

  // Helper function to get calendar days for current month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Generate 42 days (6 weeks) to ensure we cover the month
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Show loading state while data is being fetched
  if (userLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-whop-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3">
            Loading Services...
          </h1>
          <p className="text-muted-foreground">
            Getting everything ready for you
          </p>
        </div>
      </div>
    );
  }

  async function persistAvailability(next: WeeklyAvailability) {
    console.log('persistAvailability called with:', next);
    try {
      await saveAvailability(next);
      console.log('Availability saved successfully');
    } catch (error) {
      console.error('Failed to save availability:', error);
    }
  }

  function toggleDayEnabled(dayIndex: Weekday) {
    console.log('toggleDayEnabled called with dayIndex:', dayIndex);
    console.log('Current availability:', availability);
    
    if (!availability || !Array.isArray(availability)) {
      console.error('Availability is not properly initialized:', availability);
      return;
    }
    
    const windows = availability[dayIndex] || [];
    console.log('Windows for day', dayIndex, ':', windows);
    
    const next = [...availability];
    if (windows.length > 0) {
      // Remove availability for this day
      next[dayIndex] = [];
      console.log('Removing availability for day', dayIndex);
    } else {
      // Add availability for this day with global working hours
      next[dayIndex] = [{ start: globalWorkingHours.start, end: globalWorkingHours.end }];
      console.log('Adding availability for day', dayIndex);
    }
    
    console.log('New availability:', next);
    persistAvailability(next);
  }

  // Helper function to check if a specific calendar day is available
  function isSpecificDayAvailable(day: Date): boolean {
    // For now, we'll use the day of week availability
    // In the future, this could be expanded to handle specific date exceptions
    const dayOfWeek = day.getDay() as Weekday;
    return availability[dayOfWeek] && availability[dayOfWeek].length > 0;
  }

  // Function to toggle a specific calendar day
  function toggleSpecificDay(day: Date) {
    const dayOfWeek = day.getDay() as Weekday;
    toggleDayEnabled(dayOfWeek);
  }

  // Function to save all availability data including global working hours
  async function saveAllAvailability() {
    try {
      // Save the availability array
      await saveAvailability(availability);
      
      // Save global working hours to localStorage for now
      // In the future, this could be saved to Supabase as well
      localStorage.setItem('globalWorkingHours', JSON.stringify(globalWorkingHours));
      
      console.log('All availability data saved successfully');
    } catch (error) {
      console.error('Failed to save availability data:', error);
    }
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Dashboard
          </h1>
          <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-lg">
            Welcome, {user?.first_name || 'User'}!
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
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
              className={`py-4 px-3 font-medium text-sm transition-all duration-200 relative ${
                activeTab === tab.id
                  ? 'text-whop-blue'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-whop-blue rounded-full transform scale-x-100 transition-transform duration-200" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">${totalRevenue}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Upcoming Bookings</p>
                    <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Active Services</p>
                    <p className="text-2xl font-bold">{activeServicesCount}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-whop-blue/10 dark:bg-whop-blue/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-whop-blue dark:text-whop-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Available Days</p>
                    <p className="text-2xl font-bold">{availableDaysCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="rounded-2xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-3">
                  {upcomingBookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{booking.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{new Date(booking.booking_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${booking.total_price}</p>
                        <p className="text-sm text-muted-foreground">{booking.start_time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No upcoming bookings</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Services</h2>
              <button
                onClick={addService}
                className="px-4 py-2 bg-whop-blue text-white rounded-lg hover:bg-whop-blue/90 transition-colors"
              >
                Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="rounded-2xl p-6 border shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold">{service.name}</h3>
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
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{service.duration_minutes} min</span>
                    <span className="text-xl font-bold text-whop-blue">${service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Availability</h2>
              <button
                onClick={() => saveAllAvailability()}
                className="px-4 py-2 bg-whop-blue text-white rounded-lg hover:bg-whop-blue/90 transition-colors"
              >
                Save
              </button>
            </div>

            {/* Global Days & Working Hours */}
            <div className="rounded-2xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Global Availability Settings</h3>
              
              {/* Days of the Week Selector */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 text-foreground">Select which days you're available each week</h4>
                <div className="grid grid-cols-7 gap-3">
                  {weekLabels.map((day, dayIndex) => (
                    <div key={day} className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-2">{day}</div>
                      <button
                        onClick={() => toggleDayEnabled(dayIndex as Weekday)}
                        className={`w-full py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          availability[dayIndex] && availability[dayIndex].length > 0
                            ? 'bg-whop-blue text-white shadow-md'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent hover:border-whop-blue/20'
                        }`}
                      >
                        {availability[dayIndex] && availability[dayIndex].length > 0 ? 'Available' : 'Unavailable'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Global Working Hours */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-foreground">Working Hours (applies to all selected days)</h4>
                <div className="flex items-center space-x-3">
                  <input
                    type="time"
                    value={globalWorkingHours.start}
                    onChange={(e) => setGlobalWorkingHours(prev => ({ ...prev, start: e.target.value }))}
                    className="px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-whop-blue focus:border-transparent"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="time"
                    value={globalWorkingHours.end}
                    onChange={(e) => setGlobalWorkingHours(prev => ({ ...prev, end: e.target.value }))}
                    className="px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-whop-blue focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Working Hours Configuration */}
            <div className="rounded-2xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Working Hours</h3>
              <div className="space-y-4">
                {Object.entries(availability).map(([dayIndex, windows], index) => (
                  windows.length > 0 && (
                    <div key={dayIndex} className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-3 text-foreground">
                        {weekLabels[parseInt(dayIndex)]} - Working Hours
                      </h4>
                      <div className="space-y-3">
                        {windows.map((window, windowIndex) => (
                          <div key={windowIndex} className="flex items-center space-x-3">
                            <input
                              type="time"
                              value={window.start}
                              onChange={(e) => updateWindow(parseInt(dayIndex) as Weekday, windowIndex, 'start', e.target.value)}
                              className="px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-whop-blue focus:border-transparent"
                            />
                            <span className="text-muted-foreground">to</span>
                            <input
                              type="time"
                              value={window.end}
                              onChange={(e) => updateWindow(parseInt(dayIndex) as Weekday, windowIndex, 'end', e.target.value)}
                              className="px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-whop-blue focus:border-transparent"
                            />
                            <button
                              onClick={() => removeWindow(parseInt(dayIndex) as Weekday, windowIndex)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addWindow(parseInt(dayIndex) as Weekday)}
                          className="w-full text-sm text-whop-blue hover:text-whop-blue/80 py-2 px-3 border border-whop-blue/20 rounded-lg hover:bg-whop-blue/5 transition-colors"
                        >
                          + Add Time Window
                        </button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Clean Interactive Calendar */}
            <div className="rounded-2xl p-6 border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Calendar</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-lg font-medium">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              

              
              <div className="bg-muted rounded-lg p-4">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {weekLabels.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {getCalendarDays().map((day, index) => {
                    if (!day) {
                      return <div key={index} className="h-14" />;
                    }
                    
                    const dayOfWeek = day.getDay();
                    const isAvailable = availability[dayOfWeek] && availability[dayOfWeek].length > 0;
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                    
                    return (
                      <div key={index} className="relative">
                        <button
                          onClick={() => toggleSpecificDay(day)}
                          className={`w-full h-14 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                            isSpecificDayAvailable(day)
                              ? 'bg-whop-blue text-white shadow-md hover:bg-whop-blue/90'
                              : isCurrentMonth
                              ? 'bg-background text-foreground hover:bg-muted border border-transparent hover:border-whop-blue/30'
                              : 'bg-muted/50 text-muted-foreground'
                          } ${isToday ? 'ring-2 ring-whop-blue ring-offset-2' : ''}`}
                        >
                          <span className="text-sm font-medium">
                            {day.getDate()}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                {/* Simple Legend */}
                <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-whop-blue rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-background border rounded"></div>
                    <span>Unavailable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Bookings</h2>
            
            <div className="rounded-2xl p-6 border shadow-sm">
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{booking.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{booking.customer_email}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.booking_date).toLocaleDateString()} at {booking.start_time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${booking.total_price}</p>
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
                <p className="text-muted-foreground">No bookings yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            
            <div className="rounded-2xl p-6 border shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                  <div className="text-sm text-muted-foreground">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="rounded-2xl p-6 w-full max-w-md border bg-background shadow-xl">
            <h3 className="text-lg font-semibold mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  value={editingService?.name || ''}
                  onChange={(e) => setEditingService((prev: any) => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-whop-blue focus:border-transparent"
                  placeholder="e.g., Consultation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={editingService?.description || ''}
                  onChange={(e) => setEditingService((prev: any) => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-whop-blue focus:border-transparent"
                  rows={3}
                  placeholder="Describe your service..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={editingService?.price || ''}
                    onChange={(e) => setEditingService((prev: any) => prev ? { ...prev, price: Number(e.target.value) } : null)}
                    className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-whop-blue focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    value={editingService?.duration_minutes || ''}
                    onChange={(e) => setEditingService((prev: any) => prev ? { ...prev, duration_minutes: Number(e.target.value) } : null)}
                    className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-whop-blue focus:border-transparent"
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
                className="flex-1 px-4 py-2 border text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveService}
                className="flex-1 px-4 py-2 bg-whop-blue text-white rounded-lg hover:bg-whop-blue/90 transition-colors"
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
