"use client";

import { useEffect, useState } from "react";
import type { WeeklyAvailability, Weekday, TimeWindow } from "@/lib/availability";
import { availabilityStorageKey, getDefaultWeeklyAvailability } from "@/lib/availability";

const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export default function DemoPage() {
  const [availability, setAvailability] = useState<WeeklyAvailability>(getDefaultWeeklyAvailability());
  const [upcoming, setUpcoming] = useState<{ date: string; time: string; customer: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'booking'>('dashboard');

  const storageKey = 'demo_availability';

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setAvailability(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Error loading availability:', e);
    }
    
    try {
      const rawJobs = localStorage.getItem('demo_jobs');
      if (rawJobs) {
        setUpcoming(JSON.parse(rawJobs));
      }
    } catch (e) {
      console.error('Error loading jobs:', e);
    }
  }, []);

  function persist(next: WeeklyAvailability) {
    setAvailability(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  }

  function toggleDayEnabled(dayIndex: Weekday) {
    const windows = availability[dayIndex];
    const next = { ...availability, [dayIndex]: windows.length ? [] : [{ start: "09:00", end: "17:00" }] } as WeeklyAvailability;
    persist(next);
  }

  function updateWindow(dayIndex: Weekday, windowIndex: number, field: keyof TimeWindow, value: string) {
    const next = structuredClone(availability);
    next[dayIndex][windowIndex][field] = value;
    persist(next);
  }

  function addWindow(dayIndex: Weekday) {
    const next = structuredClone(availability);
    next[dayIndex].push({ start: "09:00", end: "17:00" });
    persist(next);
  }

  function removeWindow(dayIndex: Weekday, windowIndex: number) {
    const next = structuredClone(availability);
    next[dayIndex].splice(windowIndex, 1);
    persist(next);
  }

  function addDemoBooking() {
    const demoBooking = {
      date: new Date().toLocaleDateString(),
      time: "2:00 PM",
      customer: "Demo Customer"
    };
    const newBookings = [...upcoming, demoBooking];
    setUpcoming(newBookings);
    try {
      localStorage.setItem('demo_jobs', JSON.stringify(newBookings));
    } catch {}
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      {/* Header */}
      <header className="bg-gradient-to-r from-whop-pomegranate to-whop-blue text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Service Homie</h1>
          <p className="text-white/90">Your All-In-One Whop Booking Platform</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-whop-pomegranate text-whop-pomegranate'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              Creator Dashboard
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'booking'
                  ? 'border-whop-pomegranate text-whop-pomegranate'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              Customer Booking
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Welcome to Your Creator Dashboard! 🎉
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Set your availability and manage bookings
              </p>
            </div>

            {/* Availability Editor */}
            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <span className="text-whop-blue">📅</span>
                Weekly Availability
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {weekLabels.map((label, idx) => {
                  const dayIndex = idx as Weekday;
                  const windows = availability[dayIndex];
                  const enabled = windows.length > 0;
                  return (
                    <div key={label} className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-slate-800 dark:text-slate-100">{label}</span>
                        <button
                          onClick={() => toggleDayEnabled(dayIndex)}
                          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                            enabled 
                              ? "bg-whop-pomegranate text-white hover:bg-whop-pomegranate/90" 
                              : "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {enabled ? "Enabled" : "Disabled"}
                        </button>
                      </div>
                      {enabled && (
                        <div className="space-y-2">
                          {windows.map((w, wi) => (
                            <div key={wi} className="flex items-center gap-2">
                              <input
                                type="time"
                                value={w.start}
                                onChange={(e) => updateWindow(dayIndex, wi, "start", e.target.value)}
                                className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
                              />
                              <span className="text-slate-500">to</span>
                              <input
                                type="time"
                                value={w.end}
                                onChange={(e) => updateWindow(dayIndex, wi, "end", e.target.value)}
                                className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
                              />
                              <button 
                                onClick={() => removeWindow(dayIndex, wi)} 
                                className="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => addWindow(dayIndex)} 
                            className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                          >
                            Add window
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Upcoming Bookings */}
            <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="text-whop-chartreuse">📋</span>
                  Upcoming Bookings
                </h3>
                <button
                  onClick={addDemoBooking}
                  className="bg-whop-blue text-white px-4 py-2 rounded-lg text-sm hover:bg-whop-blue/90 transition-colors"
                >
                  Add Demo Booking
                </button>
              </div>
              {upcoming.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-2">No upcoming bookings yet</p>
                  <p className="text-xs text-slate-400">Click "Add Demo Booking" to see how it works</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                  {upcoming.map((j, i) => (
                    <li key={i} className="flex items-center justify-between py-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-100">{j.customer}</p>
                        <p className="text-slate-500">{j.date} · {j.time}</p>
                      </div>
                      <button className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300">
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Customer Booking Interface
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              This is where customers would select dates and times to book sessions
            </p>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The booking interface would show available time slots based on your set availability.
                Customers would select a date, choose a time, and complete their booking.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
