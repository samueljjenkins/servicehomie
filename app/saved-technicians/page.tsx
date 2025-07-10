"use client";
import { useState } from 'react';
import Link from 'next/link';

const mockSavedTechnicians = [
  {
    id: 1,
    name: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    services: ['Window Cleaning', 'Gutter Cleaning'],
    location: 'New York, NY',
    verified: true,
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    services: ['Pressure Washing'],
    location: 'Brooklyn, NY',
    verified: true,
  },
  {
    id: 3,
    name: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face',
    rating: 4.7,
    services: ['Gutter Cleaning'],
    location: 'Queens, NY',
    verified: false,
  },
];

function renderStars(rating: number) {
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
}

export default function SavedTechniciansPage() {
  const [saved, setSaved] = useState(mockSavedTechnicians);
  const [removedId, setRemovedId] = useState<number | null>(null);

  const handleRemove = (id: number) => {
    setRemovedId(id);
    setTimeout(() => {
      setSaved(saved.filter(t => t.id !== id));
      setRemovedId(null);
    }, 600);
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Saved Technicians</h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Easily rebook or view your favorite technicians.
          </p>

          {saved.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔖</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">No Saved Technicians</h2>
              <p className="text-gray-500 mb-4">Browse the marketplace and bookmark your favorite pros for quick access here.</p>
              <Link href="/marketplace" className="text-blue-600 hover:text-blue-800 font-medium">
                Go to Marketplace →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {saved.map(tech => (
                <div
                  key={tech.id}
                  className={`flex flex-col md:flex-row items-center gap-6 border border-gray-200 rounded-lg p-6 shadow-sm transition-all duration-500 ${removedId === tech.id ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}`}
                >
                  <img
                    src={tech.avatar}
                    alt={tech.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-100"
                  />
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-gray-900">{tech.name}</h2>
                      {tech.verified && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">✓ Verified</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400 text-lg">{renderStars(tech.rating)}</span>
                      <span className="text-gray-700 font-medium">{tech.rating}</span>
                    </div>
                    <div className="text-gray-600 text-sm mb-1">{tech.services.join(', ')}</div>
                    <div className="text-gray-500 text-sm">{tech.location}</div>
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-auto md:items-end">
                    <Link
                      href={`/technician-profile?id=${tech.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition text-center"
                    >
                      View Profile
                    </Link>
                    <Link
                      href={`/booking?technician=${tech.id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition text-center"
                    >
                      Book Now
                    </Link>
                    <button
                      onClick={() => handleRemove(tech.id)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition text-center"
                      disabled={removedId === tech.id}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 