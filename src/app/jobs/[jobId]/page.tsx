"use client";
import { useParams } from 'next/navigation';

// Mock job data
const mockJob = {
  service: 'Window Cleaning',
  technician: 'Alice Johnson',
  homeowner: 'Jane Doe',
  date: '2024-07-10',
  time: '10:00 AM',
  address: '123 Main St, Springfield',
  price: 120,
  status: 'Scheduled',
  notes: 'Please focus on the front windows.',
};

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.jobId;

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Job Details</h1>
          <div className="mb-6 text-center text-gray-500">Job ID: <span className="font-mono">{jobId}</span></div>
          <div className="space-y-4">
            <div><span className="font-semibold text-gray-700">Service:</span> {mockJob.service}</div>
            <div><span className="font-semibold text-gray-700">Technician:</span> {mockJob.technician}</div>
            <div><span className="font-semibold text-gray-700">Homeowner:</span> {mockJob.homeowner}</div>
            <div><span className="font-semibold text-gray-700">Date:</span> {mockJob.date}</div>
            <div><span className="font-semibold text-gray-700">Time:</span> {mockJob.time}</div>
            <div><span className="font-semibold text-gray-700">Address:</span> {mockJob.address}</div>
            <div><span className="font-semibold text-gray-700">Price:</span> <span className="text-green-600 font-bold">${mockJob.price}</span></div>
            <div><span className="font-semibold text-gray-700">Status:</span> <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">{mockJob.status}</span></div>
            <div><span className="font-semibold text-gray-700">Notes:</span> <span className="italic text-gray-600">{mockJob.notes}</span></div>
          </div>
        </div>
      </div>
    </section>
  );
} 