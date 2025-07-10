"use client";
import { useState } from 'react';

const mockTechnicians = [
  {
    id: 1,
    name: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    price: 120,
    services: ['Window Cleaning', 'Gutter Cleaning'],
    location: 'New York, NY',
    reviews: 127,
    verified: true,
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    price: 130,
    services: ['Pressure Washing', 'Window Cleaning'],
    location: 'Brooklyn, NY',
    reviews: 98,
    verified: true,
  },
  {
    id: 3,
    name: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face',
    rating: 4.7,
    price: 110,
    services: ['Gutter Cleaning'],
    location: 'Queens, NY',
    reviews: 76,
    verified: false,
  },
];

function renderStars(rating: number) {
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
}

export default function ServiceComparisonPage() {
  const [selected, setSelected] = useState<number[]>([1, 2]);

  const toggleTechnician = (id: number) => {
    setSelected(sel =>
      sel.includes(id) ? sel.filter(tid => tid !== id) : sel.length < 3 ? [...sel, id] : sel
    );
  };

  const compared = mockTechnicians.filter(t => selected.includes(t.id));

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-8 text-center">Compare Technicians</h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Select up to 3 technicians to compare their ratings, prices, services, and more side-by-side.
          </p>

          {/* Technician Selector */}
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            {mockTechnicians.map(tech => (
              <button
                key={tech.id}
                onClick={() => toggleTechnician(tech.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition font-medium ${selected.includes(tech.id) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
                disabled={selected.length >= 3 && !selected.includes(tech.id)}
              >
                <img src={tech.avatar} alt={tech.name} className="w-7 h-7 rounded-full object-cover border" />
                {tech.name}
                {selected.includes(tech.id) && <span className="ml-1">✓</span>}
              </button>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Attribute</th>
                  {compared.map(tech => (
                    <th key={tech.id} className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                      <div className="flex flex-col items-center">
                        <img src={tech.avatar} alt={tech.name} className="w-12 h-12 rounded-full object-cover border mb-2" />
                        <span>{tech.name}</span>
                        {tech.verified && <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-1">✓ Verified</span>}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-700">Rating</td>
                  {compared.map(tech => (
                    <td key={tech.id} className="px-4 py-2 text-center text-yellow-500 text-lg">{renderStars(tech.rating)} <span className="text-gray-700 text-base">{tech.rating}</span></td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-700">Price</td>
                  {compared.map(tech => (
                    <td key={tech.id} className="px-4 py-2 text-center text-green-700 font-semibold">${tech.price}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-700">Services</td>
                  {compared.map(tech => (
                    <td key={tech.id} className="px-4 py-2 text-center text-gray-700">
                      {tech.services.join(', ')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-700">Location</td>
                  {compared.map(tech => (
                    <td key={tech.id} className="px-4 py-2 text-center text-gray-700">{tech.location}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-700">Reviews</td>
                  {compared.map(tech => (
                    <td key={tech.id} className="px-4 py-2 text-center text-blue-700 font-semibold">{tech.reviews}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-700">Actions</td>
                  {compared.map(tech => (
                    <td key={tech.id} className="px-4 py-2 text-center">
                      <a href={`/technician-profile?id=${tech.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition mr-2">View Profile</a>
                      <a href={`/booking?technician=${tech.id}`} className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition">Book Now</a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
} 