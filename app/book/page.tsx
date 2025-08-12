"use client";

import { useState } from "react";
import type { WeeklyAvailability, Weekday } from "@/lib/availability";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

type BookingStep = 'services' | 'datetime' | 'details' | 'confirmation';

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('services');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Mock data - TODO: Replace with Supabase
  const [services] = useState<Service[]>([
    {
      id: '1',
      name: 'Consultation',
      description: '1-on-1 consultation session',
      price: 50,
      duration: 60,
      isActive: true
    },
    {
      id: '2',
      name: 'Strategy Session',
      description: 'Comprehensive strategy planning',
      price: 100,
      duration: 90,
      isActive: true
    }
  ]);

  const [availability] = useState<WeeklyAvailability>({
    0: [], // Sunday
    1: [{ start: "09:00", end: "17:00" }], // Monday
    2: [{ start: "09:00", end: "17:00" }], // Tuesday
    3: [{ start: "09:00", end: "17:00" }], // Wednesday
    4: [{ start: "09:00", end: "17:00" }], // Thursday
    5: [{ start: "09:00", end: "17:00" }], // Friday
    6: [] // Saturday
  });

  function handleServiceSelect(service: Service) {
    setSelectedService(service);
    setCurrentStep('datetime');
  }

  function handleDateTimeSelect() {
    if (selectedDate && selectedTime) {
      setCurrentStep('details');
    }
  }

  function handleDetailsSubmit() {
    if (customerName && customerEmail) {
      setCurrentStep('confirmation');
    }
  }

  function handleWhopCheckout() {
    // TODO: Integrate with Whop checkout
    console.log('Redirecting to Whop checkout...');
  }

  function goBack() {
    if (currentStep === 'datetime') setCurrentStep('services');
    else if (currentStep === 'details') setCurrentStep('datetime');
    else if (currentStep === 'confirmation') setCurrentStep('details');
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="bg-white dark:bg-black border-b border-[#E1E1E1] dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Book Your Session
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-lg">
            Demo Mode
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-black border-b border-[#E1E1E1] dark:border-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 'services', label: 'Choose Service', active: currentStep === 'services' },
              { step: 'datetime', label: 'Pick Date & Time', active: currentStep === 'datetime' },
              { step: 'details', label: 'Your Details', active: currentStep === 'details' },
              { step: 'confirmation', label: 'Confirm', active: currentStep === 'confirmation' }
            ].map((stepInfo, index) => (
              <div key={stepInfo.step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium font-inter ${
                  stepInfo.active
                    ? 'bg-whop-pomegranate text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-[#626262] dark:text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium font-inter ${
                  stepInfo.active
                    ? 'text-whop-pomegranate'
                    : 'text-[#626262] dark:text-gray-400'
                }`}>
                  {stepInfo.label}
                </span>
                {index < 3 && (
                  <div className={`ml-4 w-8 h-0.5 ${
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
        {currentStep === 'services' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <div className="w-20 h-20 bg-whop-pomegranate rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Service
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Select the service that best fits your needs. Each session is tailored to help you achieve your goals.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {services.filter(s => s.isActive).map(service => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-[#E1E1E1] dark:border-gray-800 cursor-pointer hover:shadow-lg transition-all hover:border-whop-pomegranate/50"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-whop-pomegranate/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-whop-pomegranate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{service.duration} min</span>
                        </div>
                        <div className="text-2xl font-bold text-whop-pomegranate">
                          ${service.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* How It Works */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-[#E1E1E1] dark:border-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                How It Works
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { number: '1', title: 'Choose Service', description: 'Pick the service that fits your needs' },
                  { number: '2', title: 'Select Time', description: 'Choose a date and time that works for you' },
                  { number: '3', title: 'Get Started', description: 'Complete your booking and start your session' }
                ].map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-whop-pomegranate/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold text-whop-pomegranate">{step.number}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Secure & Trusted</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Your booking is secure and protected. All payments are processed through Whop's secure platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'datetime' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Pick Date & Time
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Choose when you'd like to have your {selectedService?.name} session
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-[#E1E1E1] dark:border-gray-800">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Time
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={goBack}
                className="flex-1 px-6 py-3 border border-[#E1E1E1] dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleDateTimeSelect}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 px-6 py-3 bg-whop-pomegranate text-white rounded-xl hover:bg-whop-pomegranate/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {currentStep === 'details' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Your Details
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Please provide your contact information to complete the booking
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-[#E1E1E1] dark:border-gray-800">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                    placeholder="Enter your full name"
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
                    className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E1E1E1] dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={goBack}
                className="flex-1 px-6 py-3 border border-[#E1E1E1] dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleDetailsSubmit}
                disabled={!customerName || !customerEmail}
                className="flex-1 px-6 py-3 bg-whop-pomegranate text-white rounded-xl hover:bg-whop-pomegranate/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {currentStep === 'confirmation' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Confirm Your Booking
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Please review your booking details before proceeding
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-[#E1E1E1] dark:border-gray-800">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Service:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedService?.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{customerEmail}</span>
                </div>
                <div className="border-t border-[#E1E1E1] dark:border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                    <span className="text-2xl font-bold text-whop-pomegranate">${selectedService?.price}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={goBack}
                className="flex-1 px-6 py-3 border border-[#E1E1E1] dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleWhopCheckout}
                className="flex-1 px-6 py-3 bg-whop-pomegranate text-white rounded-xl hover:bg-whop-pomegranate/90 transition-colors"
              >
                Complete Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
