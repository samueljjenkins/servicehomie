"use client";

import { useState, useEffect } from "react";
import { useWhopUser } from "@/lib/hooks/useWhopUser";
import { useWhopData } from "@/lib/hooks/useWhopData";
import type { WeeklyAvailability, Weekday, TimeWindow } from "@/lib/availability";

const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export default function CustomerBookingPage() {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [currentStep, setCurrentStep] = useState<'service' | 'date' | 'details' | 'payment'>('service');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);

  // Whop data hooks - no tenant needed!
  const { user, loading: userLoading } = useWhopUser();
  const { 
    services, 
    availability, 
    addBooking,
    loading: dataLoading
  } = useWhopData();

  const activeServices = services.filter(s => s.status === 'active');

  // Show loading state while data is being fetched
  if (userLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-whop-pomegranate rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Loading Services...
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Getting everything ready for you
          </p>
        </div>
      </div>
    );
  }

  // Get available dates (next 30 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay() as Weekday;
      
      if (availability[dayOfWeek] && availability[dayOfWeek].length > 0) {
        dates.push({
          date: date.toISOString().split('T')[0],
          day: weekLabels[dayOfWeek],
          dayOfWeek
        });
      }
    }
    
    return dates;
  };

  const availableDates = getAvailableDates();

  // Get available times for selected date
  const getAvailableTimes = (date: string) => {
    if (!date) return [];
    
    const selectedDateObj = new Date(date);
    const dayOfWeek = selectedDateObj.getDay() as Weekday;
    const dayAvailability = availability[dayOfWeek] || [];
    
    return dayAvailability.map(window => ({
      start: window.start,
      end: window.end
    }));
  };

  const availableTimes = getAvailableTimes(selectedDate);

  // Handle service selection
  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setCurrentStep('date');
  };

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    setCurrentStep('details');
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService || !selectedDate || !selectedTime || !customerName || !customerEmail) {
      alert('Please fill in all fields');
      return;
    }

    // Store booking details in sessionStorage for payment processing
    const bookingDetails = {
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      bookingDate: selectedDate,
      startTime: selectedTime,
      customerName,
      customerEmail,
      totalPrice: selectedService.price
    };

    sessionStorage.setItem('pendingBooking', JSON.stringify(bookingDetails));
    
    // Create booking in database
    try {
      await addBooking({
        service_id: selectedService.id,
        customer_name: customerName,
        customer_email: customerEmail,
        booking_date: selectedDate,
        start_time: selectedTime,
        total_price: selectedService.price,
        status: 'pending'
      });
      
      setCurrentStep('payment');
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  // Process payment with Whop Checkout Embed
  const processPayment = async () => {
    setIsProcessingPayment(true);
    
    try {
      // For now, just simulate payment processing
      // In production, this would integrate with Whop Checkout Embed
      setTimeout(() => {
        setIsProcessingPayment(false);
        // Redirect to success page or show success message
        alert('Payment processed successfully!');
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessingPayment(false);
      alert('Payment failed. Please try again.');
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime('');
    setCustomerName('');
    setCustomerEmail('');
    setCurrentStep('service');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Book Your Session
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
            Welcome, {user?.first_name || 'Customer'}!
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="px-6">
          <div className="flex items-center justify-center space-x-8 py-4">
            {[
              { step: 'service', label: 'Choose Service', active: currentStep === 'service' },
              { step: 'date', label: 'Select Date', active: currentStep === 'date' },
              { step: 'details', label: 'Your Details', active: currentStep === 'details' },
              { step: 'payment', label: 'Payment', active: currentStep === 'payment' }
            ].map((stepInfo, index) => (
              <div key={stepInfo.step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepInfo.active 
                    ? 'bg-whop-pomegranate text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  stepInfo.active 
                    ? 'text-whop-pomegranate' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {stepInfo.label}
                </span>
                {index < 3 && (
                  <div className={`ml-4 w-12 h-0.5 ${
                    stepInfo.active ? 'bg-whop-pomegranate' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {currentStep === 'service' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Service
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Select from our available services below
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeServices.map((service) => (
                <div 
                  key={service.id} 
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-whop-pomegranate transition-colors"
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-whop-pomegranate rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{service.duration_minutes} min</span>
                      <span className="text-2xl font-bold text-whop-pomegranate">${service.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'date' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Select Your Date
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Choose from available dates in the next 30 days
              </p>
            </div>

            <div className="grid grid-cols-7 gap-4">
              {weekLabels.map((day) => (
                <div key={day} className="text-center">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {day}
                  </div>
                </div>
              ))}
              
              {availableDates.map((dateInfo) => (
                <div key={dateInfo.date} className="text-center">
                  <button
                    onClick={() => handleDateSelect(dateInfo.date)}
                    className="w-full py-3 px-2 rounded-lg bg-whop-pomegranate text-white hover:bg-whop-pomegranate/90 transition-colors"
                  >
                    <div className="text-sm font-medium">{dateInfo.day}</div>
                    <div className="text-xs">{new Date(dateInfo.date).getDate()}</div>
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setCurrentStep('service')}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Back to Services
              </button>
            </div>
          </div>
        )}

        {currentStep === 'details' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Your Details
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Please provide your information to complete the booking
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Selected Service</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedService?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedService?.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-whop-pomegranate">${selectedService?.price}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedService?.duration_minutes} min</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Selected Date & Time</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => handleTimeSelect(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                  >
                    <option value="">Select time</option>
                    {availableTimes.map((time, index) => (
                      <option key={index} value={time.start}>
                        {time.start} - {time.end}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep('date')}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-whop-pomegranate text-white rounded-lg hover:bg-whop-pomegranate/90 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>
        )}

        {currentStep === 'payment' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Complete Your Booking
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                You're almost done! Complete your payment to confirm your booking.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Service:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{customerName}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                    <span className="text-2xl font-bold text-whop-pomegranate">${selectedService?.price}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={processPayment}
                disabled={isProcessingPayment}
                className="w-full px-6 py-3 bg-whop-pomegranate text-white rounded-lg hover:bg-whop-pomegranate/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingPayment ? 'Processing Payment...' : 'Pay Now'}
              </button>
              
              <button
                onClick={resetForm}
                className="mt-4 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
