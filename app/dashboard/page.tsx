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
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">Dashboard Overview</h2>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-b border-[#E1E1E1] dark:border-[#2A2A2A] pb-4">
                <div className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">{activeServicesCount}</div>
                <div className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">Active Services</div>
              </div>
              <div className="border-b border-[#E1E1E1] dark:border-[#2A2A2A] pb-4">
                <div className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">{availableDaysCount}</div>
                <div className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">Available Days</div>
              </div>
              <div className="border-b border-[#E1E1E1] dark:border-[#2A2A2A] pb-4">
                <div className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">${upcoming.reduce((sum, booking) => sum + booking.price, 0)}</div>
                <div className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">Upcoming Revenue</div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="border-t border-[#E1E1E1] dark:border-[#2A2A2A] pt-6">
              <h3 className="text-lg font-semibold text-[#626262] dark:text-[#B5B5B5] mb-4 font-inter">Recent Bookings</h3>
              {upcoming.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-[#626262] dark:text-[#B5B5B5] font-inter">No upcoming bookings</p>
                  <p className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">Bookings will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcoming.slice(0, 5).map((booking, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-[#E1E1E1] dark:border-[#2A2A2A] last:border-b-0">
                      <div>
                        <div className="font-medium text-[#626262] dark:text-[#B5B5B5] font-inter">{booking.customer}</div>
                        <div className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">{booking.service} - {booking.date} at {booking.time}</div>
                      </div>
                      <div className="text-lg font-semibold text-[#1754d8] font-inter">${booking.price}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">Manage Services</h2>
              <button
                onClick={() => {
                  setEditingService(null);
                  setShowAddService(true);
                }}
                className="px-4 py-2 bg-[#1754d8] text-white rounded-lg hover:bg-[#1754d8]/90 transition-colors font-inter"
              >
                Add Service
              </button>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-[#626262] dark:text-[#B5B5B5] font-inter">No services yet</p>
                <p className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">Add your first service to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between py-4 border-b border-[#E1E1E1] dark:border-[#2A2A2A] last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-[#626262] dark:text-[#B5B5B5] font-inter">{service.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full font-inter ${
                          service.isActive
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
                        }`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-[#626262] dark:text-[#B5B5B5] mt-1 font-inter">{service.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">
                        <span>${service.price}</span>
                        <span>{service.duration} min</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setShowAddService(true);
                        }}
                        className="p-2 text-[#626262] dark:text-[#B5B5B5] hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => toggleServiceActive(service.id)}
                        className={`p-2 rounded-lg transition-colors font-inter ${
                          service.isActive
                            ? 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20'
                            : 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900/20'
                        }`}
                      >
                        {service.isActive ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
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
              <h2 className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">Set Your Monthly Schedule</h2>
              <div className="text-sm text-[#626262] dark:text-[#B5B5B5] bg-gray-50 dark:bg-[#2A2A2A] px-3 py-2 rounded-lg font-inter">
                Availability is automatically saved
              </div>
            </div>

            {/* Monthly Calendar */}
            <div className="border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-2xl p-6">
              {/* Quick Day Selection */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-3 font-inter">Select Weekdays for Entire Month</h4>
                <div className="grid grid-cols-7 gap-1">
                  {weekLabels.map((day, dayIndex) => {
                    const isEnabled = hasWeekdayAvailabilityForMonth(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleWeekdayAvailability(day)}
                        className={`h-12 rounded-lg text-sm font-medium transition-all font-inter ${
                          isEnabled
                            ? 'bg-[#1754d8] text-white hover:bg-[#1754d8]/90'
                            : 'bg-gray-100 dark:bg-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5] hover:bg-gray-200 dark:hover:bg-[#111111]'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentMonth(newDate);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-[#111111] rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-[#626262] dark:text-[#B5B5B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <h3 className="text-xl font-semibold text-[#626262] dark:text-[#B5B5B5] font-inter">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                
                <button
                  onClick={() => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentMonth(newDate);
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-[#111111] rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-[#626262] dark:text-[#B5B5B5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center py-2 text-sm font-medium text-[#626262] dark:text-[#B5B5B5] font-inter">
                    {day}
                  </div>
                ))}
                
                {getCalendarDays().map((day, index) => {
                  if (!day) {
                    return <div key={index} className="h-12" />;
                  }
                  
                  const isAvailable = availability[day.toDateString()]?.length > 0;
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isPast = day.getTime() < new Date().setHours(0, 0, 0, 0);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => !isPast && toggleDayAvailability(day)}
                      disabled={isPast}
                      className={`h-12 rounded-lg transition-all font-inter ${
                        isPast
                          ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                          : isAvailable
                            ? 'bg-[#1754d8] text-white hover:bg-[#1754d8]/90'
                            : 'border border-[#E1E1E1] dark:border-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5] hover:bg-gray-50 dark:hover:bg-[#111111]'
                      } ${isToday ? 'ring-2 ring-[#1754d8] ring-offset-2' : ''}`}
                    >
                      {day.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots Management */}
            <div className="border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#626262] dark:text-[#B5B5B5] font-inter">Business Hours</h3>
                <div className="text-sm text-[#626262] dark:text-[#B5B5B5] bg-gray-50 dark:bg-[#2A2A2A] px-3 py-2 rounded-lg font-inter">
                  Set once, applies to all available days
                </div>
              </div>
              
              {Object.keys(availability).length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-[#626262] dark:text-[#B5B5B5] font-inter">No availability set yet</p>
                  <p className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">Select weekdays above to get started</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Global Business Hours */}
                  <div className="bg-gray-50 dark:bg-[#111111] rounded-lg p-4">
                    <h4 className="text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-3 font-inter">Default Business Hours</h4>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="block text-xs text-[#626262] dark:text-[#B5B5B5] mb-1 font-inter">Start Time</label>
                        <input
                          type="time"
                          value={getDefaultStartTime()}
                          onChange={(e) => updateAllTimeSlots('start', e.target.value)}
                          className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#111111] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter"
                        />
                      </div>
                      <div className="text-[#626262] dark:text-[#B5B5B5] self-end pb-2 font-inter">to</div>
                      <div className="flex-1">
                        <label className="block text-xs text-[#626262] dark:text-[#B5B5B5] mb-1 font-inter">End Time</label>
                        <input
                          type="time"
                          value={getDefaultEndTime()}
                          onChange={(e) => updateAllTimeSlots('end', e.target.value)}
                          className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#111111] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-[#626262] dark:text-[#B5B5B5] mt-2 font-inter">Changing these times will update all available days</p>
                  </div>

                  {/* Available Days Summary */}
                  <div>
                    <h4 className="text-sm font-medium text-[#626262] dark:text-[#B5B5B5] mb-3 font-inter">Available Days This Month</h4>
                    <div className="grid grid-cols-7 gap-1">
                      {weekLabels.map((day, dayIndex) => {
                        const isEnabled = hasWeekdayAvailabilityForMonth(day);
                        const dayCount = getWeekdayCountInMonth(day);
                        return (
                          <div key={day} className={`text-center p-2 rounded-lg font-inter ${
                            isEnabled
                              ? 'bg-[#1754d8] text-white'
                              : 'bg-gray-100 dark:bg-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5]'
                          }`}>
                            <div className="text-xs font-medium">{day}</div>
                            <div className="text-xs opacity-75">{dayCount} days</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex space-x-3">
                    <button
                      onClick={setStandardBusinessHours}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5] rounded-lg hover:bg-gray-200 dark:hover:bg-[#111111] transition-colors font-inter"
                    >
                      Set 9 AM - 5 PM
                    </button>
                    <button
                      onClick={setExtendedHours}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-[#2A2A2A] text-[#626262] dark:text-[#B5B5B5] rounded-lg hover:bg-gray-200 dark:hover:bg-[#111111] transition-colors font-inter"
                    >
                      Set 8 AM - 8 PM
                    </button>
                    <button
                      onClick={clearAllAvailability}
                      className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors font-inter"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#626262] dark:text-[#B5B5B5] font-inter">Manage Bookings</h2>
            </div>

            {upcoming.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[#626262] dark:text-[#B5B5B5] font-inter">No upcoming bookings</p>
                <p className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">Bookings will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((booking, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b border-[#E1E1E1] dark:border-[#2A2A2A] last:border-b-0">
                    <div>
                      <div className="font-medium text-[#626262] dark:text-[#B5B5B5] font-inter">{booking.customer}</div>
                      <div className="text-sm text-[#626262] dark:text-[#B5B5B5] font-inter">{booking.service} - {booking.date} at {booking.time}</div>
                    </div>
                    <div className="text-lg font-semibold text-[#1754d8] font-inter">${booking.price}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Add/Edit Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 w-full max-w-md border border-[#E1E1E1] dark:border-[#2A2A2A] shadow-2xl">
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
                  className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#111111] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter"
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
                  className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#111111] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter"
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
                    className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#111111] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter"
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
                    className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#111111] text-[#626262] dark:text-[#B5B5B5] focus:ring-2 focus:ring-[#1754d8] focus:border-transparent font-inter"
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
                className="flex-1 px-4 py-2 border border-[#E1E1E1] dark:border-[#2A2A2A] rounded-lg text-[#626262] dark:text-[#B5B5B5] hover:bg-gray-50 dark:hover:bg-[#111111] transition-colors font-inter"
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
