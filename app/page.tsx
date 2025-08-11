"use client";

import { useState } from "react";

export default function Page() {
  const [activeTab, setActiveTab] = useState<'overview' | 'demo'>('overview');

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111] relative overflow-hidden">
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-tech-splash bg-grain" />

      {activeTab === 'overview' ? (
        <main className="mx-auto flex min-h-screen max-w-none flex-col items-center justify-center px-6 text-center">
          <h1 className="w-full text-balance font-extrabold leading-[0.9] tracking-tight text-slate-900 dark:text-white text-[clamp(4rem,10vw,10rem)]">
            Service Homie
          </h1>
          <p className="mt-4 font-semibold text-slate-700 dark:text-slate-300 text-[clamp(1.5rem,3vw,2.5rem)]">
            Your All‑In‑One Whop Booking Platform
          </p>
          <div className="mt-8 space-x-4">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex cursor-not-allowed items-center justify-center rounded-lg bg-whop-pomegranate px-6 py-3 text-sm font-semibold text-white"
            >
              View on Whop App Store
            </button>
            <button
              onClick={() => setActiveTab('demo')}
              className="inline-flex items-center justify-center rounded-lg bg-whop-blue px-6 py-3 text-sm font-semibold text-white hover:bg-whop-blue/90 transition-colors"
            >
              Try Demo Now
            </button>
          </div>
        </main>
      ) : (
        <div className="min-h-screen">
          {/* Header */}
          <header className="bg-gradient-to-r from-whop-pomegranate to-whop-blue text-white py-6">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Service Homie</h1>
                  <p className="text-white/90">Your All-In-One Whop Booking Platform</p>
                </div>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Back to Overview
                </button>
              </div>
            </div>
          </header>

          {/* Demo Content */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                🎉 Welcome to Your Creator Dashboard!
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                This is a fully functional demo of your booking platform
              </p>
            </div>

            {/* Quick Demo Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <span className="text-whop-pomegranate">📅</span>
                  Set Your Availability
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Choose which days and times you're available for customer bookings
                </p>
                <div className="space-y-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                    <div key={day} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{day}</span>
                      <span className="text-sm text-whop-pomegranate font-medium">9:00 AM - 5:00 PM</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <span className="text-whop-blue">📋</span>
                  Manage Bookings
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  View and manage all upcoming customer appointments
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">John Doe</p>
                        <p className="text-sm text-slate-500">Tomorrow at 2:00 PM</p>
                      </div>
                      <span className="text-xs bg-whop-blue text-white px-2 py-1 rounded-full">Confirmed</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">Jane Smith</p>
                        <p className="text-sm text-slate-500">Friday at 10:00 AM</p>
                      </div>
                      <span className="text-xs bg-whop-chartreuse text-slate-800 px-2 py-1 rounded-full">Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-whop-pomegranate/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Easy Scheduling</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Customers can easily book sessions based on your availability
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-whop-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Payment Integration</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Seamless payment processing through Whop's platform
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-whop-chartreuse/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Mobile Friendly</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Works perfectly on all devices and screen sizes
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-whop-pomegranate/10 to-whop-blue/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                This demo shows exactly how your booking platform will work for customers
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className="bg-whop-pomegranate text-white px-6 py-3 rounded-lg font-semibold hover:bg-whop-pomegranate/90 transition-colors"
                >
                  Back to Landing
                </button>
                <button className="bg-whop-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-whop-blue/90 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
