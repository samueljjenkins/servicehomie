"use client";

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Define a type for the application data for better type-checking
interface TechnicianApplication {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  service_category: string;
  status: string;
  created_at: string;
  gov_id_url: string;
  insurance_proof_url: string;
  work_photos_urls: string[];
  service_area_zip_codes: string;
  experience_description: string;
  business_license_url: string;
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<TechnicianApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null); // To show loading state on buttons
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null); // For modal image preview
  const [lightboxPhotos, setLightboxPhotos] = useState<string[] | null>(null); // For modal image preview
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data, error } = await supabase
          .from('technician_applications')
          .select('*');
        console.log('Raw data from Supabase:', data, error);
        if (data && data.length > 0) {
          for (const row of data) {
            console.log('Row keys:', Object.keys(row));
          }
        }
        if (error) throw error;
        setApplications(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [supabase]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    const { error } = await supabase
      .from('technician_applications')
      .update({ status: 'approved' })
      .eq('id', id);
    if (error) {
      alert(`Error approving technician: ${error.message}`);
    } else {
      setApplications(prev => prev.filter(app => app.id !== id));
    }
    setProcessingId(null);
  };

  const handleDeny = async (id: string) => {
    if (!window.confirm("Are you sure you want to deny and delete this application? This cannot be undone.")) {
      return;
    }
    setProcessingId(id);
    const { error } = await supabase
      .from('technician_applications')
      .update({ status: 'denied' })
      .eq('id', id);
    if (error) {
      alert(`Error denying technician: ${error.message}`);
    } else {
      setApplications(prev => prev.filter(app => app.id !== id));
    }
    setProcessingId(null);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 min-h-screen flex justify-center items-center">
        <p className="text-lg text-gray-600">Loading applications...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50 min-h-screen flex justify-center items-center">
        <p className="text-lg text-red-600">Error loading applications: {error}</p>
      </section>
    );
  }

  if (applications.length === 0) {
    return (
      <section className="py-20 bg-gray-50 min-h-screen flex justify-center items-center">
        <div>
          <p className="text-lg text-gray-600 mb-4">No pending applications.</p>
          <p className="text-xs text-gray-400 mb-4">If you expect to see applications, check your RLS policy and user_type.</p>
          {/* Show raw data for debugging */}
          <pre style={{ background: '#f3f3f3', padding: '1em', borderRadius: '8px', maxWidth: 600, overflowX: 'auto' }}>
            {JSON.stringify(applications, null, 2)}
          </pre>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-8">Technician Applications</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {applications.length > 0 ? (
              applications.map((app) => (
                <div key={app.id} className="p-6 mb-6 bg-white rounded-xl shadow border border-gray-200">
                  {/* Header: Name and Status */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 border-b pb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-blue-700">{app.full_name}</div>
                      <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">{app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Pending'}</span>
                    </div>
                    <div className="flex gap-3 mt-2 md:mt-0">
                      <button 
                        onClick={() => handleApprove(app.id)}
                        disabled={processingId === app.id}
                        className="bg-green-500 text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-green-600 transition-colors disabled:bg-gray-400"
                      >
                        {processingId === app.id ? 'Approving...' : 'Approve'}
                      </button>
                      <button 
                        onClick={() => handleDeny(app.id)}
                        disabled={processingId === app.id}
                        className="bg-red-500 text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-red-600 transition-colors disabled:bg-gray-400"
                      >
                        {processingId === app.id ? 'Denying...' : 'Deny'}
                      </button>
                    </div>
                  </div>

                  {/* Info Sections - restored as requested */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    {/* Contact Info */}
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">Contact</div>
                      <div className="text-gray-700 mb-1"><span className="font-semibold">Email:</span> {app.email}</div>
                      <div className="text-gray-700"><span className="font-semibold">Phone:</span> {app.phone_number}</div>
                    </div>
                    {/* Service Info */}
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">Service</div>
                      <div className="text-gray-700 mb-1"><span className="font-semibold">Category:</span> {app.service_category}</div>
                      <div className="text-gray-700 mb-1"><span className="font-semibold">Zip Codes:</span> {app.service_area_zip_codes}</div>
                      <div className="text-gray-700"><span className="font-semibold">Applied:</span> {new Date(app.created_at).toLocaleDateString()}</div>
                    </div>
                    {/* Experience */}
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-1">Experience</div>
                      <div className="text-gray-700 mb-1"><span className="font-semibold">Description:</span> {app.experience_description}</div>
                    </div>
                  </div>

                  {/* Documents */}
                  {/* Removed work photo thumbnails for now as requested */}
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No pending applications.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-2 right-2 bg-gray-200 rounded-full p-2 text-gray-700 hover:bg-gray-300 focus:outline-none"
              aria-label="Close preview"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Preview image or PDF */}
            {lightboxUrl.match(/\.(pdf)$/i) ? (
              <iframe src={lightboxUrl} title="Document Preview" className="w-full h-[70vh] rounded border" />
            ) : (
              <img src={lightboxUrl} alt="Preview" className="max-w-full max-h-[70vh] rounded shadow border mx-auto" />
            )}
          </div>
        </div>
      )}
      {/* Lightbox Modal for Work Photos */}
      {lightboxPhotos && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setLightboxPhotos(null)}
        >
          <div className="relative bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setLightboxPhotos(null)}
              className="absolute top-2 right-2 bg-gray-200 rounded-full p-2 text-gray-700 hover:bg-gray-300 focus:outline-none"
              aria-label="Close preview"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-wrap gap-4 justify-center">
              {lightboxPhotos.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Work Photo ${i+1}`}
                  className="max-w-xs max-h-80 rounded shadow border"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 