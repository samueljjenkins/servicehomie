"use client";

import { useEffect, useMemo, useState } from "react";
import type { WeeklyAvailability, Weekday, TimeWindow } from "@/lib/availability";
import { availabilityStorageKey, getDefaultWeeklyAvailability } from "@/lib/availability";

const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export default function DashboardClient({ tenant }: { tenant: string }) {
  const storageKey = useMemo(() => availabilityStorageKey(tenant), [tenant]);

  const [availability, setAvailability] = useState<WeeklyAvailability>(getDefaultWeeklyAvailability());
  const [upcoming, setUpcoming] = useState<{ date: string; time: string; customer: string }[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setAvailability(JSON.parse(raw));
    } catch {}
    try {
      const rawJobs = localStorage.getItem(`sh_jobs_${tenant}`);
      if (rawJobs) setUpcoming(JSON.parse(rawJobs));
    } catch {}
  }, [storageKey, tenant]);

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Creator Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-300">Set your weekly availability and review upcoming jobs.</p>
      </header>

      {/* Availability editor */}
      <section className="mb-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Weekly availability</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {weekLabels.map((label, idx) => {
            const dayIndex = idx as Weekday;
            const windows = availability[dayIndex];
            const enabled = windows.length > 0;
            return (
              <div key={label} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium text-slate-800 dark:text-slate-100">{label}</span>
                  <button
                    onClick={() => toggleDayEnabled(dayIndex)}
                    className={`rounded-md px-2 py-1 text-xs font-medium ${enabled ? "bg-whop-blue text-white" : "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"}`}
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
                        <button onClick={() => removeWindow(dayIndex, wi)} className="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Remove</button>
                      </div>
                    ))}
                    <button onClick={() => addWindow(dayIndex)} className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300">Add window</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-slate-500">Availability is saved locally for demo. We can wire this to Supabase next.</p>
      </section>

      {/* Upcoming jobs */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Upcoming jobs</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-500">No upcoming jobs yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {upcoming.map((j, i) => (
              <li key={i} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">{j.customer}</p>
                  <p className="text-slate-500">{j.date} · {j.time}</p>
                </div>
                <button className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300">View</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}


