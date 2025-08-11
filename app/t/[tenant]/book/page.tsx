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

type BookingStep = 'services' | 'schedule' | 'confirmation';

export default function CustomerBookingPage() {
  const [availability, setAvailability] = useState<WeeklyAvailability>(getDefaultWeeklyAvailability());
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<BookingStep>('services');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);
    
    // TODO: Load data from Supabase instead of localStorage
    // For now, we'll start with empty data
  }, []);

  // Generate next 14 days
  const nextDays = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: date,
      label: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    };
  });

  // Get available times for selected day
  const getAvailableTimes = (dayName: string) => {
    const dayIndex = weekLabels.findIndex(label => 
      label.toLowerCase() === dayName.slice(0, 3).toLowerCase()
    );
    if (dayIndex === -1) return [];
    
    const dayAvailability = availability[dayIndex as Weekday];
    if (dayAvailability.length === 0) return [];
    
    // Generate time slots based on availability and service duration
    const times = [];
    for (const window of dayAvailability) {
      const start = new Date(`2000-01-01 ${window.start}`);
      const end = new Date(`2000-01-01 ${window.end}`);
      
      // Only show times that allow for the full service duration
      const serviceDuration = selectedService?.duration || 60;
      const maxStartTime = new Date(end.getTime() - (serviceDuration * 60 * 1000));
      
      for (let time = new Date(start); time <= maxStartTime; time.setMinutes(time.getMinutes() + 30)) {
        times.push(time.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }));
      }
    }
    return times;
  };

  const availableTimes = getAvailableTimes(selectedDay);

  function handleServiceSelection(service: Service) {
    setSelectedService(service);
    setCurrentStep('schedule');
  }

  function handleDateSelection(day: string) {
    setSelectedDay(day);
    setSelectedTime('');
  }

  function handleTimeSelection(time: string) {
    setSelectedTime(time);
  }

  function handleScheduleConfirmation() {
    if (!selectedService || !selectedDay || !selectedTime) return;
    setCurrentStep('confirmation');
  }

  function handleWhopCheckout() {
    if (!selectedService || !selectedDay || !selectedTime) return;
    
    // TODO: Save booking to Supabase instead of localStorage
    const demoBooking = {
      date: selectedDay,
      time: selectedTime,
      customer: customerInfo.name || 'Demo Customer',
      service: selectedService.name,
      price: selectedService.price
    };
    
    console.log('Saving booking to Supabase:', demoBooking);
    
    // In production, this would redirect to Whop's checkout
    // For demo purposes, we'll show an alert
    alert(`Redirecting to Whop checkout for ${selectedService.name} on ${selectedDay} at ${selectedTime} for $${selectedService.price}`);
    
    // Simulate redirect to Whop
    // window.location.href = `https://whop.com/checkout?service=${selectedService.id}&date=${selectedDay}&time=${selectedTime}&price=${selectedService.price}`;
  }

  function goBack() {
    if (currentStep === 'schedule') {
      setCurrentStep('services');
      setSelectedService(null);
      setSelectedDay('');
      setSelectedTime('');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('schedule');
    }
  }

  if (currentStep === 'services') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        {/* Header - Clean, professional design */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Book Your Session</h1>
            <p className="text-slate-600 dark:text-slate-400">Choose a service that fits your needs</p>
          </div>
        </header>

        {/* Services Selection */}
        <div className="max-w-4xl mx-auto px-6 py-8">
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
                Initializing your booking experience
              </p>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whop-pomegranate mx-auto"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-whop-pomegranate rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Select Your Service
                </h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Choose from our available services below
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {services.filter(s => s.isActive).map((service) => (
                  <div 
                    key={service.id} 
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:border-whop-pomegranate hover:shadow-lg transition-all cursor-pointer group shadow-sm"
                    onClick={() => handleServiceSelection(service)}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-whop-pomegranate/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                        <svg className="w-8 h-8 text-whop-pomegranate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                        {service.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <span className="text-2xl font-bold text-whop-pomegranate">${service.price}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 dark:text-slate-400 font-medium">{service.duration} min</span>
                      </div>
                      <button className="w-full bg-whop-pomegranate text-white py-3 rounded-xl font-semibold hover:bg-whop-pomegranate/90 transition-colors shadow-sm">
                        Select This Service
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* How It Works - Clean, flat design */}
              <div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 text-center">
                  How It Works
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-whop-pomegranate/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl text-whop-pomegranate font-bold">1</span>
                    </div>
                    <p className="font-medium text-slate-800 dark:text-slate-200 mb-1">Choose Service</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Select from available options</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-whop-blue/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl text-whop-blue font-bold">2</span>
                    </div>
                    <p className="font-medium text-slate-800 dark:text-slate-200 mb-1">Pick Date & Time</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Choose your preferred slot</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-whop-pomegranate/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl text-whop-pomegranate font-bold">3</span>
                    </div>
                    <p className="font-medium text-slate-800 dark:text-slate-200 mb-1">Complete Payment</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Secure checkout via Whop</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (currentStep === 'schedule') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Schedule Your Session</h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {selectedService?.name} • ${selectedService?.price} • {selectedService?.duration} min
                </p>
              </div>
              <button
                onClick={goBack}
                className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm transition-colors"
              >
                ← Back to Services
              </button>
            </div>
          </div>
        </header>

        {/* Schedule Selection */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-whop-blue to-whop-pomegranate rounded-full mb-4">
              <span className="text-2xl text-white">📅</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Select Date & Time
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Choose when you'd like your session
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Date Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-whop-pomegranate">📅</span>
                Select a Date
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {nextDays.map((day, index) => {
                  const hasAvailability = getAvailableTimes(day.label).length > 0;
                  return (
                    <button
                      key={index}
                      onClick={() => handleDateSelection(day.label)}
                      disabled={!hasAvailability}
                      className={`p-3 rounded-xl text-sm font-medium transition-all ${
                        selectedDay === day.label
                          ? 'bg-whop-pomegranate text-white shadow-sm'
                          : hasAvailability
                          ? 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                          : 'border border-slate-200 text-slate-400 bg-slate-100 dark:border-slate-700 dark:text-slate-600 dark:bg-slate-800 cursor-not-allowed'
                      }`}
                    >
                      {day.label}
                      {!hasAvailability && <span className="block text-xs opacity-75 mt-1">Unavailable</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-whop-blue">⏰</span>
                Select a Time
              </h3>
              {selectedDay ? (
                <div>
                  {availableTimes.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-slate-400 text-lg">⏰</span>
                      </div>
                      <p className="text-slate-500 mb-2">No times available for {selectedDay}</p>
                      <p className="text-xs text-slate-400">Try selecting a different day</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {availableTimes.map((time, index) => (
                        <button
                          key={index}
                          onClick={() => handleTimeSelection(time)}
                          className={`p-3 rounded-xl text-sm font-medium transition-all ${
                            selectedTime === time
                              ? 'bg-whop-blue text-white shadow-sm'
                              : 'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-slate-400 text-lg">📅</span>
                  </div>
                  <p className="text-slate-500">Please select a date first</p>
                </div>
              )}
            </div>
          </div>

          {/* Continue Button */}
          {selectedDay && selectedTime && (
            <div className="mt-8 text-center">
              <button
                onClick={handleScheduleConfirmation}
                className="bg-whop-pomegranate text-white px-8 py-4 rounded-xl font-semibold hover:bg-whop-pomegranate/90 transition-colors text-lg shadow-sm"
              >
                Continue to Booking →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (currentStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Complete Your Booking</h1>
                <p className="text-slate-600 dark:text-slate-400">Almost done! Just confirm your details</p>
              </div>
              <button
                onClick={goBack}
                className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm transition-colors"
              >
                ← Back to Schedule
              </button>
            </div>
          </div>
        </header>

        {/* Booking Confirmation */}
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-whop-pomegranate to-whop-blue rounded-full mb-4">
              <span className="text-2xl text-white">📋</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Booking Summary
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Review your session details before payment
            </p>
          </div>

          {/* Service Details */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-whop-pomegranate">💰</span>
              Service Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Service:</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Date:</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedDay}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Time:</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedTime}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">Duration:</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedService?.duration} minutes</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-bold">
                <span className="text-slate-900 dark:text-white">Total:</span>
                <span className="text-whop-pomegranate">${selectedService?.price}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-whop-blue">👤</span>
              Your Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="text-center">
            <button
              onClick={handleWhopCheckout}
              disabled={!customerInfo.name || !customerInfo.email}
              className="w-full bg-whop-pomegranate text-white py-4 rounded-xl font-semibold hover:bg-whop-pomegranate/90 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-sm mb-4"
            >
              Continue to Whop Payment
            </button>
            <p className="text-xs text-slate-500">
              You'll be redirected to Whop's secure checkout to complete your payment
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-gradient-to-r from-whop-pomegranate/10 to-whop-blue/10 rounded-xl p-4 border border-whop-pomegranate/20">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="text-whop-pomegranate">🔒</span>
              <span>Your payment is processed securely through Whop's platform</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}


