"use client";
import { useState } from 'react';

const mockPlans = [
  {
    id: 1,
    name: 'Weekly Clean',
    frequency: 'Every week',
    price: 99,
    services: ['Window Cleaning', 'Gutter Cleaning', 'Pressure Washing'],
    popular: true,
  },
  {
    id: 2,
    name: 'Biweekly Clean',
    frequency: 'Every 2 weeks',
    price: 59,
    services: ['Window Cleaning', 'Gutter Cleaning'],
    popular: false,
  },
  {
    id: 3,
    name: 'Monthly Clean',
    frequency: 'Every month',
    price: 39,
    services: ['Window Cleaning'],
    popular: false,
  },
];

const mockUserSubscription = {
  planId: 2,
  nextBilling: '2024-08-01',
  status: 'active',
};

export default function SubscriptionPage() {
  const [userSub, setUserSub] = useState(mockUserSubscription);
  const [subscribing, setSubscribing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubscribe = (planId: number) => {
    setSubscribing(true);
    setTimeout(() => {
      setUserSub({ planId, nextBilling: '2024-08-01', status: 'active' });
      setSuccessMsg('Subscription updated!');
      setSubscribing(false);
      setTimeout(() => setSuccessMsg(''), 2000);
    }, 1200);
  };

  const handleCancel = () => {
    setSubscribing(true);
    setTimeout(() => {
      setUserSub({ planId: 0, nextBilling: '', status: 'cancelled' });
      setSuccessMsg('Subscription cancelled.');
      setSubscribing(false);
      setTimeout(() => setSuccessMsg(''), 2000);
    }, 1200);
  };

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Subscription Plans</h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Save time and money with recurring home service plans. Choose the frequency that fits your needs.
          </p>

          {successMsg && (
            <div className="mb-6 text-center">
              <span className="text-green-600 font-semibold">{successMsg}</span>
            </div>
          )}

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {mockPlans.map(plan => {
              const isCurrent = userSub.planId === plan.id && userSub.status === 'active';
              return (
                <div key={plan.id} className={`rounded-lg border p-6 flex flex-col items-center shadow transition ${plan.popular ? 'border-blue-600' : 'border-gray-200'}`}>
                  {plan.popular && <div className="mb-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-semibold">Most Popular</div>}
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h2>
                  <div className="text-blue-600 text-3xl font-extrabold mb-2">${plan.price}<span className="text-base font-medium text-gray-500">/mo</span></div>
                  <div className="text-gray-500 mb-4">{plan.frequency}</div>
                  <ul className="mb-6 space-y-2">
                    {plan.services.map(service => (
                      <li key={service} className="flex items-center gap-2 text-gray-700">
                        <span className="text-green-500">✔</span> {service}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <button
                      className="w-full bg-green-600 text-white font-semibold py-2 rounded-md cursor-default mb-2"
                      disabled
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition mb-2"
                      disabled={subscribing}
                    >
                      {subscribing ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Manage Subscription */}
          {userSub.planId !== 0 && userSub.status === 'active' && (
            <div className="text-center mt-8">
              <div className="mb-2 text-gray-700">Next billing date: <span className="font-semibold">{userSub.nextBilling}</span></div>
              <button
                onClick={handleCancel}
                className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition"
                disabled={subscribing}
              >
                {subscribing ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 