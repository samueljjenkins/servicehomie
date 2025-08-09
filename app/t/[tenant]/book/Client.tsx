"use client";

import { useEffect, useMemo, useState } from "react";
import {
  WeeklyAvailability,
  availabilityStorageKey,
  formatDate,
  formatTime,
  generateTimeSlots,
  getDefaultWeeklyAvailability,
  getNextDays,
} from "@/lib/availability";

export default function CustomerBookingClient({ tenant }: { tenant: string }) {
  const storageKey = useMemo(() => availabilityStorageKey(tenant), [tenant]);

  const [weekly, setWeekly] = useState<WeeklyAvailability>(getDefaultWeeklyAvailability());
  const [days, setDays] = useState<Date[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [slots, setSlots] = useState<Date[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setWeekly(JSON.parse(raw));
    } catch {}
    setDays(getNextDays(14));
  }, [storageKey]);

  useEffect(() => {
    if (!selectedDay) return;
    setSlots(generateTimeSlots(selectedDay, weekly));
  }, [selectedDay, weekly]);

  function beginCheckout() {
    if (!selectedDay || !selectedSlot) return;
    // Persist a simple job for demo purposes
    const jobsKey = `sh_jobs_${tenant}`;
    const payload = {
      date: formatDate(selectedDay),
      time: formatTime(selectedSlot),
      customer: "You",
    };
    try {
      const existing = JSON.parse(localStorage.getItem(jobsKey) || "[]");
      existing.push(payload);
      localStorage.setItem(jobsKey, JSON.stringify(existing));
    } catch {}

    const whopCheckout = process.env.NEXT_PUBLIC_WHOP_CHECKOUT_URL || "https://whop.com";
    window.location.href = whopCheckout;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Book a session</h1>
        <p className="text-slate-600 dark:text-slate-300">Choose a day and time that works for you.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Days */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Select a day</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {days.map((d) => {
              const active = selectedDay?.toDateString() === d.toDateString();
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => { setSelectedDay(d); setSelectedSlot(null); }}
                  className={`rounded-lg px-3 py-2 text-sm ${active ? "bg-whop-blue text-white" : "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                >
                  {formatDate(d)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Times */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Select a time</h2>
          {selectedDay ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {slots.length === 0 && (
                <p className="col-span-full text-sm text-slate-500">No times available for this day.</p>
              )}
              {slots.map((s) => {
                const active = selectedSlot?.getTime() === s.getTime();
                return (
                  <button
                    key={s.toISOString()}
                    onClick={() => setSelectedSlot(s)}
                    className={`rounded-lg px-3 py-2 text-sm ${active ? "bg-whop-blue text-white" : "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                  >
                    {formatTime(s)}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Pick a day to see available times.</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          disabled={!selectedDay || !selectedSlot}
          onClick={beginCheckout}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold ${!selectedDay || !selectedSlot ? "cursor-not-allowed bg-slate-300 text-slate-600 dark:bg-slate-700 dark:text-slate-400" : "bg-whop-blue text-white hover:bg-whop-blue/90"}`}
        >
          Continue to payment
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-500">On confirm, you’ll be redirected to your Whop checkout URL.</p>
    </div>
  );
}


