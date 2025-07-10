"use client";
import { useState } from 'react';

const mockJobs = [
  {
    id: 1,
    date: '2024-07-08',
    time: '10:00',
    service: 'Window Cleaning',
    address: '123 Main St, NY',
    homeowner: 'Sarah Johnson',
  },
  {
    id: 2,
    date: '2024-07-10',
    time: '14:00',
    service: 'Gutter Cleaning',
    address: '456 Oak Ave, NY',
    homeowner: 'David Thompson',
  },
  {
    id: 3,
    date: '2024-07-15',
    time: '09:00',
    service: 'Pressure Washing',
    address: '789 Pine St, NY',
    homeowner: 'Emily Rodriguez',
  },
  {
    id: 4,
    date: '2024-07-15',
    time: '13:00',
    service: 'Window Cleaning',
    address: '321 Elm St, NY',
    homeowner: 'Lisa Park',
  },
];

const mockAvailability = {
  Monday: ['09:00', '17:00'],
  Tuesday: ['09:00', '17:00'],
  Wednesday: ['09:00', '17:00'],
  Thursday: ['09:00', '17:00'],
  Friday: ['09:00', '17:00'],
  Saturday: [],
  Sunday: [],
};

function getMonthDays(year: number, month: number) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export default function TechnicianCalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const days = getMonthDays(currentYear, currentMonth);
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const jobsByDate = mockJobs.reduce((acc, job) => {
    acc[job.date] = acc[job.date] ? [...acc[job.date], job] : [job];
    return acc;
  }, {} as Record<string, typeof mockJobs>);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-blue-600">Technician Calendar</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
                aria-label="Previous Month"
              >
                &lt;
              </button>
              <span className="font-semibold text-lg">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button
                onClick={handleNextMonth}
                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
                aria-label="Next Month"
              >
                &gt;
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {weekDays.map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
            {/* Empty cells for first week */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map(date => {
              const dateStr = formatDate(date);
              const jobs = jobsByDate[dateStr] || [];
              const isToday = formatDate(date) === formatDate(today);
              return (
                <div
                  key={dateStr}
                  className={`rounded-lg border p-2 min-h-[80px] flex flex-col items-center justify-start relative ${isToday ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
                >
                  <span className={`absolute top-2 right-2 text-xs ${isToday ? 'text-blue-600' : 'text-gray-400'}`}>{date.getDate()}</span>
                  {jobs.length > 0 && (
                    <div className="mt-6 w-full">
                      {jobs.map(job => (
                        <div key={job.id} className="bg-blue-100 text-blue-800 rounded px-2 py-1 mb-1 text-xs text-center">
                          {job.time} - {job.service}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Upcoming Jobs List */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Jobs</h2>
            <div className="space-y-4">
              {mockJobs
                .filter(job => new Date(job.date) >= today)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map(job => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-semibold text-blue-700">{job.service}</div>
                      <div className="text-gray-600 text-sm">{job.date} at {job.time}</div>
                      <div className="text-gray-500 text-sm">{job.address}</div>
                      <div className="text-gray-500 text-sm">Homeowner: {job.homeowner}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Availability Info */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Weekly Availability</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(mockAvailability).map(([day, hours]) => (
                <div key={day} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="font-semibold text-gray-700 mb-1">{day}</div>
                  {hours.length > 0 ? (
                    <div className="text-gray-600 text-sm">{hours[0]} - {hours[1]}</div>
                  ) : (
                    <div className="text-gray-400 text-sm">Unavailable</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 