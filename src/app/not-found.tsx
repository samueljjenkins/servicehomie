"use client";
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="py-32 bg-gray-50 min-h-[80vh] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-12 max-w-lg w-full text-center">
        <h1 className="text-7xl font-extrabold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">Sorry, the page you are looking for does not exist or has been moved.</p>
        <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition">Go to Homepage</Link>
      </div>
    </section>
  );
} 