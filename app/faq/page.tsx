"use client";

const faqs = [
  {
    question: 'How much does Service Homie cost?',
    answer: 'Service Homie costs $19/month for our Starter Plan. This includes everything you need: a professional landing page, Calendly integration, Google Reviews display, custom URL, and mobile-responsive design. No setup fees, no hidden charges.'
  },
  {
    question: 'What\'s included in the $19/month plan?',
    answer: 'Your $19/month includes: Professional landing page with custom URL (servicehomie.com/yourname), Calendly booking integration, Google Reviews display, mobile-responsive design, profile photo upload, and the ability to handle your own payments with 0% commission.'
  },
  {
    question: 'How do I get paid for my services?',
    answer: 'You handle payments directly with your customers. Service Homie doesn\'t take any commission on your bookings. You keep 100% of what you charge. You can use your own payment methods like cash, check, or your preferred payment processor.'
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes! You can cancel your $19/month subscription at any time. There are no long-term contracts or cancellation fees. If you cancel, your landing page will remain active until the end of your current billing period.'
  },
  {
    question: 'How do I create my custom landing page?',
    answer: 'Sign up for the $19/month plan, then customize your page from your dashboard. Add your business name, services, pricing, photos, and connect your Calendly. Your page goes live instantly at servicehomie.com/yourname.'
  },
  {
    question: 'What makes Service Homie different from other website builders?',
    answer: 'Service Homie is built specifically for service professionals. Unlike generic website builders, we include Calendly integration, Google Reviews display, and are designed for mobile-first booking. Plus, we don\'t take commission on your earnings like other platforms.'
  },
  {
    question: 'Do I need technical skills to use Service Homie?',
    answer: 'No technical skills required! Our platform is designed to be simple and user-friendly. You can set up your landing page in minutes using our easy customization dashboard. No coding or design experience needed.'
  },
  {
    question: 'Can I update my services and pricing anytime?',
    answer: 'Absolutely! You can update your services, pricing, photos, and business information anytime from your dashboard. Changes are reflected on your landing page immediately.'
  },
  {
    question: 'How do customers book appointments?',
    answer: 'Customers visit your landing page and click the booking button, which connects to your Calendly calendar. They can see your availability and book appointments directly. You\'ll receive notifications for new bookings.'
  },
  {
    question: 'What if I don\'t have a Calendly account?',
    answer: 'You can easily create a free Calendly account and connect it to your Service Homie landing page. Calendly is free to use and helps you manage your schedule and bookings efficiently.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with Service Homie within 30 days, we\'ll give you a full refund. No questions asked.'
  },
  {
    question: 'Can I use my own domain name?',
    answer: 'Currently, we provide custom URLs in the format servicehomie.com/yourname. This is included in your $19/month plan and gives you a professional, memorable web address for your business.'
  },
  {
    question: 'What services can I offer on my landing page?',
    answer: 'You can offer any home service you specialize in: window cleaning, pressure washing, gutter cleaning, handyman services, lawn care, plumbing, electrical work, and more. You have full control over your services and pricing.'
  },
  {
    question: 'How do I get Google Reviews to show on my page?',
    answer: 'You\'ll need to provide your Google Business Place ID during setup. This allows us to display your existing Google Reviews on your landing page, helping build trust with potential customers.'
  },
  {
    question: 'What happens if I miss a payment?',
    answer: 'If your payment fails, we\'ll notify you and give you time to update your payment method. Your landing page will remain active during this period. We want to help you succeed, not penalize you for payment issues.'
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white text-4xl">❓</span>
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl mb-6">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about Service Homie's $19/month plan and how to create your professional landing page.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-xl mb-8 opacity-90">
              Our team is here to help you get started with your professional landing page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Contact Support
              </a>
              <a 
                href="/technician-signup" 
                className="inline-block bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-400 transition-colors shadow-lg"
              >
                Start Your $19/month Plan
              </a>
            </div>
            <p className="text-sm opacity-75 mt-6">30-day money-back guarantee • Cancel anytime • No setup fees</p>
          </div>
        </div>
      </section>
    </div>
  );
} 