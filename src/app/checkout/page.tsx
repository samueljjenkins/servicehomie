"use client";
import { useState } from 'react';

// Mock booking summary data
const mockBooking = {
  technician: 'Alice Johnson',
  service: 'Window Cleaning',
  date: '2024-07-10',
  time: '10:00 AM',
  price: 120,
};

export default function CheckoutPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Checkout</h1>
          {submitted ? (
            <div className="text-center py-12">
              <span className="text-5xl block mb-4">🎉</span>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
              <p className="text-gray-700">Your booking is confirmed. Thank you for choosing Service Homie!</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Booking Summary */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="font-semibold text-blue-700 text-lg">Technician: {mockBooking.technician}</div>
                <div className="text-gray-700">Service: {mockBooking.service}</div>
                <div className="text-gray-700">Date: {mockBooking.date}</div>
                <div className="text-gray-700">Time: {mockBooking.time}</div>
                <div className="text-gray-700">Price: <span className="font-bold text-green-600">${mockBooking.price}</span></div>
              </div>
              {/* Payment Info (mock) */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Card Number</label>
                <input type="text" required maxLength={19} placeholder="1234 5678 9012 3456" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">Expiry</label>
                  <input type="text" required maxLength={5} placeholder="MM/YY" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">CVC</label>
                  <input type="text" required maxLength={4} placeholder="123" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition">Pay ${mockBooking.price}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
} 