"use client";

import { useState } from "react";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

interface TimeSlot {
  start: string;
  end: string;
}

const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'availability' | 'bookings'>('overview');
  const [services, setServices] = useState<Service[]>([]);
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [availability, setAvailability] = useState<Record<string, TimeSlot[]>>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [upcoming, setUpcoming] = useState<{ date: string; time: string; customer: string; service: string; price: number }[]>([]);

  // Calendar helper functions
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const toggleDayAvailability = (date: Date) => {
    const dateString = date.toDateString();
    const currentSlots = availability[dateString] || [];
    
    if (currentSlots.length > 0) {
      // Remove availability for this day
      const newAvailability = { ...availability };
      delete newAvailability[dateString];
      setAvailability(newAvailability);
    } else {
      // Add default availability for this day
      setAvailability({
        ...availability,
        [dateString]: [{ start: '09:00', end: '17:00' }]
      });
    }
  };

  const toggleWeekdayAvailability = (weekday: string) => {
    const targetDay = weekLabels.indexOf(weekday as any);
    
    // Check if this weekday is already enabled for the current month
    const isCurrentlyEnabled = hasWeekdayAvailabilityForMonth(weekday);
    
    if (isCurrentlyEnabled) {
      // Remove availability for all dates of this weekday in the current month
      const newAvailability = { ...availability };
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
        if (date.getDay() === targetDay) {
          delete newAvailability[date.toDateString()];
        }
      }
      setAvailability(newAvailability);
    } else {
      // Add availability for all dates of this weekday in the current month
      const newAvailability = { ...availability };
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
        if (date.getDay() === targetDay) {
          newAvailability[date.toDateString()] = [{ start: '09:00', end: '17:00' }];
        }
      }
      setAvailability(newAvailability);
    }
  };

  const hasWeekdayAvailabilityForMonth = (weekday: string) => {
    const targetDay = weekLabels.indexOf(weekday as any);
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Check if any date of this weekday in the current month has availability
    for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
      if (date.getDay() === targetDay && availability[date.toDateString()]?.length > 0) {
        return true;
      }
    }
    return false;
  };

  const addTimeSlot = (date: string) => {
    const currentSlots = availability[date] || [];
    setAvailability({
      ...availability,
      [date]: [...currentSlots, { start: '09:00', end: '17:00' }]
    });
  };

  const removeTimeSlot = (date: string, slotIndex: number) => {
    const currentSlots = availability[date] || [];
    const newSlots = currentSlots.filter((_, index) => index !== slotIndex);
    
    if (newSlots.length === 0) {
      // Remove the entire date if no slots remain
      const newAvailability = { ...availability };
      delete newAvailability[date];
      setAvailability(newAvailability);
    } else {
      setAvailability({
        ...availability,
        [date]: newSlots
      });
    }
  };

  const updateTimeSlot = (date: string, slotIndex: number, field: 'start' | 'end', value: string) => {
    const currentSlots = availability[date] || [];
    const newSlots = [...currentSlots];
    newSlots[slotIndex] = { ...newSlots[slotIndex], [field]: value };
    
    setAvailability({
      ...availability,
      [date]: newSlots
    });
  };

  const removeDateAvailability = (date: string) => {
    const newAvailability = { ...availability };
    delete newAvailability[date];
    setAvailability(newAvailability);
  };

  function persistAvailability(next: Record<string, TimeSlot[]>) {
    setAvailability(next);
    // TODO: Save to Supabase instead of localStorage
    console.log('Saving availability to Supabase:', next);
  }

  function persistServices(next: Service[]) {
    setServices(next);
    // TODO: Save to Supabase instead of localStorage
    console.log('Saving services to Supabase:', next);
  }

  function toggleDayEnabled(dayIndex: number) {
    const windows = availability[dayIndex];
    const next = { ...availability, [dayIndex]: windows.length ? [] : [{ start: "09:00", end: "17:00" }] } as Record<string, TimeSlot[]>;
    persistAvailability(next);
  }

  function updateWindow(dayIndex: number, windowIndex: number, field: 'start' | 'end', value: string) {
    const next = structuredClone(availability);
    next[dayIndex][windowIndex][field] = value;
    persistAvailability(next);
  }

  function addWindow(dayIndex: number) {
    const next = structuredClone(availability);
    next[dayIndex].push({ start: "09:00", end: "17:00" });
    persistAvailability(next);
  }

  function removeWindow(dayIndex: number, windowIndex: number) {
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

  function getDefaultStartTime() {
    const defaultStart = '09:00';
    const defaultEnd = '17:00';
    const defaultSlots = availability[new Date().toDateString()] || [];
    if (defaultSlots.length > 0) {
      return defaultSlots[0].start;
    }
    return defaultStart;
  }

  function getDefaultEndTime() {
    const defaultStart = '09:00';
    const defaultEnd = '17:00';
    const defaultSlots = availability[new Date().toDateString()] || [];
    if (defaultSlots.length > 0) {
      return defaultSlots[0].end;
    }
    return defaultEnd;
  }

  function updateAllTimeSlots(field: 'start' | 'end', value: string) {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
      const dateString = date.toDateString();
      const currentSlots = availability[dateString] || [];
      const newSlots = currentSlots.map(slot => ({ ...slot, [field]: value }));
      setAvailability(prev => ({ ...prev, [dateString]: newSlots }));
    }
  }

  function setStandardBusinessHours() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
      const dateString = date.toDateString();
      setAvailability(prev => ({
        ...prev,
        [dateString]: [{ start: '09:00', end: '17:00' }]
      }));
    }
  }

  function setExtendedHours() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
      const dateString = date.toDateString();
      setAvailability(prev => ({
        ...prev,
        [dateString]: [{ start: '08:00', end: '20:00' }]
      }));
    }
  }

  function clearAllAvailability() {
    setAvailability({});
  }

  function getWeekdayCountInMonth(weekday: string) {
    const targetDay = weekLabels.indexOf(weekday as any);
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let count = 0;
    for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
      if (date.getDay() === targetDay) {
        count++;
      }
    }
    return count;
  }

  return (
    <div className="min-h-screen">
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
            {/* Welcome Header */}
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1754d8] to-[#1754d8]/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-[#626262] dark:text-[#B5B5B5] mb-2 font-inter">Welcome back!</h1>
              <p className="text-[#626262] dark:text-[#B5B5B5] font-inter">Here's what's happening with your booking business today</p>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative p-6 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-xl hover:border-[#1754d8]/30 transition-all duration-200 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-[#1754d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">{activeServicesCount}</div>
                    <div className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">Active Services</div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-[#1754d8] to-[#1754d8]/50 rounded-full"></div>
              </div>

              <div className="relative p-6 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-xl hover:border-[#1754d8]/30 transition-all duration-200 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">{availableDaysCount}</div>
                    <div className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">Available Days</div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
              </div>

              <div className="relative p-6 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-xl hover:border-[#1754d8]/30 transition-all duration-200 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">${upcoming.reduce((sum, booking) => sum + booking.price, 0)}</div>
                    <div className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">Upcoming Revenue</div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"></div>
              </div>
            </div>

            {/* Recent Bookings with Enhanced Design */}
            <div className="border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-[#1754d8]/5 to-[#1754d8]/10 border-b border-[#E1E1E1] dark:border-[#2A2A2A]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#1754d8] rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#626262] dark:text-[#B5B5B5] font-inter">Recent Bookings</h3>
                </div>
              </div>
              
              {upcoming.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-[#626262] dark:text-[#B5B5B5] font-inter mb-2">No upcoming bookings</p>
                  <p className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">Bookings will appear here once customers start scheduling</p>
                </div>
              ) : (
                <div className="divide-y divide-[#E1E1E1] dark:divide-[#2A2A2A]">
                  {upcoming.slice(0, 5).map((booking, index) => (
                    <div key={index} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#2A2A2A]/50 transition-colors duration-150">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-[#1754d8]/10 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#1754d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold text-[#626262] dark:text-[#B5B5B5] font-inter">{booking.customer}</div>
                            <div className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">{booking.service} • {booking.date} at {booking.time}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-[#1754d8] font-inter">${booking.price}</div>
                          <div className="text-xs text-[#626262] dark:text-[#B5B5B5] font-inter">Confirmed</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter mb-2">Manage Services</h2>
                <p className="text-[#626262] dark:text-[#B5B5B5] font-inter">Create and manage your service offerings</p>
              </div>
              <button
                onClick={() => {
                  setEditingService(null);
                  setShowAddService(true);
                }}
                className="px-6 py-3 bg-[#1754d8] text-white rounded-xl hover:bg-[#1754d8]/90 transition-all duration-200 font-inter flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Service</span>
              </button>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-16 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-2xl">
                <div className="w-24 h-24 bg-gray-100 dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#626262] dark:text-[#B5B5B5] mb-3 font-inter">No services yet</h3>
                <p className="text-[#626262] dark:text-[#B5B5B5] mb-6 font-inter">Create your first service to start accepting bookings</p>
                <button
                  onClick={() => {
                    setEditingService(null);
                    setShowAddService(true);
                  }}
                  className="px-6 py-3 bg-[#1754d8] text-white rounded-xl hover:bg-[#1754d8]/90 transition-all duration-200 font-inter"
                >
                  Create Your First Service
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-xl p-6 hover:border-[#1754d8]/30 transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-[#1754d8]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <svg className="w-6 h-6 text-[#1754d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-[#626262] dark:text-[#B5B5B5] font-inter">{service.name}</h3>
                            <span className={`px-3 py-1 text-xs rounded-full font-medium font-inter ${
                              service.isActive
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
                            }`}>
                              {service.isActive ? '✓ Active' : '○ Inactive'}
                            </span>
                          </div>
                          <p className="text-[#626262] dark:text-[#B5B5B5] mb-3 font-inter">{service.description}</p>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-[#1754d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              <span className="text-[#626262] dark:text-[#B5B5B5] font-inter">${service.price}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-[#1754d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-[#626262] dark:text-[#B5B5B5] font-inter">{service.duration} min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setShowAddService(true);
                          }}
                          className="p-3 text-[#626262] dark:text-[#B5B5B5] hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors duration-150"
                          title="Edit Service"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleServiceActive(service.id)}
                          className={`p-3 rounded-lg transition-colors duration-150 font-inter ${
                            service.isActive
                              ? 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20'
                              : 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900/20'
                          }`}
                          title={service.isActive ? 'Deactivate Service' : 'Activate Service'}
                        >
                          {service.isActive ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
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
          <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[#626262] dark:text-[#B5B5B5] mb-2 font-inter">Set Your Monthly Schedule</h2>
              <p className="text-[#626262] dark:text-[#B5B5B5] font-inter">Manage your availability and business hours</p>
            </div>

            {/* Monthly Calendar */}
            <div className="border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-2xl p-8 shadow-sm">
              {/* Quick Day Selection */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-[#626262] dark:text-[#B5B5B5] mb-4 font-inter">Select Weekdays for Entire Month</h4>
                <div className="grid grid-cols-7 gap-2">
                  {weekLabels.map((day, dayIndex) => {
                    const isEnabled = hasWeekdayAvailabilityForMonth(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleWeekdayAvailability(day)}
                        className={`h-14 rounded-xl text-sm font-medium transition-all duration-200 font-inter ${
                          isEnabled
                            ? 'bg-[#1754d8] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                            : 'bg-gray-100 dark:bg-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5] hover:bg-gray-200 dark:hover:bg-[#111111] hover:border-[#1754d8]/30 border border-transparent'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentMonth(newDate);
                  }}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-[#111111] rounded-xl transition-colors duration-150"
                >
                  <svg className="w-6 h-6 text-[#626262] dark:text-[#B5B5B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <h3 className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                
                <button
                  onClick={() => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentMonth(newDate);
                  }}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-[#111111] rounded-xl transition-colors duration-150"
                >
                  <svg className="w-6 h-6 text-[#626262] dark:text-[#B5B5B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center py-3 text-sm font-semibold text-[#626262] dark:text-[#B5B5B5] font-inter">
                    {day}
                  </div>
                ))}
                
                {getCalendarDays().map((day, index) => {
                  if (!day) {
                    return <div key={index} className="h-14" />;
                  }
                  
                  const isAvailable = availability[day.toDateString()]?.length > 0;
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isPast = day.getTime() < new Date().setHours(0, 0, 0, 0);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => !isPast && toggleDayAvailability(day)}
                      disabled={isPast}
                      className={`h-14 rounded-xl transition-all duration-200 font-inter ${
                        isPast
                          ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-100 dark:bg-[#2A2A2A]'
                          : isAvailable
                            ? 'bg-[#1754d8] text-white hover:bg-[#1754d8]/90 shadow-lg hover:shadow-xl transform hover:scale-105'
                            : 'border border-[#E1E1E1] dark:border-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5] hover:bg-gray-50 dark:hover:bg-[#111111] hover:border-[#1754d8]/50'
                      } ${isToday ? 'ring-2 ring-[#1754d8] ring-offset-2' : ''}`}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots Management */}
            <div className="border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter mb-2">Business Hours</h3>
                  <p className="text-[#626262] dark:text-[#B5B5B5] font-inter">Set once, applies to all available days</p>
                </div>
                <div className="text-sm text-[#626262] dark:text-[#B5B5B5] bg-gray-50 dark:bg-[#2A2A2A] px-4 py-2 rounded-xl font-inter">
                  Auto-save enabled
                </div>
              </div>
              
              {Object.keys(availability).length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-[#E1E1E1] dark:border-[#2A2A2A] rounded-2xl">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#626262] dark:text-[#B5B5B5] mb-3 font-inter">No availability set yet</h3>
                  <p className="text-[#626262] dark:text-[#B5B5B5] mb-6 font-inter">Select weekdays above and set your business hours</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Global Business Hours */}
                  <div className="bg-gradient-to-r from-[#1754d8]/5 to-[#1754d8]/10 rounded-2xl p-6 border border-[#1754d8]/20">
                    <h4 className="text-lg font-semibold text-[#626262] dark:text-[#B5B5B5] mb-4 font-inter flex items-center space-x-2">
                      <svg className="w-5 h-5 text-[#1754d8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Default Business Hours</span>
                    </h4>
                    <div className="flex items-center space-x-6">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-2 font-inter">Start Time</label>
                        <input
                          type="time"
                          value={getDefaultStartTime()}
                          onChange={(e) => updateAllTimeSlots('start', e.target.value)}
                          className="w-full px-4 py-3 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#111111] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter text-lg"
                        />
                      </div>
                      <div className="text-[#626262] dark:text-[#B5B5B5] self-end pb-3 font-inter text-lg">to</div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-2 font-inter">End Time</label>
                        <input
                          type="time"
                          value={getDefaultEndTime()}
                          onChange={(e) => updateAllTimeSlots('end', e.target.value)}
                          className="w-full px-4 py-3 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#111111] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter text-lg"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-[#626262] dark:text-[#B5B5B5] mt-4 font-inter">Changing these times will update all available days automatically</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex space-x-4">
                    <button
                      onClick={setStandardBusinessHours}
                      className="flex-1 px-6 py-3 bg-gray-100 dark:bg-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5] rounded-xl hover:bg-gray-200 dark:hover:bg-[#111111] transition-all duration-200 font-inter flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Set 9 AM - 5 PM</span>
                    </button>
                    <button
                      onClick={setExtendedHours}
                      className="flex-1 px-6 py-3 bg-gray-100 dark:bg-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5] rounded-xl hover:bg-gray-200 dark:hover:bg-[#111111] transition-all duration-200 font-inter flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Set 8 AM - 8 PM</span>
                    </button>
                    <button
                      onClick={clearAllAvailability}
                      className="px-6 py-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-all duration-200 font-inter flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Clear All</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[#626262] dark:text-[#B5B5B5] mb-2 font-inter">Manage Bookings</h2>
              <p className="text-[#626262] dark:text-[#B5B5B5] font-inter">View and manage your upcoming appointments</p>
            </div>

            {upcoming.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-[#E1E1E1] dark:border-[#2A2A2A] rounded-2xl">
                <div className="w-24 h-24 bg-gray-100 dark:bg-[#2A2A2A] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#626262] dark:text-[#B5B5B5] mb-3 font-inter">No upcoming bookings</h3>
                <p className="text-[#626262] dark:text-[#B5B5B5] font-inter">Bookings will appear here once customers start scheduling</p>
              </div>
            ) : (
              <div className="border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-gradient-to-r from-purple-500/5 to-purple-500/10 border-b border-[#E1E1E1] dark:border-[#2A2A2A]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-[#626262] dark:text-[#B5B5B5] font-inter">Upcoming Bookings</h3>
                    </div>
                    <div className="text-sm text-[#626262] dark:text-[#B5B5B5] bg-white dark:bg-[#2A2A2A] px-3 py-1 rounded-lg font-inter">
                      {upcoming.length} total
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-[#E1E1E1] dark:divide-[#2A2A2A]">
                  {upcoming.map((booking, index) => (
                    <div key={index} className="px-6 py-5 hover:bg-gray-50 dark:hover:bg-[#2A2A2A]/50 transition-colors duration-150">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold text-lg text-[#626262] dark:text-[#B5B5B5] font-inter mb-1">{booking.customer}</div>
                            <div className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">{booking.service} • {booking.date} at {booking.time}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-inter">${booking.price}</div>
                          <div className="text-xs text-[#626262] dark:text-[#B5B5B5] font-inter bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">Confirmed</div>
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
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#111111] rounded-2xl p-8 w-full max-w-lg border border-[#E1E1E1] dark:border-[#2A2A2A] shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#626262] dark:text-[#B5B5B5] font-inter">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => {
                  setEditingService(null);
                  setShowAddService(false);
                }}
                className="p-2 text-[#626262] dark:text-[#B5B5B5] hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-2 font-inter">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={editingService?.name || ''}
                  onChange={(e) => {
                    if (editingService) {
                      setEditingService({ ...editingService, name: e.target.value });
                    } else {
                      setEditingService({ id: '', name: e.target.value, description: '', price: 0, duration: 30, isActive: true });
                    }
                  }}
                  className="w-full px-4 py-3 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#111111] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter"
                  placeholder="e.g., Consultation, Coaching, Design"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-2 font-inter">
                  Description
                </label>
                <textarea
                  value={editingService?.description || ''}
                  onChange={(e) => {
                    if (editingService) {
                      setEditingService({ ...editingService, description: e.target.value });
                    } else {
                      setEditingService({ id: '', name: '', description: e.target.value, price: 0, duration: 30, isActive: true });
                    }
                  }}
                  className="w-full px-4 py-3 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#111111] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter"
                  rows={3}
                  placeholder="Describe what this service includes..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-2 font-inter">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    value={editingService?.price || ''}
                    onChange={(e) => {
                      if (editingService) {
                        setEditingService({ ...editingService, price: Number(e.target.value) });
                      } else {
                        setEditingService({ id: '', name: '', description: '', price: Number(e.target.value), duration: 30, isActive: true });
                      }
                    }}
                    className="w-full px-4 py-3 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#111111] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-2 font-inter">
                    Duration (min) *
                  </label>
                  <input
                    type="number"
                    value={editingService?.duration || ''}
                    onChange={(e) => {
                      if (editingService) {
                        setEditingService({ ...editingService, duration: Number(e.target.value) });
                      } else {
                        setEditingService({ id: '', name: '', description: '', price: 0, duration: Number(e.target.value), isActive: true });
                      }
                    }}
                    className="w-full px-4 py-3 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-xl bg-white dark:bg-[#111111] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter"
                    min="15"
                    step="15"
                    placeholder="30"
                  />
                </div>
              </div>

              {editingService && (
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingService.isActive}
                    onChange={(e) => setEditingService({ ...editingService, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#1754d8] border-[#E1E1E1] dark:border-[#2A2A2A] rounded focus:ring-[#1754d8] focus:ring-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-[#626262] dark:text-[#B5B5B5] font-inter">
                    Service is active and available for booking
                  </label>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setEditingService(null);
                  setShowAddService(false);
                }}
                className="px-6 py-3 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-xl text-[#626262] dark:text-[#B5B5B5] hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors font-inter"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingService && editingService.name && editingService.price > 0) {
                    saveService(editingService);
                  }
                }}
                disabled={!editingService?.name || !editingService?.price || editingService.price === 0}
                className="px-6 py-3 bg-[#1754d8] text-white rounded-xl hover:bg-[#1754d8]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-inter"
              >
                {editingService ? 'Update Service' : 'Create Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
