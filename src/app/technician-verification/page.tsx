"use client";
import { useState } from 'react';

const mockDocs = [
  {
    id: 1,
    type: 'Government ID',
    status: 'verified',
    fileName: 'id_front.jpg',
    uploadedAt: '2024-06-01',
  },
  {
    id: 2,
    type: 'Insurance',
    status: 'pending',
    fileName: 'insurance_policy.pdf',
    uploadedAt: '2024-07-01',
  },
  {
    id: 3,
    type: 'Trade License',
    status: 'not_uploaded',
    fileName: '',
    uploadedAt: '',
  },
];

const statusColors = {
  verified: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
  not_uploaded: 'bg-gray-100 text-gray-500',
};

export default function TechnicianVerificationPage() {
  const [docs, setDocs] = useState(mockDocs);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileChange = (docId: number, file: File | null) => {
    if (!file) return;
    setUploadingId(docId);
    setTimeout(() => {
      setDocs(prev =>
        prev.map(doc =>
          doc.id === docId
            ? {
                ...doc,
                fileName: file.name,
                status: 'pending',
                uploadedAt: new Date().toISOString().split('T')[0],
              }
            : doc
        )
      );
      setUploadingId(null);
      setSuccessMsg('Document uploaded successfully!');
      setTimeout(() => setSuccessMsg(''), 2000);
    }, 1200);
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Document Upload & Verification</h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Upload your documents for verification. This helps build trust and unlocks more jobs.
          </p>

          {successMsg && (
            <div className="mb-6 text-center">
              <span className="text-green-600 font-semibold">{successMsg}</span>
            </div>
          )}

          <div className="space-y-8">
            {docs.map(doc => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-900 mb-1">{doc.type}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[doc.status as keyof typeof statusColors]}`}>{
                      doc.status === 'not_uploaded'
                        ? 'Not Uploaded'
                        : doc.status.charAt(0).toUpperCase() + doc.status.slice(1)
                    }</span>
                    {doc.fileName && <span className="text-gray-500 text-xs">{doc.fileName}</span>}
                    {doc.uploadedAt && <span className="text-gray-400 text-xs">{doc.uploadedAt}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:items-end">
                  <label className="block">
                    <span className="sr-only">Upload {doc.type}</span>
                    <input
                      type="file"
                      accept={doc.type === 'Government ID' ? 'image/*,application/pdf' : 'application/pdf,image/*'}
                      disabled={uploadingId === doc.id}
                      onChange={e => handleFileChange(doc.id, e.target.files ? e.target.files[0] : null)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </label>
                  {uploadingId === doc.id && <span className="text-blue-600 text-xs mt-1">Uploading...</span>}
                  {doc.status === 'rejected' && <span className="text-red-600 text-xs mt-1">Document rejected. Please re-upload.</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center text-gray-500 text-sm">
            <p>All documents are reviewed within 1-2 business days. You'll be notified of your verification status by email.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 