"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { isValidTenant } from "@/lib/tenant-utils";

export default function BookingSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [tenantValid, setTenantValid] = useState(false);
  const [tenant, setTenant] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    const routeTenant = params?.tenant as string;
    
    if (routeTenant && isValidTenant(routeTenant)) {
      setTenant(routeTenant);
      setTenantValid(true);
      
      // Get booking details from URL params or session storage
      const sessionId = searchParams.get('session_id');
      if (sessionId) {
        // TODO: Fetch booking details from the session ID
        setBookingDetails({
          serviceName: 'Your Service',
          date: 'Selected Date',
          time: 'Selected Time',
          price: 'Service Price'
        });
      }
    }
  }, [params?.tenant, searchParams]);

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

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Thank you for your booking. We've sent a confirmation email with all the details.
          </p>

          {/* Booking Details */}
          {bookingDetails && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Booking Details
              </h2>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Service:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{bookingDetails.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{bookingDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{bookingDetails.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{bookingDetails.price}</span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              What happens next?
            </h3>
            <ul className="text-left text-blue-800 dark:text-blue-200 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                You'll receive a confirmation email with your booking details
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                We'll send you a reminder 24 hours before your appointment
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                If you need to reschedule, contact us at least 24 hours in advance
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/t/${tenant}`}
              className="inline-flex items-center px-6 py-3 bg-[#1754d8] text-white rounded-xl hover:bg-[#1347b8] transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Book Another Service
            </a>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
