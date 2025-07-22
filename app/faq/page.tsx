"use client";

const faqs = [
  {
    question: 'How do I create my technician landing page?',
    answer: 'Simply sign up as a technician and you\'ll be able to customize your professional landing page with your services, pricing, and contact information.'
  },
  {
    question: 'How do I get paid for my services?',
    answer: 'Once a customer books through your landing page, you\'ll receive payment directly to your account. We take a small 15% fee for processing.'
  },
  {
    question: 'Can I customize my landing page?',
    answer: 'Yes! You can edit your landing page anytime from your dashboard. Add your services, pricing, photos, and contact information.'
  },
  {
    question: 'How do customers find my landing page?',
    answer: 'You can share your unique landing page URL on social media, business cards, or anywhere you promote your services.'
  },
  {
    question: 'What services can I offer?',
    answer: 'You can offer any home service you specialize in - window cleaning, pressure washing, gutter cleaning, handyman services, and more.'
  },
  {
    question: 'Is there a monthly fee?',
    answer: 'No monthly fees! You only pay a small percentage when you get booked through the platform.'
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">Everything you need to know about creating your professional landing page</p>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a href="/contact" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
} 