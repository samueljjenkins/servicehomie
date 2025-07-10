"use client";
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Contact Us</h1>
          <p className="text-gray-600 mb-8 text-center">Have a question, issue, or business inquiry? Fill out the form below and our team will get back to you soon.</p>
          {submitted ? (
            <div className="text-center py-12">
              <span className="text-5xl block mb-4">📬</span>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Message Sent!</h2>
              <p className="text-gray-700">Thank you for reaching out. We'll be in touch soon.</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                <input type="text" required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input type="email" required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Subject</label>
                <input type="text" required className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Message</label>
                <textarea required rows={5} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
} 