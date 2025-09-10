"use client";

import { useState, useEffect } from "react";
import { useWhopUser } from "@/lib/hooks/useWhopUser";
import { useWhopData } from "@/lib/hooks/useWhopData";
import { useCustomerManagement } from "@/lib/hooks/useCustomerManagement";
import { useJobManagement } from "@/lib/hooks/useJobManagement";
import { useTechnicianManagement } from "@/lib/hooks/useTechnicianManagement";
import type { WeeklyAvailability, Weekday, TimeWindow } from "@/lib/availability";

const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export default function CreatorDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'availability' | 'bookings' | 'customers' | 'jobs' | 'technicians' | 'inventory' | 'analytics' | 'settings'>('overview');
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [quickAddDay, setQuickAddDay] = useState<Weekday | null>(null);
  const [globalWorkingHours, setGlobalWorkingHours] = useState({ start: "09:00", end: "17:00" });
  const [specificDatesAvailability, setSpecificDatesAvailability] = useState<Set<string>>(new Set());
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);
  const [showAddTechnician, setShowAddTechnician] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [editingTechnician, setEditingTechnician] = useState<any>(null);

  // Load global working hours and specific dates from localStorage on component mount
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

    const savedSpecificDates = localStorage.getItem('specificDatesAvailability');
    if (savedSpecificDates) {
      try {
        const parsed = JSON.parse(savedSpecificDates);
        setSpecificDatesAvailability(new Set(parsed));
      } catch (error) {
        console.error('Failed to parse saved specific dates:', error);
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

  // New management hooks
  const {
    customers,
    loading: customersLoading,
    addCustomer: addCustomerToDB,
    updateCustomer,
    deleteCustomer,
    getTopCustomers,
    getRecentCustomers
  } = useCustomerManagement();

  const {
    jobs,
    loading: jobsLoading,
    addJob: addJobToDB,
    updateJob,
    deleteJob,
    getTodaysJobs,
    getUpcomingJobs,
    getOverdueJobs,
    getJobStats
  } = useJobManagement();

  const {
    technicians,
    loading: techniciansLoading,
    addTechnician: addTechnicianToDB,
    updateTechnician,
    deleteTechnician,
    getActiveTechnicians,
    getTopTechnicians,
    getTeamStats
  } = useTechnicianManagement();

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
  if (userLoading || dataLoading || customersLoading || jobsLoading || techniciansLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-whop-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show message when no user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-whop-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">
            Please sign in to access your dashboard. This app requires Whop authentication to function properly.
          </p>
          <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
            <p>This is a Whop app that needs to be accessed through the Whop platform.</p>
          </div>
        </div>
      </div>
    );
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
    // Save to Supabase - this will update the hook's state
    saveAvailability(next);
  }

  // Helper function to check if a specific calendar day is available
  function isSpecificDayAvailable(day: Date): boolean {
    const dateString = day.toDateString();
    
    // First check if this specific date has been manually overridden
    if (specificDatesAvailability.has(dateString)) {
      return true; // This specific date is manually selected
    }
    
    // Check if this specific date has been explicitly deselected
    if (specificDatesAvailability.has(`!${dateString}`)) {
      return false; // This specific date is explicitly deselected
    }
    
    // If no manual override, check if the day of the week is generally available
    const dayOfWeek = day.getDay();
    const isWeekdayAvailable = availability[dayOfWeek] && availability[dayOfWeek].length > 0;
    
    return isWeekdayAvailable;
  }

  // Function to toggle a specific calendar day
  function toggleSpecificDay(day: Date) {
    const dateString = day.toDateString();
    const dayOfWeek = day.getDay();
    const isWeekdayAvailable = availability[dayOfWeek] && availability[dayOfWeek].length > 0;
    
    console.log('toggleSpecificDay called for date:', dateString);
    console.log('Day of week:', dayOfWeek, 'Weekday available:', isWeekdayAvailable);
    console.log('Current specificDatesAvailability:', Array.from(specificDatesAvailability));
    
    const newSpecificDates = new Set(specificDatesAvailability);
    
    // Check current state of this specific day
    const isCurrentlyAvailable = isSpecificDayAvailable(day);
    
    if (isCurrentlyAvailable) {
      // Day is currently available, so deselect it
      if (newSpecificDates.has(dateString)) {
        // Remove explicit selection
        newSpecificDates.delete(dateString);
        console.log('Removed explicit selection:', dateString);
      }
      // Add explicit deselection to override weekly pattern
      newSpecificDates.add(`!${dateString}`);
      console.log('Added explicit deselection:', `!${dateString}`);
    } else {
      // Day is currently unavailable, so select it
      // Remove any explicit deselection
      newSpecificDates.delete(`!${dateString}`);
      // Add explicit selection
      newSpecificDates.add(dateString);
      console.log('Added explicit selection:', dateString);
    }
    
    console.log('New specificDatesAvailability:', Array.from(newSpecificDates));
    setSpecificDatesAvailability(newSpecificDates);
  }

  // Function to save all availability data including global working hours
  async function saveAllAvailability() {
    try {
      // Save the availability array (weekly pattern)
      await saveAvailability(availability);
      
      // Save global working hours to localStorage
      localStorage.setItem('globalWorkingHours', JSON.stringify(globalWorkingHours));
      
      // Save specific dates availability to localStorage
      localStorage.setItem('specificDatesAvailability', JSON.stringify(Array.from(specificDatesAvailability)));
      
      console.log('All availability data saved successfully');
    } catch (error) {
      console.error('Failed to save availability data:', error);
    }
  }



  function addService() {
    const newService = {
      id: '',
      name: '',
      description: '',
      price: 50,
      duration_minutes: 60,
      status: 'active' as const,
      category: 'General',
      service_area: 'Local'
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
          status: 'active',
          category: editingService.category || 'General',
          service_area: editingService.service_area || 'Local'
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

  // Generate invoice for a booking
  function generateInvoice(booking: any) {
    const service = services.find(s => s.id === booking.service_id);
    const invoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      customer: {
        name: booking.customer_name,
        email: booking.customer_email,
        phone: booking.customer_phone,
        address: booking.customer_address
      },
      service: {
        name: service?.name || 'Unknown Service',
        description: service?.description || '',
        price: booking.total_price,
        duration: service?.duration_minutes || 0
      },
      booking: {
        date: new Date(booking.booking_date).toLocaleDateString(),
        time: booking.start_time,
        notes: booking.notes
      }
    };

    // Create and download invoice PDF
    const invoiceContent = `
      INVOICE
      
      Invoice #: ${invoiceData.invoiceNumber}
      Date: ${invoiceData.date}
      
      BILL TO:
      ${invoiceData.customer.name}
      ${invoiceData.customer.email}
      ${invoiceData.customer.phone}
      ${invoiceData.customer.address}
      
      SERVICE DETAILS:
      ${invoiceData.service.name}
      ${invoiceData.service.description}
      Duration: ${invoiceData.service.duration} minutes
      Date: ${invoiceData.booking.date}
      Time: ${invoiceData.booking.time}
      
      ${invoiceData.booking.notes ? `Notes: ${invoiceData.booking.notes}` : ''}
      
      TOTAL: $${invoiceData.service.price}
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceData.invoiceNumber}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Update booking status
  async function updateBookingStatus(bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
    try {
      await updateBooking(bookingId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update booking status:', error);
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
        <nav className="flex space-x-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'services', label: 'Services', icon: '⚙️' },
            { id: 'availability', label: 'Availability', icon: '📅' },
            { id: 'bookings', label: 'Bookings', icon: '📋' },
            { id: 'customers', label: 'Customers', icon: '👥' },
            { id: 'jobs', label: 'Jobs', icon: '🔧' },
            { id: 'technicians', label: 'Technicians', icon: '👷' },
            { id: 'inventory', label: 'Inventory', icon: '📦' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                    <p className="text-2xl font-bold">{jobs.filter(job => job.status === 'in_progress').length}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                    <p className="text-2xl font-bold">{customers.length}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Active Technicians</p>
                    <p className="text-2xl font-bold">{technicians.filter(t => t.status === 'active').length}</p>
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
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{service.duration_minutes} min</span>
                    <span className="text-xl font-bold text-whop-blue">${service.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-full">
                      {service.category}
                    </span>
                    <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-2 py-1 rounded-full">
                      {service.service_area}
                    </span>
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

            {/* Availability Settings */}
            <div className="rounded-2xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Availability Settings</h3>
              
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
              
              {/* Working Hours */}
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
                    
                    const isSpecificDaySelected = isSpecificDayAvailable(day);
                    const isToday = day.toDateString() === new Date().toDateString();
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                    
                    return (
                      <div key={index} className="relative">
                        <button
                          onClick={() => toggleSpecificDay(day)}
                          className={`w-full h-14 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                            isSpecificDaySelected
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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Bookings</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setCurrentMonth(new Date())}
                  className="px-4 py-2 border border-whop-blue text-whop-blue rounded-lg hover:bg-whop-blue hover:text-white transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    today.setDate(today.getDate() + 1);
                    setCurrentMonth(today);
                  }}
                  className="px-4 py-2 border border-whop-blue text-whop-blue rounded-lg hover:bg-whop-blue hover:text-white transition-colors"
                >
                  Tomorrow
                </button>
              </div>
            </div>

            {/* Booking Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {bookings.filter(b => b.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {bookings.filter(b => b.status === 'confirmed').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold text-purple-600">${totalRevenue}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div className="rounded-2xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">All Bookings</h3>
              {bookings.length > 0 ? (
                <div className="space-y-3">
                  {bookings.map((booking) => {
                    const service = services.find(s => s.id === booking.service_id);
                    return (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className={`w-3 h-3 rounded-full ${
                                booking.status === 'pending' ? 'bg-yellow-500' :
                                booking.status === 'confirmed' ? 'bg-blue-500' :
                                booking.status === 'completed' ? 'bg-green-500' :
                                'bg-red-500'
                              }`} />
                            </div>
                            <div>
                              <p className="font-medium">{booking.customer_name}</p>
                              <p className="text-sm text-muted-foreground">{service?.name || 'Unknown Service'}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(booking.booking_date).toLocaleDateString()} at {booking.start_time}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">${booking.total_price}</span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => generateInvoice(booking)}
                              className="px-3 py-1 text-xs bg-whop-blue text-white rounded hover:bg-whop-blue/90 transition-colors"
                            >
                              Invoice
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              disabled={booking.status === 'confirmed' || booking.status === 'completed'}
                              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'completed')}
                              disabled={booking.status === 'completed'}
                              className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Complete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No bookings yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Customer Management</h2>
              <button
                onClick={() => {
                  setEditingCustomer(null);
                  setShowAddCustomer(true);
                }}
                className="px-4 py-2 bg-whop-blue text-white rounded-lg hover:bg-whop-blue/90 transition-colors"
              >
                Add Customer
              </button>
            </div>

            {/* Customer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                    <p className="text-2xl font-bold">{bookings.length > 0 ? new Set(bookings.map(b => b.customer_email)).size : 0}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Repeat Customers</p>
                    <p className="text-2xl font-bold">
                      {bookings.length > 0 ? 
                        Array.from(new Set(bookings.map(b => b.customer_email)))
                          .filter(email => bookings.filter(b => b.customer_email === email).length > 1).length : 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Avg. Customer Value</p>
                    <p className="text-2xl font-bold">
                      ${bookings.length > 0 ? 
                        (bookings.reduce((sum, b) => sum + b.total_price, 0) / new Set(bookings.map(b => b.customer_email)).size).toFixed(0) : 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                    <p className="text-2xl font-bold">
                      {bookings.length > 0 ? 
                        Math.round((bookings.filter(b => new Date(b.created_at) > new Date(Date.now() - 30*24*60*60*1000)).length / 
                        bookings.filter(b => new Date(b.created_at) > new Date(Date.now() - 60*24*60*60*1000)).length - 1) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer List */}
            <div className="rounded-2xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Recent Customers</h3>
              {bookings.length > 0 ? (
                <div className="space-y-3">
                  {Array.from(new Set(bookings.map(b => b.customer_email)))
                    .slice(0, 10)
                    .map(email => {
                      const customerBookings = bookings.filter(b => b.customer_email === email);
                      const totalSpent = customerBookings.reduce((sum, b) => sum + b.total_price, 0);
                      const lastBooking = customerBookings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
                      
                      return (
                        <div key={email} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{lastBooking.customer_name}</p>
                            <p className="text-sm text-muted-foreground">{email}</p>
                            <p className="text-xs text-muted-foreground">
                              {customerBookings.length} booking{customerBookings.length !== 1 ? 's' : ''} • Last: {new Date(lastBooking.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${totalSpent}</p>
                            <p className="text-sm text-muted-foreground">{lastBooking.customer_phone || 'No phone'}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-muted-foreground">No customers yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Job Management</h2>
              <button
                onClick={() => {
                  setEditingJob(null);
                  setShowAddJob(true);
                }}
                className="px-4 py-2 bg-whop-blue text-white rounded-lg hover:bg-whop-blue/90 transition-colors"
              >
                Create Job
              </button>
            </div>

            {/* Job Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                    <p className="text-2xl font-bold">{jobs.length}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                    <p className="text-2xl font-bold">{jobs.filter(job => job.status === 'scheduled').length}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{jobs.filter(job => job.status === 'completed').length}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                    <p className="text-2xl font-bold">{getOverdueJobs().length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="rounded-2xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">All Jobs</h3>
              {jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`w-3 h-3 rounded-full ${
                              job.status === 'scheduled' ? 'bg-blue-500' :
                              job.status === 'in_progress' ? 'bg-yellow-500' :
                              job.status === 'completed' ? 'bg-green-500' :
                              job.status === 'cancelled' ? 'bg-red-500' :
                              'bg-gray-500'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium">{job.job_number} - {job.title}</p>
                            <p className="text-sm text-muted-foreground">{job.customer?.name || 'Unknown Customer'}</p>
                            <p className="text-xs text-muted-foreground">
                              {job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString() : 'No date set'}
                              {job.scheduled_start_time && ` at ${job.scheduled_start_time}`}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">${job.total_cost || 0}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingJob(job);
                              setShowAddJob(true);
                            }}
                            className="px-3 py-1 text-xs bg-whop-blue text-white rounded hover:bg-whop-blue/90 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => updateJob(job.id, { status: 'in_progress' })}
                            disabled={job.status === 'in_progress' || job.status === 'completed'}
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Start
                          </button>
                          <button
                            onClick={() => updateJob(job.id, { status: 'completed' })}
                            disabled={job.status === 'completed'}
                            className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Complete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No jobs yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'technicians' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Technician Management</h2>
              <button
                onClick={() => {
                  setEditingTechnician(null);
                  setShowAddTechnician(true);
                }}
                className="px-4 py-2 bg-whop-blue text-white rounded-lg hover:bg-whop-blue/90 transition-colors"
              >
                Add Technician
              </button>
            </div>

            {/* Technician Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Technicians</p>
                    <p className="text-2xl font-bold">{technicians.length}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold">{technicians.filter(t => t.status === 'active').length}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Avg. Rate</p>
                    <p className="text-2xl font-bold">
                      ${technicians.length > 0 ? 
                        Math.round(technicians.reduce((sum, t) => sum + (t.hourly_rate || 0), 0) / technicians.length) : 0}/hr
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                    <p className="text-2xl font-bold">
                      {technicians.reduce((sum, t) => sum + (t.total_jobs || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technicians List */}
            <div className="rounded-2xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">All Technicians</h3>
              {technicians.length > 0 ? (
                <div className="space-y-3">
                  {technicians.map((technician) => (
                    <div key={technician.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`w-3 h-3 rounded-full ${
                              technician.status === 'active' ? 'bg-green-500' :
                              technician.status === 'inactive' ? 'bg-red-500' :
                              'bg-yellow-500'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium">{technician.name}</p>
                            <p className="text-sm text-muted-foreground">{technician.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Skills: {technician.skills?.join(', ') || 'None'} • 
                              Jobs: {technician.total_jobs || 0} • 
                              Current: {technician.current_jobs || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">${technician.hourly_rate || 0}/hr</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingTechnician(technician);
                              setShowAddTechnician(true);
                            }}
                            className="px-3 py-1 text-xs bg-whop-blue text-white rounded hover:bg-whop-blue/90 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => updateTechnician(technician.id, { 
                              status: technician.status === 'active' ? 'inactive' : 'active' 
                            })}
                            className={`px-3 py-1 text-xs rounded transition-colors ${
                              technician.status === 'active' 
                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {technician.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No technicians yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Inventory Management</h2>
              <button
                onClick={() => {/* TODO: Add inventory modal */}}
                className="px-4 py-2 bg-whop-blue text-white rounded-lg hover:bg-whop-blue/90 transition-colors"
              >
                Add Item
              </button>
            </div>

            {/* Inventory Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold">$0</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Categories</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory List */}
            <div className="rounded-2xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Inventory Items</h3>
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-muted-foreground mb-4">No inventory items yet</p>
                <p className="text-sm text-muted-foreground">Start by adding parts, materials, and equipment to track your inventory.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Business Analytics</h2>
            
            {/* Revenue Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl p-6 border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Revenue</span>
                    <span className="font-bold text-green-600">${totalRevenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="font-medium">
                      ${bookings
                        .filter(b => new Date(b.booking_date) >= new Date(new Date().getFullYear(), new Date().getMonth(), 1))
                        .reduce((sum, b) => sum + b.total_price, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Month</span>
                    <span className="font-medium">
                      ${bookings
                        .filter(b => {
                          const lastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
                          const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                          return new Date(b.booking_date) >= lastMonth && new Date(b.booking_date) < thisMonth;
                        })
                        .reduce((sum, b) => sum + b.total_price, 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Service Performance</h3>
                <div className="space-y-3">
                  {services.slice(0, 5).map(service => {
                    const serviceBookings = bookings.filter(b => b.service_id === service.id);
                    const serviceRevenue = serviceBookings.reduce((sum, b) => sum + b.total_price, 0);
                    return (
                      <div key={service.id} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground truncate">{service.name}</span>
                        <span className="font-medium">${serviceRevenue}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl p-6 border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Booking Trends</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Bookings</span>
                    <span className="font-bold">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-medium text-yellow-600">
                      {bookings.filter(b => b.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confirmed</span>
                    <span className="font-medium text-blue-600">
                      {bookings.filter(b => b.status === 'confirmed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-medium text-green-600">
                      {bookings.filter(b => b.status === 'completed').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Analytics */}
            <div className="rounded-2xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Customer Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Top Customers by Revenue</h4>
                  <div className="space-y-2">
                    {bookings.length > 0 ? 
                      Array.from(new Set(bookings.map(b => b.customer_email)))
                        .map(email => {
                          const customerBookings = bookings.filter(b => b.customer_email === email);
                          const totalSpent = customerBookings.reduce((sum, b) => sum + b.total_price, 0);
                          return { email, totalSpent, name: customerBookings[0].customer_name };
                        })
                        .sort((a, b) => b.totalSpent - a.totalSpent)
                        .slice(0, 5)
                        .map((customer, index) => (
                          <div key={customer.email} className="flex justify-between items-center p-2 bg-muted rounded">
                            <div className="flex items-center">
                              <span className="w-6 h-6 bg-whop-blue text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">
                                {index + 1}
                              </span>
                              <span className="font-medium">{customer.name}</span>
                            </div>
                            <span className="font-bold">${customer.totalSpent}</span>
                          </div>
                        )) : 
                      <p className="text-muted-foreground">No customer data yet</p>
                    }
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Service Popularity</h4>
                  <div className="space-y-2">
                    {services.map(service => {
                      const serviceBookings = bookings.filter(b => b.service_id === service.id);
                      const bookingCount = serviceBookings.length;
                      const totalRevenue = serviceBookings.reduce((sum, b) => sum + b.total_price, 0);
                      
                      return (
                        <div key={service.id} className="flex justify-between items-center p-2 bg-muted rounded">
                          <span className="font-medium">{service.name}</span>
                          <div className="text-right">
                            <div className="font-medium">{bookingCount} bookings</div>
                            <div className="text-sm text-muted-foreground">${totalRevenue}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Time-based Analytics */}
            <div className="rounded-2xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Time-based Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Monthly Revenue</h4>
                  <div className="space-y-2">
                    {Array.from({ length: 6 }, (_, i) => {
                      const month = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
                      const monthName = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                      const monthRevenue = bookings
                        .filter(b => {
                          const bookingMonth = new Date(b.booking_date);
                          return bookingMonth.getMonth() === month.getMonth() && 
                                 bookingMonth.getFullYear() === month.getFullYear();
                        })
                        .reduce((sum, b) => sum + b.total_price, 0);
                      
                      return (
                        <div key={monthName} className="flex justify-between">
                          <span className="text-muted-foreground">{monthName}</span>
                          <span className="font-medium">${monthRevenue}</span>
                        </div>
                      );
                    }).reverse()}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Day of Week Performance</h4>
                  <div className="space-y-2">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => {
                      const dayBookings = bookings.filter(b => {
                        const bookingDate = new Date(b.booking_date);
                        return bookingDate.getDay() === index;
                      });
                      const dayRevenue = dayBookings.reduce((sum, b) => sum + b.total_price, 0);
                      
                      return (
                        <div key={day} className="flex justify-between">
                          <span className="text-muted-foreground">{day}</span>
                          <span className="font-medium">${dayRevenue}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Hourly Distribution</h4>
                  <div className="space-y-2">
                    {Array.from({ length: 8 }, (_, i) => {
                      const hour = 8 + i; // 8 AM to 4 PM
                      const hourBookings = bookings.filter(b => {
                        const bookingHour = parseInt(b.start_time.split(':')[0]);
                        return bookingHour === hour;
                      });
                      const hourRevenue = hourBookings.reduce((sum, b) => sum + b.total_price, 0);
                      
                      return (
                        <div key={hour} className="flex justify-between">
                          <span className="text-muted-foreground">{hour}:00</span>
                          <span className="font-medium">${hourRevenue}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Business Settings</h2>
            
            {/* Business Information */}
            <div className="rounded-2xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Business Name</label>
                  <input
                    type="text"
                    defaultValue="ServiceHomie"
                    className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-whop-blue focus:border-transparent"
                    placeholder="Your Business Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Business Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-whop-blue focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Business Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-whop-blue focus:border-transparent"
                    placeholder="business@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Business Address</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-whop-blue focus:border-transparent"
                    placeholder="123 Business St, City, State"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="rounded-2xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email notifications for new bookings</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whop-blue/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-whop-blue"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive SMS notifications for urgent updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whop-blue/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-whop-blue"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-confirm Bookings</p>
                    <p className="text-sm text-muted-foreground">Automatically confirm bookings within availability</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whop-blue/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-whop-blue"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Payment Settings */}
            <div className="rounded-2xl p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Payment & Billing</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Whop Checkout</p>
                    <p className="text-sm text-muted-foreground">Integrated with Whop for seamless payments</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Auto-invoicing</p>
                    <p className="text-sm text-muted-foreground">Automatically generate invoices for completed services</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-whop-blue/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-whop-blue"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="rounded-2xl p-6 border shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>Connected to Whop account: {user?.email}</p>
                    <p>Company: {user?.company_id || 'Personal Account'}</p>
                    <p>Plan: {user?.plan_id || 'Standard Plan'}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Disconnect Whop Account
                  </button>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={editingService?.category || 'General'}
                    onChange={(e) => setEditingService((prev: any) => prev ? { ...prev, category: e.target.value } : null)}
                    className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-whop-blue focus:border-transparent"
                  >
                    <option value="General">General</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Landscaping">Landscaping</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Repair">Repair</option>
                    <option value="Installation">Installation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Service Area
                  </label>
                  <select
                    value={editingService?.service_area || 'Local'}
                    onChange={(e) => setEditingService((prev: any) => prev ? { ...prev, service_area: e.target.value } : null)}
                    className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-whop-blue focus:border-transparent"
                  >
                    <option value="Local">Local (Same City)</option>
                    <option value="Regional">Regional (Same State)</option>
                    <option value="National">National</option>
                    <option value="Remote">Remote/Online</option>
                  </select>
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
