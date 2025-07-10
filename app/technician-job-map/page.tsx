"use client";
import { useState } from 'react';

const mockJobs = [
  {
    id: 1,
    service: 'Window Cleaning',
    address: '123 Main St, New York, NY',
    date: '2024-07-10',
    status: 'upcoming',
    lat: 40.7128,
    lng: -74.006,
  },
  {
    id: 2,
    service: 'Gutter Cleaning',
    address: '456 Oak Ave, Brooklyn, NY',
    date: '2024-07-12',
    status: 'upcoming',
    lat: 40.6782,
    lng: -73.9442,
  },
  {
    id: 3,
    service: 'Pressure Washing',
    address: '789 Pine St, Queens, NY',
    date: '2024-07-05',
    status: 'completed',
    lat: 40.7282,
    lng: -73.7949,
  },
  {
    id: 4,
    service: 'Window Cleaning',
    address: '321 Elm St, Manhattan, NY',
    date: '2024-06-28',
    status: 'completed',
    lat: 40.7831,
    lng: -73.9712,
  },
];

export default function TechnicianJobMapPage() {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // For MVP, use a static map image with pins overlayed (mocked)
  // In production, replace with a real map (e.g., Google Maps, Mapbox)
  const mapWidth = 700;
  const mapHeight = 350;

  // Map bounds for mock pin placement (NYC area)
  const bounds = {
    minLat: 40.67,
    maxLat: 40.79,
    minLng: -74.02,
    maxLng: -73.79,
  };

  function getPinPosition(lat: number, lng: number) {
    // Simple linear mapping for mockup
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * mapWidth;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * mapHeight;
    return { left: x, top: y };
  }

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-8 text-center">Job Map</h1>
          <p className="text-lg text-gray-600 mb-8 text-center">View your upcoming and past jobs on the map.</p>

          {/* Map Section */}
          <div className="relative mb-10 mx-auto" style={{ width: mapWidth, height: mapHeight, maxWidth: '100%' }}>
            <img
              src="https://maps.googleapis.com/maps/api/staticmap?center=Dallas,TX&zoom=11&size=700x350&maptype=roadmap&key=YOUR_API_KEY"
              alt="Map of Dallas, TX"
              className="w-full h-full object-cover rounded-lg border"
              style={{ width: mapWidth, height: mapHeight }}
            />
            {/* Pins */}
            {mockJobs.map(job => {
              const pos = getPinPosition(job.lat, job.lng);
              const isSelected = selectedJobId === job.id;
              return (
                <button
                  key={job.id}
                  style={{ position: 'absolute', left: pos.left, top: pos.top, zIndex: isSelected ? 2 : 1 }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${isSelected ? 'border-blue-600 bg-blue-600 text-white scale-110' : job.status === 'upcoming' ? 'border-green-500 bg-green-500 text-white' : 'border-gray-400 bg-gray-300 text-gray-700'} shadow transition-transform`}
                  title={job.service + ' - ' + job.address}
                  onClick={() => setSelectedJobId(job.id)}
                >
                  {job.status === 'upcoming' ? '📍' : '✅'}
                </button>
              );
            })}
          </div>

          {/* Job List */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Jobs</h2>
            <div className="space-y-4">
              {mockJobs.map(job => (
                <div
                  key={job.id}
                  className={`border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer transition-all ${selectedJobId === job.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
                  onClick={() => setSelectedJobId(job.id)}
                >
                  <div>
                    <div className="font-semibold text-blue-700">{job.service}</div>
                    <div className="text-gray-600 text-sm">{job.address}</div>
                    <div className="text-gray-500 text-sm">{job.date}</div>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${job.status === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                      {job.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 