"use client";
import { useState } from 'react';

export default function ResetPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Reset Your Password</h1>
          <p className="text-gray-600 mb-8 text-center">Enter your email address and we'll send you a link to reset your password.</p>
          {submitted ? (
            <div className="text-center py-12">
              <span className="text-5xl block mb-4">📧</span>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Check Your Email</h2>
              <p className="text-gray-700">If an account exists for that email, you'll receive a password reset link shortly.</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input type="email" required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition">Send Reset Link</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
} 