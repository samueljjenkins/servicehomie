"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { WeeklyAvailability, Weekday } from "@/lib/availability";
import { isValidTenant } from "@/lib/tenant-utils";

// Declare global Whop checkout object
declare global {
  interface Window {
    wco: {
      embed: () => void;
    };
  }
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

type BookingStep = 'services' | 'datetime' | 'details' | 'payment' | 'confirmation';

export default function CustomerBookingPage() {
  const params = useParams();
  const [currentStep, setCurrentStep] = useState<BookingStep>('services');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [tenantValid, setTenantValid] = useState(false);
  const [tenant, setTenant] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showWhopCheckout, setShowWhopCheckout] = useState(false);
  const [tenantPlanId, setTenantPlanId] = useState<string | null>(null);

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

  useEffect(() => {
    // Validate tenant before proceeding
    const routeTenant = params?.tenant as string;
    
    if (routeTenant && isValidTenant(routeTenant)) {
      setTenant(routeTenant);
      setTenantValid(true);
      
      // Fetch tenant data to get the plan ID
      fetch(`/api/tenants/${routeTenant}`)
        .then(res => res.json())
        .then(data => {
          if (data.whop_plan_id) {
            setTenantPlanId(data.whop_plan_id);
          }
        })
        .catch(error => {
          console.error('Error fetching tenant data:', error);
        });
      
      // TODO: Initialize Supabase connection here only after tenant is confirmed
      console.log('Tenant confirmed, initializing booking for:', routeTenant);
      
      // Simulate loading
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    } else {
      console.error('Invalid tenant detected:', routeTenant);
      setTenantValid(false);
    }
  }, [params?.tenant]);

  // Embed Whop checkout when modal is shown
  useEffect(() => {
    if (showWhopCheckout && tenantPlanId) {
      // Clear previous checkout
      const container = document.getElementById('checkout-container');
      if (container) {
        container.innerHTML = '';
        
        // Create checkout element with Whop attributes for production
        const checkoutElement = document.createElement('div');
        checkoutElement.setAttribute('data-whop-checkout-plan-id', tenantPlanId);
        checkoutElement.setAttribute('data-whop-checkout-prefill-email', customerEmail);
        checkoutElement.setAttribute('data-whop-checkout-redirect-url', `${window.location.origin}/t/${tenant}/booking-success`);
        checkoutElement.className = 'w-full h-full';
        
        container.appendChild(checkoutElement);
        
        // Trigger Whop checkout embed initialization
        if (window.wco) {
          window.wco.embed();
        }
      }
    }
  }, [showWhopCheckout, tenantPlanId, customerEmail, tenant]);

  // Navigation functions
  const goBack = () => {
    switch (currentStep) {
      case 'datetime':
        setCurrentStep('services');
        break;
      case 'details':
        setCurrentStep('datetime');
        break;
      case 'payment':
        setCurrentStep('details');
        break;
      case 'confirmation':
        setCurrentStep('details');
        break;
      default:
        break;
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setCurrentStep('datetime');
  };

  const handleDateTimeSelect = () => {
    setCurrentStep('details');
  };

  const handleDetailsSubmit = () => {
    setCurrentStep('details');
  };

  const processPayment = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !customerName || !customerEmail) {
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Get tenant's Whop plan ID
      const tenantResponse = await fetch(`/api/tenants/${tenant}`);
      if (!tenantResponse.ok) {
        throw new Error('Failed to get tenant configuration');
      }
      
      const tenantData = await tenantResponse.json();
      if (!tenantData.whop_plan_id) {
        throw new Error('Tenant has not configured a Whop plan ID. Please contact the business owner.');
      }

      // Store booking details in session storage for webhook processing
      const bookingData = {
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        serviceDuration: selectedService.duration,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        customerName,
        customerEmail,
        customerPhone,
        tenantId: tenant,
        serviceId: selectedService.id
      };
      
      sessionStorage.setItem('pending_booking', JSON.stringify(bookingData));

      // Set tenant plan ID and show Whop checkout embed
      setTenantPlanId(tenantData.whop_plan_id);
      setShowWhopCheckout(true);
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Don't render anything until tenant is validated
  if (!tenantValid || !tenant) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Invalid Tenant
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The tenant ID "{params?.tenant}" is not valid.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
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





  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Book Your Session
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
            Tenant: {tenant}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 'services', label: 'Choose Service', active: currentStep === 'services' },
              { step: 'datetime', label: 'Pick Date & Time', active: currentStep === 'datetime' },
              { step: 'details', label: 'Your Details', active: currentStep === 'details' },
              { step: 'payment', label: 'Payment', active: currentStep === 'payment' },
              { step: 'confirmation', label: 'Confirm', active: currentStep === 'confirmation' }
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
                {index < 4 && (
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
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-lg transition-all hover:border-whop-pomegranate/50"
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
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
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
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Choose Date & Time
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select when you'd like to have your {selectedService?.name} session
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                  >
                    <option value="">Choose a time...</option>
                    {selectedDate && availability[new Date(selectedDate).getDay() as Weekday]?.map((window, index) => (
                      <option key={index} value={`${window.start}-${window.end}`}>
                        {window.start} - {window.end}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDate && selectedTime && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Booking Summary</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p><strong>Service:</strong> {selectedService?.name}</p>
                      <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {selectedTime}</p>
                      <p><strong>Duration:</strong> {selectedService?.duration} minutes</p>
                      <p><strong>Price:</strong> ${selectedService?.price}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={goBack}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your Details
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please provide your contact information to complete the booking
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                    placeholder="Enter your email address"
                    required
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-whop-pomegranate focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={goBack}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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

        {currentStep === 'payment' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Secure Payment
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Complete your booking with secure payment processing
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Service:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date & Time:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{customerName}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                    <span className="text-2xl font-bold text-whop-pomegranate">${selectedService?.price}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={goBack}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
              <button
                onClick={processPayment}
                disabled={isProcessingPayment}
                className="flex-1 px-6 py-3 bg-[#1754d8] text-white rounded-xl hover:bg-[#1347b8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {isProcessingPayment ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay $${selectedService?.price}`
                )}
              </button>
            </div>
          </div>
        )}

        {currentStep === 'confirmation' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Ready to Complete!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Review your booking details before proceeding to payment
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Booking Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Service:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{new Date(selectedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedService?.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Name:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{customerEmail}</span>
                </div>
                {customerPhone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{customerPhone}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                    <span className="text-2xl font-bold text-whop-pomegranate">${selectedService?.price}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={goBack}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('payment')}
                className="flex-1 px-6 py-3 bg-[#1754d8] text-white rounded-xl hover:bg-[#1347b8] transition-colors font-semibold"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {/* Whop Checkout Embed */}
        {showWhopCheckout && tenantPlanId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-4xl h-[600px] border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Complete Your Payment
                </h3>
                <button
                  onClick={() => setShowWhopCheckout(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div id="checkout-container" className="w-full h-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


