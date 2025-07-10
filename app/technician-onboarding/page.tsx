"use client";

import { useState } from "react";

const services = ["Window Cleaning", "Pressure Washing", "Gutter Cleaning"];

export default function TechnicianOnboardingPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [primaryService, setPrimaryService] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate all fields
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !primaryService.trim() ||
      !experience.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/onboard-technician", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          serviceCategory: primaryService,
          experienceDescription: experience,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Failed to onboard technician. Please try again.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setError(null);
      setFullName("");
      setEmail("");
      setPhone("");
      setPrimaryService("");
      setExperience("");
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Technician Onboarding
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="text-center text-green-600 font-semibold">
              Technician onboarded successfully! Invitation email sent.
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <InputField
                id="fullName"
                label="Full Name"
                type="text"
                value={fullName}
                setter={setFullName}
                required
              />
              <InputField
                id="email"
                label="Email Address"
                type="email"
                value={email}
                setter={setEmail}
                required
              />
              <InputField
                id="phone"
                label="Phone Number"
                type="tel"
                value={phone}
                setter={setPhone}
                required
              />
              <div>
                <label htmlFor="primaryService" className="block text-sm font-medium text-gray-700">
                  Primary Service
                </label>
                <select
                  id="primaryService"
                  value={primaryService}
                  onChange={(e) => setPrimaryService(e.target.value)}
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {services.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                  Short Description of Experience
                </label>
                <textarea
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  rows={3}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Onboard Technician"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function InputField({
  id,
  label,
  type,
  value,
  setter,
  required = false,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  setter: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={(e) => setter(e.target.value)}
          required={required}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>
  );
} 