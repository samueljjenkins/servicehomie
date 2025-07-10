"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { createJob } from "@/lib/supabase-utils";

const SERVICE_OPTIONS = [
  "Window Cleaning",
  "Pressure Washing",
  "Gutter Cleaning",
];

export default function TechnicianNewJob() {
  const [form, setForm] = useState({
    service: "",
    price: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { profile, loading } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (!profile) throw new Error("Could not determine technician profile.");
      await createJob({
        technician_id: Number(profile.id), // ensure numeric id
        service: form.service,
        price: Number(form.price),
        description: form.description,
      });
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => router.push("/technician-dashboard"), 1500);
    } catch (err: any) {
      setSubmitting(false);
      setError(err.message || "Failed to create job. Please try again.");
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 min-h-[80vh] flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Create New Job</h1>
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        {success ? (
          <div className="text-center">
            <p className="text-green-600 text-lg font-semibold mb-2">Job created successfully!</p>
            <p className="text-gray-500">Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Service</label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="" disabled>
                  Select a service
                </option>
                {SERVICE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Price ($)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 100"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the job details..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md shadow hover:bg-blue-700 transition disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Job"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
} 