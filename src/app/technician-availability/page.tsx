"use client";
import { useState } from 'react';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const mockAvailability = daysOfWeek.reduce((acc, day) => {
  acc[day] = { available: false, start: '', end: '' };
  return acc;
}, {} as Record<string, { available: boolean; start: string; end: string }>);

export default function TechnicianAvailabilityPage() {
  const [availability, setAvailability] = useState(mockAvailability);
  const [saved, setSaved] = useState(false);

  const handleDayChange = (day: string, field: 'available' | 'start' | 'end', value: boolean | string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Set Your Availability</h1>
          {saved && (
            <div className="mb-6 text-center">
              <span className="text-green-600 font-semibold">Availability saved successfully!</span>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {daysOfWeek.map(day => (
                <div key={day} className="flex items-center gap-4">
                  <label className="flex items-center gap-2 w-32">
                    <input
                      type="checkbox"
                      checked={availability[day].available}
                      onChange={e => handleDayChange(day, 'available', e.target.checked)}
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700 font-medium">{day}</span>
                  </label>
                  <input
                    type="time"
                    value={availability[day].start}
                    onChange={e => handleDayChange(day, 'start', e.target.value)}
                    disabled={!availability[day].available}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none w-28"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={availability[day].end}
                    onChange={e => handleDayChange(day, 'end', e.target.value)}
                    disabled={!availability[day].available}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none w-28"
                  />
                </div>
              ))}
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition">Save Availability</button>
          </form>
        </div>
      </div>
    </section>
  );
} 