"use client";
import { useState } from 'react';

const mockConversations = [
  { id: 1, name: 'Alice Johnson', lastMessage: 'See you at 10am!', unread: true },
  { id: 2, name: 'David Kim', lastMessage: 'Thanks for the payment!', unread: false },
  { id: 3, name: 'Grace White', lastMessage: 'Job completed!', unread: false },
];

type Message = { from: string; text: string };
const mockMessages: Record<number, Message[]> = {
  1: [
    { from: 'me', text: 'Looking forward to the window cleaning.' },
    { from: 'Alice Johnson', text: 'See you at 10am!' },
  ],
  2: [
    { from: 'me', text: 'Payment sent, thank you!' },
    { from: 'David Kim', text: 'Thanks for the payment!' },
  ],
  3: [
    { from: 'Grace White', text: 'Job completed!' },
    { from: 'me', text: 'Thank you!' },
  ],
};

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [input, setInput] = useState('');
  const messages = mockMessages[selectedId] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // For MVP, just clear the input
    setInput('');
  };

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-8 text-center">Messages</h1>
        <div className="bg-white rounded-lg shadow-lg flex min-h-[500px] overflow-hidden">
          {/* Conversations List */}
          <div className="w-1/3 border-r bg-gray-50 p-4 flex flex-col gap-2">
            {mockConversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`text-left rounded-lg px-3 py-2 transition font-medium ${selectedId === conv.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-50 text-gray-700'}`}
              >
                <div className="flex justify-between items-center">
                  <span>{conv.name}</span>
                  {conv.unread && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500" />}
                </div>
                <div className="text-xs text-gray-500 truncate">{conv.lastMessage}</div>
              </button>
            ))}
          </div>
          {/* Messages Panel */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
              {messages.map((msg: Message, idx: number) => (
                <div key={idx} className={`max-w-xs px-4 py-2 rounded-lg ${msg.from === 'me' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-gray-900 self-start'}`}>
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="p-4 border-t flex gap-2 bg-gray-50">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition">Send</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
} 