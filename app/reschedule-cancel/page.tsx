"use client";
import { useState } from 'react';

const mockBookings = [
  {
    id: 1,
    service: 'Window Cleaning',
    technician: 'John Smith',
    date: '2024-01-15',
    time: '10:00',
    status: 'confirmed',
    price: 120,
  },
  {
    id: 2,
    service: 'Gutter Cleaning',
    technician: 'Mike Johnson',
    date: '2024-01-20',
    time: '14:00',
    status: 'confirmed',
    price: 150,
  },
  {
    id: 3,
    service: 'Pressure Washing',
    technician: 'Sarah Wilson',
    date: '2024-01-25',
    time: '09:00',
    status: 'confirmed',
    price: 200,
  },
];

export default function RescheduleCancelPage() {
  const [bookings, setBookings] = useState(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [message, setMessage] = useState('');

  const handleReschedule = () => {
    if (!newDate || !newTime) {
      setMessage('Please select both date and time');
      return;
    }
    setBookings(prev => prev.map(booking => 
      booking.id === selectedBooking 
        ? { ...booking, date: newDate, time: newTime }
        : booking
    ));
    setMessage('Booking rescheduled successfully!');
    setShowRescheduleModal(false);
    setSelectedBooking(null);
    setNewDate('');
    setNewTime('');
  };

  const handleCancel = () => {
    setBookings(prev => prev.filter(booking => booking.id !== selectedBooking));
    setMessage('Booking cancelled successfully!');
    setShowCancelModal(false);
    setSelectedBooking(null);
  };

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Manage Your Bookings</h1>
          {message && (
            <div className="mb-6 text-center">
              <span className="text-green-600 font-semibold">{message}</span>
            </div>
          )}
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{booking.service}</h3>
                    <p className="text-gray-600">Technician: {booking.technician}</p>
                    <p className="text-gray-600">Date: {booking.date} at {booking.time}</p>
                    <p className="text-gray-600">Price: ${booking.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking.id);
                        setShowRescheduleModal(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBooking(booking.id);
                        setShowCancelModal(true);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Reschedule Booking</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleReschedule}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Confirm Reschedule
              </button>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Cancel Booking</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
              >
                Confirm Cancel
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 