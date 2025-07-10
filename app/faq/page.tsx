"use client";

const faqs = [
  {
    question: 'How do I book a service?',
    answer: 'Simply browse the marketplace, select a service and technician, and follow the booking steps to choose your date and time.'
  },
  {
    question: 'How do I become a technician?',
    answer: 'Click the "Become a Technician" button on the homepage and fill out the application form. We will review your application and contact you.'
  },
  {
    question: 'How do I pay for a service?',
    answer: 'After booking, you will be directed to the checkout page where you can securely enter your payment information.'
  },
  {
    question: 'Can I reschedule or cancel a booking?',
    answer: 'Yes, you can manage your bookings from your dashboard. Look for the reschedule or cancel options next to your upcoming jobs.'
  },
  {
    question: 'How are technicians vetted?',
    answer: 'All technicians undergo background checks and are reviewed by real customers to ensure quality and trust.'
  },
  {
    question: 'How do I leave a review?',
    answer: 'After your job is completed, you will receive a prompt to leave a review for your technician.'
  },
  {
    question: 'What if I have an issue with my service?',
    answer: 'Contact our support team through the Contact page or your dashboard, and we will help resolve any issues promptly.'
  },
];

export default function FAQPage() {
  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-8 text-center">Frequently Asked Questions</h1>
          <div className="space-y-8">
            {faqs.map((faq, idx) => (
              <div key={idx}>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{faq.question}</h2>
                <p className="text-gray-700 text-lg">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 