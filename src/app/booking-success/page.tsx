"use client";
import Link from 'next/link';

// Mock booking summary data
const mockBooking = {
  technician: 'Alice Johnson',
  service: 'Window Cleaning',
  date: '2024-07-10',
  time: '10:00 AM',
  price: 120,
};

export default function BookingSuccessPage() {
  return (
    <section className="py-20 bg-gray-50 min-h-[80vh] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-xl w-full text-center">
        <span className="text-6xl block mb-4">🎉</span>
        <h1 className="text-3xl font-extrabold text-green-600 mb-4">Booking Confirmed!</h1>
        <p className="text-gray-700 mb-8">Thank you for booking with Service Homie. Your service is scheduled and your technician will be in touch soon.</p>
        <div className="bg-blue-50 rounded-lg p-4 mb-8 text-left">
          <div className="font-semibold text-blue-700 text-lg">Technician: {mockBooking.technician}</div>
          <div className="text-gray-700">Service: {mockBooking.service}</div>
          <div className="text-gray-700">Date: {mockBooking.date}</div>
          <div className="text-gray-700">Time: {mockBooking.time}</div>
          <div className="text-gray-700">Price: <span className="font-bold text-green-600">${mockBooking.price}</span></div>
        </div>
        <Link href="/homeowner-dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition">Go to Dashboard</Link>
      </div>
    </section>
  );
} 