"use client";

const mockNotifications = [
  {
    date: '2024-07-10',
    items: [
      'Your window cleaning is scheduled for today at 10:00 AM.',
      'Technician Alice Johnson is on the way.',
    ],
  },
  {
    date: '2024-07-08',
    items: [
      'You received a new review from Jane Doe.',
      'Your payment for last week has been processed.',
    ],
  },
];

export default function NotificationsPage() {
  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Notifications</h1>
          {mockNotifications.length === 0 ? (
            <div className="text-center text-gray-500">No notifications yet.</div>
          ) : (
            <div className="space-y-8">
              {mockNotifications.map((group, idx) => (
                <div key={group.date}>
                  <div className="text-gray-500 font-semibold mb-2">{group.date}</div>
                  <ul className="space-y-2">
                    {group.items.map((item, i) => (
                      <li key={i} className="bg-blue-50 border-l-4 border-blue-400 rounded p-4 text-blue-900">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 