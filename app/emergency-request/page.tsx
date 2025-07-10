"use client";
import { useState } from 'react';

const emergencyTypes = [
  'Water Leak',
  'Power Outage',
  'Broken Window',
  'Flooding',
  'Heating/Cooling Failure',
  'Other',
];

export default function EmergencyRequestPage() {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-red-600 mb-4 text-center">Emergency Service Request</h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            For urgent home issues, submit a request and a technician will contact you as soon as possible.
          </p>

          {submitted ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🚨</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Request Submitted!</h2>
              <p className="text-gray-700 mb-4">A technician will reach out to you shortly. For immediate danger, please call 911.</p>
              <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">Return to Home</a>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type of Emergency</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option value="">Select an emergency type</option>
                  {emergencyTypes.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Describe the emergency in detail..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full"
                />
                {photo && <p className="text-green-600 text-sm mt-2">Photo selected: {photo.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
                <input
                  type="text"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  required
                  placeholder="Your phone or email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  required
                  placeholder="123 Main St, City, ZIP"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white font-semibold py-3 rounded-md hover:bg-red-700 transition"
              >
                Submit Emergency Request
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
} 