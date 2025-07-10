"use client";
import { useState } from 'react';
import Link from 'next/link';

const helpCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    description: 'Learn how to get started with Service Homie',
    articles: [
      { id: 1, title: 'How to create an account', url: '/help/account-creation' },
      { id: 2, title: 'Setting up your profile', url: '/help/profile-setup' },
      { id: 3, title: 'Understanding the platform', url: '/help/platform-overview' },
    ],
  },
  {
    id: 'booking',
    title: 'Booking Services',
    icon: '📅',
    description: 'Everything about booking and managing services',
    articles: [
      { id: 4, title: 'How to book a service', url: '/help/book-service' },
      { id: 5, title: 'Rescheduling or cancelling bookings', url: '/help/manage-bookings' },
      { id: 6, title: 'Payment methods and billing', url: '/help/payment-billing' },
    ],
  },
  {
    id: 'technician',
    title: 'For Technicians',
    icon: '🔧',
    description: 'Resources for service providers',
    articles: [
      { id: 7, title: 'Setting up your service areas', url: '/help/service-areas' },
      { id: 8, title: 'Managing your availability', url: '/help/availability' },
      { id: 9, title: 'Getting paid and withdrawals', url: '/help/payments' },
    ],
  },
  {
    id: 'safety',
    title: 'Safety & Trust',
    icon: '🛡️',
    description: 'Safety guidelines and trust features',
    articles: [
      { id: 10, title: 'Safety guidelines for services', url: '/help/safety-guidelines' },
      { id: 11, title: 'Verification and background checks', url: '/help/verification' },
      { id: 12, title: 'Insurance and liability', url: '/help/insurance' },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: '🔍',
    description: 'Common issues and solutions',
    articles: [
      { id: 13, title: 'Login and account issues', url: '/help/login-issues' },
      { id: 14, title: 'Payment problems', url: '/help/payment-issues' },
      { id: 15, title: 'Service quality concerns', url: '/help/quality-issues' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact Support',
    icon: '📞',
    description: 'Get in touch with our support team',
    articles: [
      { id: 16, title: 'Live chat support', url: '/help/live-chat' },
      { id: 17, title: 'Email support', url: '/help/email-support' },
      { id: 18, title: 'Phone support', url: '/help/phone-support' },
    ],
  },
];

const popularArticles = [
  {
    id: 1,
    title: 'How to book a service',
    category: 'Booking Services',
    views: 15420,
  },
  {
    id: 2,
    title: 'Setting up your service areas',
    category: 'For Technicians',
    views: 8920,
  },
  {
    id: 3,
    title: 'Payment methods and billing',
    category: 'Booking Services',
    views: 7650,
  },
  {
    id: 4,
    title: 'Safety guidelines for services',
    category: 'Safety & Trust',
    views: 6540,
  },
  {
    id: 5,
    title: 'Rescheduling or cancelling bookings',
    category: 'Booking Services',
    views: 5430,
  },
];

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = helpCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.articles.some(article => article.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedCategoryData = selectedCategory 
    ? helpCategories.find(cat => cat.id === selectedCategory)
    : null;

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to your questions and get the support you need
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              🔍
            </button>
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.map(article => (
              <div key={article.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                  <span className="text-xs text-gray-500">{article.views.toLocaleString()} views</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{article.category}</p>
                <Link
                  href={`/help/${article.id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Read Article →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map(category => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="text-3xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="space-y-2">
                  {category.articles.slice(0, 3).map(article => (
                    <div key={article.id} className="text-sm text-gray-600">
                      • {article.title}
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All Articles →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Category Detail Modal */}
        {selectedCategoryData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedCategoryData.icon}</span>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCategoryData.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">{selectedCategoryData.description}</p>
              
              <div className="space-y-4">
                {selectedCategoryData.articles.map(article => (
                  <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                    <Link
                      href={article.url}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600"
                    >
                      {article.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact Support */}
        <div className="bg-blue-600 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Still Need Help?</h3>
          <p className="text-blue-100 mb-6">
            Our support team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="bg-blue-700 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800 transition"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 