"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getTechnicianById, getReviewsByTechnician, getJobsByService } from "@/lib/supabase-utils";
import { Technician, Review, Job } from "@/types/database";

export default function TechnicianPublicProfile() {
  const searchParams = useSearchParams();
  const technicianId = Number(searchParams.get("id"));
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [jobsCompleted, setJobsCompleted] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (!technicianId) return;
        const tech = await getTechnicianById(technicianId);
        setTechnician(tech);
        const revs = await getReviewsByTechnician(technicianId);
        setReviews(revs);
        // Count jobs completed by this technician (mock: 12 if not available)
        // If you have a jobs table with status, filter for completed jobs
        setJobsCompleted(12); // Replace with real count if available
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [technicianId]);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 min-h-[80vh] flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </section>
    );
  }

  if (!technician) {
    // Show a mock technician profile if not found
    const mockTech = {
      name: "Alex Johnson",
      location: "Dallas, TX",
      description: "Experienced window cleaning professional with 8+ years in the industry. I take pride in delivering streak-free, sparkling windows for every client. Reliable, friendly, and always on time!",
      rating: 4.8,
      reviews: 23,
    };
    const mockReviews = [
      { id: 1, rating: 5, comment: "Alex did an amazing job! My windows have never looked better." },
      { id: 2, rating: 4, comment: "Very professional and quick service." },
      { id: 3, rating: 5, comment: "Highly recommend Alex for any window cleaning needs." },
    ];
    return (
      <section className="py-20 bg-gray-50 min-h-[80vh] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-400 overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mockTech.name}`} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-blue-700 mb-2">{mockTech.name}</h1>
              <p className="text-gray-600 mb-1">Location: {mockTech.location}</p>
              <p className="text-gray-600 mb-1">Jobs Completed: <span className="font-semibold">12</span></p>
              <p className="text-gray-600 mb-1">Rating: <span className="text-yellow-500 font-semibold">{mockTech.rating} ★</span> ({mockTech.reviews} reviews)</p>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">About</h2>
            <p className="text-gray-700 whitespace-pre-line">{mockTech.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Reviews</h2>
            <ul className="divide-y divide-gray-200">
              {mockReviews.map((review) => (
                <li key={review.id} className="py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-blue-700">{review.rating}★</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-400 overflow-hidden">
            {/* Mock profile picture */}
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${technician.name}`} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">{technician.name}</h1>
            <p className="text-gray-600 mb-1">Location: {technician.location || "N/A"}</p>
            <p className="text-gray-600 mb-1">Jobs Completed: <span className="font-semibold">{jobsCompleted}</span></p>
            <p className="text-gray-600 mb-1">Rating: <span className="text-yellow-500 font-semibold">{technician.rating?.toFixed(1) || "0.0"} ★</span> ({technician.reviews} reviews)</p>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">About</h2>
          <p className="text-gray-700 whitespace-pre-line">{technician.description || "No description provided."}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <li key={review.id} className="py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-blue-700">{review.rating}★</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
} 