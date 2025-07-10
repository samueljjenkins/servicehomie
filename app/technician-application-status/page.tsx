"use client";
import Link from 'next/link';

// Mock application status
const mockStatus = {
  status: 'Pending Review', // Change to 'Approved' or 'Rejected' to test other states
  message: 'Your application is under review. We will notify you by email once a decision has been made.'
};

export default function TechnicianApplicationStatusPage() {
  return (
    <section className="py-20 bg-gray-50 min-h-[80vh] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-xl w-full text-center">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-4">Application Status</h1>
        <div className={`text-2xl font-bold mb-4 ${mockStatus.status === 'Approved' ? 'text-green-600' : mockStatus.status === 'Rejected' ? 'text-red-600' : 'text-yellow-500'}`}>{mockStatus.status}</div>
        <p className="text-gray-700 mb-8">{mockStatus.message}</p>
        <Link href="/technician-dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition">Go to Dashboard</Link>
      </div>
    </section>
  );
} 