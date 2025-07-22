"use client";
import { useState } from "react";

const services = [
  {
    name: "Add your first service",
    description: "Describe what you offer to customers",
    price: "$0",
    icon: "🛠️",
  },
];

const reviews = [
  {
    name: "Customer reviews will appear here",
    rating: 5,
    text: "Great feedback from your customers will show up here once you start getting bookings.",
  },
];

const socials = [
  { name: "Instagram", href: "https://instagram.com/", icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.5" y2="6.5" /></svg>
  ) },
  { name: "TikTok", href: "https://tiktok.com/", icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17a4 4 0 1 1 0-8h1V7h2v2h2v2h-2v6a2 2 0 1 1-2-2" /></svg>
  ) },
  { name: "Facebook", href: "https://facebook.com/", icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 2h-3a4 4 0 0 0-4 4v3H7v4h4v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z" /></svg>
  ) },
];

// Helper to get days in month
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Helper to get weekday (0=Sun, 1=Mon, ...)
function getWeekday(year: number, month: number, day: number) {
  return new Date(year, month, day).getDay();
}

const availableWeekdays = [1, 2, 3, 4, 5]; // Mon-Fri
const timeSlots = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"];

export default function TechnicianPage() {
  // Calendar state
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getWeekday(year, month, 1);

  // Generate calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  // Only allow booking on Mon-Fri
  function isAvailable(day: number | null) {
    if (!day) return false;
    const wd = getWeekday(year, month, day);
    return availableWeekdays.includes(wd);
  }

  function handleBook() {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedDay(null);
      setSelectedTime(null);
    }, 3000);
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <section className="w-full max-w-xl mx-auto flex flex-col items-center py-10 px-4">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 via-blue-200 to-blue-100 blur-sm opacity-60 scale-110" />
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Alex Carter" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-2xl relative z-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">Alex Carter</h1>
        <div className="text-blue-600 font-medium mb-2">Dallas, TX</div>
        <p className="text-center text-gray-700 mb-4 max-w-md">Professional window & gutter cleaning. Reliable, friendly, and always on time.</p>
        <button className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold px-8 py-3 rounded-full shadow-xl transition mb-2 text-lg">Book a Service</button>
      </section>

      {/* Services Showcase */}
      <section className="w-full max-w-xl mx-auto py-6 px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Services</h2>
        <div className="flex flex-col gap-4">
          {services.map((service, i) => (
            <div key={i} className="flex items-center bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-4 justify-between hover:shadow-2xl transition">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{service.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900">{service.name}</div>
                  <div className="text-gray-500 text-sm">{service.description}</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="font-bold text-blue-600 text-lg">{service.price}</div>
                <button className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold px-4 py-2 rounded-full text-sm shadow transition">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="w-full max-w-xl mx-auto py-6 px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
        <div className="flex flex-col gap-4">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{review.name}</span>
                <span className="flex gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <svg key={idx} className={`w-4 h-4 ${idx < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                  ))}
                </span>
              </div>
              <div className="text-gray-700 text-sm">{review.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Availability Calendar */}
      <section className="w-full max-w-xl mx-auto py-6 px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Book a Time</h2>
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-4 flex flex-col items-center">
          {/* Calendar header */}
          <div className="flex justify-between items-center w-full mb-2">
            <button
              onClick={() => {
                if (month === 0) {
                  setMonth(11);
                  setYear(y => y - 1);
                } else {
                  setMonth(month - 1);
                }
              }}
              className="p-2 rounded hover:bg-blue-100" aria-label="Prev Month"
            >&lt;</button>
            <span className="font-semibold">{new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            <button
              onClick={() => {
                if (month === 11) {
                  setMonth(0);
                  setYear(y => y + 1);
                } else {
                  setMonth(month + 1);
                }
              }}
              className="p-2 rounded hover:bg-blue-100" aria-label="Next Month"
            >&gt;</button>
          </div>
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 w-full text-center text-xs mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="font-semibold text-gray-500">{d}</div>)}
            {calendarDays.map((day, idx) => (
              <button
                key={idx}
                disabled={!isAvailable(day)}
                onClick={() => setSelectedDay(day)}
                className={`h-8 w-8 flex items-center justify-center rounded-full transition text-sm
                  ${!day ? '' : isAvailable(day) ? (selectedDay === day ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-100 text-blue-700 hover:bg-blue-200') : 'text-gray-300 cursor-not-allowed'}`}
              >
                {day || ''}
              </button>
            ))}
          </div>
          {/* Time slots */}
          {selectedDay && (
            <div className="w-full mt-4 flex flex-col items-center">
              <div className="mb-2 text-gray-700 font-semibold">Select a time:</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition
                      ${selectedTime === slot ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <button
                className="mt-4 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold px-8 py-3 rounded-full shadow-xl text-lg transition"
                disabled={!selectedTime}
                onClick={handleBook}
              >
                Book Now
              </button>
              {bookingSuccess && <div className="mt-2 text-green-600 font-semibold">Booking confirmed!</div>}
            </div>
          )}
        </div>
      </section>

      {/* Payment Section */}
      <section className="w-full max-w-xl mx-auto py-6 px-4 flex flex-col items-center">
        <button className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold px-10 py-4 rounded-full shadow-xl text-lg transition mb-2">Book Now (Stripe Checkout)</button>
        <div className="text-gray-500 text-sm">Secure payments powered by Stripe</div>
      </section>

      {/* Contact & Socials */}
      <section className="w-full max-w-xl mx-auto py-6 px-4 flex flex-col items-center">
        <div className="text-gray-700 font-semibold mb-2">Contact</div>
        <a href="mailto:alex@carterclean.com" className="text-blue-600 hover:underline mb-4">alex@carterclean.com</a>
        <div className="flex gap-4">
          {socials.map((social, i) => (
            <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="bg-white/80 backdrop-blur rounded-full p-3 shadow hover:bg-blue-100 transition border border-blue-100" aria-label={social.name}>
              {social.icon}
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-gray-400 text-sm mt-8">
        Powered by <span className="font-bold text-blue-600">Service Homie</span>
      </footer>
    </div>
  );
} 