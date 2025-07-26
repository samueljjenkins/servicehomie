"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { 
  getUserProfile, 
  createUserProfile,
  getAllVerificationDocuments,
  updateVerificationDocument,
  UserProfile,
  VerificationDocument
} from '@/lib/supabase-utils';

export default function AdminVerificationPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verifications, setVerifications] = useState<VerificationDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<VerificationDocument | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) {
      // Load verification data from Supabase
      async function loadVerifications() {
        try {
          setLoading(true);
          
          // Ensure user has admin profile
          if (user) {
            let profile = await getUserProfile(user.id);
            if (!profile) {
              profile = await createUserProfile(user as any, 'admin');
            }
          }
          
          const docs = await getAllVerificationDocuments();
          setVerifications(docs);
        } catch (error) {
          console.error('Error loading verifications:', error);
        } finally {
          setLoading(false);
        }
      }
      
      loadVerifications();
    }
  }, [isSignedIn, user]);

  const filteredVerifications = verifications.filter(verification => 
    filter === 'all' || verification.status === filter
  );

  const handleReview = async (document: VerificationDocument, status: 'approved' | 'rejected') => {
    try {
      // Update the document status in Supabase
      await updateVerificationDocument(document.id, {
        status,
        review_notes: reviewNotes || undefined
      });
      
      // Update local state
      setVerifications(prev => prev.map(v => 
        v.id === document.id 
          ? { ...v, status, review_notes: reviewNotes || undefined }
          : v
      ));
      
      setReviewNotes("");
    } catch (error) {
      console.error('Error updating verification:', error);
      alert('Error updating verification status. Please try again.');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">Verification Management</h1>
              <p className="text-gray-600">Review and approve technician documents</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">⏳</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Review</p>
                <p className="text-2xl font-bold text-blue-600">
                  {verifications.filter(v => v.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-bold text-blue-600">
                  {verifications.filter(v => v.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 font-bold">✗</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-2xl font-bold text-blue-600">
                  {verifications.filter(v => v.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">📋</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold text-blue-600">{verifications.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-6">
          <div className="flex space-x-4">
            {[
              { key: 'all', label: 'All Documents', count: verifications.length },
              { key: 'pending', label: 'Pending', count: verifications.filter(v => v.status === 'pending').length },
              { key: 'approved', label: 'Approved', count: verifications.filter(v => v.status === 'approved').length },
              { key: 'rejected', label: 'Rejected', count: verifications.filter(v => v.status === 'rejected').length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Verification List */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100">
          <div className="px-6 py-4 border-b border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900">Document Reviews</h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading verifications...</p>
            </div>
          ) : filteredVerifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No documents found for the selected filter.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredVerifications.map((verification) => (
                <div key={verification.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900">Document ID: {verification.id}</h4>
                          <p className="text-sm text-gray-600">{verification.document_type}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          <p>File: {verification.file_name}</p>
                          <p>Uploaded: {new Date(verification.uploaded_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {verification.review_notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Notes:</span> {verification.review_notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        verification.status === 'approved' ? 'bg-green-100 text-green-800' :
                        verification.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {verification.status}
                      </span>
                      
                      {verification.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleReview(verification, 'approved')}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReview(verification, 'rejected')}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 