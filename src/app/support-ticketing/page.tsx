"use client";
import { useState } from 'react';

const mockTickets = [
  {
    id: 1,
    subject: 'Issue with booking confirmation',
    status: 'Open',
    created: '2024-07-01',
    lastUpdate: '2024-07-02',
    messages: [
      { sender: 'user', text: 'I did not receive a confirmation email.', date: '2024-07-01' },
      { sender: 'support', text: 'We are looking into this for you.', date: '2024-07-02' },
    ],
  },
  {
    id: 2,
    subject: 'Payment not processed',
    status: 'Closed',
    created: '2024-06-28',
    lastUpdate: '2024-06-29',
    messages: [
      { sender: 'user', text: 'My payment did not go through.', date: '2024-06-28' },
      { sender: 'support', text: 'Payment issue resolved. Please try again.', date: '2024-06-29' },
    ],
  },
];

const statusColors = {
  Open: 'bg-yellow-100 text-yellow-800',
  Closed: 'bg-green-100 text-green-800',
  Pending: 'bg-blue-100 text-blue-800',
};

export default function SupportTicketingPage() {
  const [tickets, setTickets] = useState(mockTickets);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    const newTicket = {
      id: tickets.length + 1,
      subject,
      status: 'Open',
      created: new Date().toISOString().slice(0, 10),
      lastUpdate: new Date().toISOString().slice(0, 10),
      messages: [
        { sender: 'user', text: message, date: new Date().toISOString().slice(0, 10) },
      ],
    };
    setTickets([newTicket, ...tickets]);
    setShowForm(false);
    setSubject('');
    setMessage('');
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-8">Support Ticketing</h1>
          <p className="text-lg text-gray-600 mb-8">
            Submit a new support ticket or track the status of your existing requests.
          </p>

          <div className="mb-8 flex justify-end">
            <button
              onClick={() => setShowForm((v) => !v)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              {showForm ? 'Cancel' : 'New Ticket'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Submit a Ticket</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Tickets</h2>
          <div className="space-y-4">
            {tickets.length === 0 && (
              <div className="text-gray-500 text-center py-8">No support tickets found.</div>
            )}
            {tickets.map((ticket) => (
              <div key={ticket.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                    <div className="text-sm text-gray-500">Created: {ticket.created}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${(statusColors as any)[ticket.status] || 'bg-gray-100 text-gray-800'}`}>{ticket.status}</span>
                </div>
                <div className="text-sm text-gray-500 mb-2">Last update: {ticket.lastUpdate}</div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600 hover:underline text-sm">View Messages</summary>
                  <div className="mt-2 space-y-2">
                    {ticket.messages.map((msg, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className={`font-bold ${msg.sender === 'support' ? 'text-blue-600' : 'text-gray-900'}`}>{msg.sender === 'support' ? 'Support' : 'You'}:</span>
                        <span className="text-gray-700">{msg.text}</span>
                        <span className="ml-auto text-xs text-gray-400">{msg.date}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 