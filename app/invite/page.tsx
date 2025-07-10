"use client";
import { useState } from 'react';

const mockReferralLink = 'https://servicehomie.com/invite?ref=USER123';
const mockRewards = [
  {
    id: 1,
    title: 'Give $20, Get $20',
    description: 'Invite a friend and you both get $20 off your next service when they book for the first time.',
    icon: '🎁',
  },
  {
    id: 2,
    title: 'Unlimited Referrals',
    description: 'There\'s no limit to how many friends you can invite or how many rewards you can earn!',
    icon: '🔗',
  },
  {
    id: 3,
    title: 'Track Your Rewards',
    description: 'See the status of your invites and rewards in your dashboard.',
    icon: '📈',
  },
];

export default function InvitePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(mockReferralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-4 text-center">Invite Friends & Earn Rewards</h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Share your referral link and earn rewards when your friends book their first service!
          </p>

          {/* Referral Link */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <input
              type="text"
              value={mockReferralLink}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-gray-50"
            />
            <button
              onClick={handleCopy}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          {/* Share Options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href={`mailto:?subject=Join me on Service Homie!&body=Sign up and get $20 off your first service: ${mockReferralLink}`}
              className="bg-blue-100 text-blue-700 px-6 py-2 rounded-md font-medium hover:bg-blue-200 transition text-center"
            >
              Share via Email
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=Sign up for Service Homie and get $20 off your first service! ${mockReferralLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-100 text-blue-700 px-6 py-2 rounded-md font-medium hover:bg-blue-200 transition text-center"
            >
              Share on Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(mockReferralLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-100 text-blue-700 px-6 py-2 rounded-md font-medium hover:bg-blue-200 transition text-center"
            >
              Share on Facebook
            </a>
          </div>

          {/* Rewards Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {mockRewards.map(reward => (
                <div key={reward.id} className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-3xl mb-3">{reward.icon}</div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">{reward.title}</h3>
                  <p className="text-gray-700 text-sm">{reward.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Track Rewards CTA */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-2">Want to see your invite status and rewards?</p>
            <a
              href="/homeowner-dashboard"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Go to Dashboard →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 