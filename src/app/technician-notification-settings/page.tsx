"use client";
import { useState } from 'react';

const notificationTypes = [
  {
    id: 'new_job',
    title: 'New Job Requests',
    description: 'Get notified when homeowners request your services',
    category: 'jobs',
    email: true,
    sms: true,
    push: true,
  },
  {
    id: 'job_confirmed',
    title: 'Job Confirmations',
    description: 'Notifications when homeowners confirm your booking',
    category: 'jobs',
    email: true,
    sms: false,
    push: true,
  },
  {
    id: 'job_reminder',
    title: 'Job Reminders',
    description: 'Reminders about upcoming jobs (24h and 1h before)',
    category: 'jobs',
    email: true,
    sms: true,
    push: true,
  },
  {
    id: 'job_cancelled',
    title: 'Job Cancellations',
    description: 'When homeowners cancel or reschedule jobs',
    category: 'jobs',
    email: true,
    sms: true,
    push: true,
  },
  {
    id: 'new_message',
    title: 'New Messages',
    description: 'When homeowners send you messages',
    category: 'communication',
    email: true,
    sms: false,
    push: true,
  },
  {
    id: 'new_review',
    title: 'New Reviews',
    description: 'When homeowners leave reviews for your services',
    category: 'reviews',
    email: true,
    sms: false,
    push: true,
  },
  {
    id: 'payment_received',
    title: 'Payment Received',
    description: 'Confirmations when payments are processed',
    category: 'payments',
    email: true,
    sms: true,
    push: false,
  },
  {
    id: 'weekly_summary',
    title: 'Weekly Summary',
    description: 'Weekly report of your earnings and job statistics',
    category: 'reports',
    email: true,
    sms: false,
    push: false,
  },
  {
    id: 'platform_updates',
    title: 'Platform Updates',
    description: 'Important updates about Service Homie features',
    category: 'system',
    email: true,
    sms: false,
    push: false,
  },
];

const frequencyOptions = [
  { value: 'immediate', label: 'Immediate' },
  { value: 'hourly', label: 'Hourly Digest' },
  { value: 'daily', label: 'Daily Digest' },
  { value: 'weekly', label: 'Weekly Digest' },
];

export default function TechnicianNotificationSettingsPage() {
  const [notifications, setNotifications] = useState(notificationTypes);
  const [emailFrequency, setEmailFrequency] = useState('immediate');
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [quietHours, setQuietHours] = useState({ enabled: false, start: '22:00', end: '08:00' });

  const handleNotificationChange = (id: string, type: 'email' | 'sms' | 'push', enabled: boolean) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, [type]: enabled }
          : notification
      )
    );
  };

  const handleSave = () => {
    // Mock save functionality
    console.log('Saving notification settings:', {
      notifications,
      emailFrequency,
      smsEnabled,
      pushEnabled,
      quietHours,
    });
    // In a real app, this would make an API call
    alert('Notification settings saved successfully!');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'jobs':
        return '📅';
      case 'communication':
        return '💬';
      case 'reviews':
        return '⭐';
      case 'payments':
        return '💰';
      case 'reports':
        return '📊';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  const groupedNotifications = notifications.reduce((acc, notification) => {
    if (!acc[notification.category]) {
      acc[notification.category] = [];
    }
    acc[notification.category].push(notification);
    return acc;
  }, {} as Record<string, typeof notifications>);

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-8">Notification Settings</h1>
          <p className="text-lg text-gray-600 mb-8">
            Customize how you receive notifications about jobs, messages, and platform updates.
          </p>

          {/* Global Settings */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Global Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Notification Frequency
                </label>
                <select
                  value={emailFrequency}
                  onChange={(e) => setEmailFrequency(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {frequencyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiet Hours
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={quietHours.enabled}
                      onChange={(e) => setQuietHours(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable</span>
                  </label>
                  {quietHours.enabled && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={quietHours.start}
                        onChange={(e) => setQuietHours(prev => ({ ...prev, start: e.target.value }))}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                      <span className="text-sm text-gray-500">to</span>
                      <input
                        type="time"
                        value={quietHours.end}
                        onChange={(e) => setQuietHours(prev => ({ ...prev, end: e.target.value }))}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={smsEnabled}
                  onChange={(e) => setSmsEnabled(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">SMS Notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={pushEnabled}
                  onChange={(e) => setPushEnabled(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Push Notifications</span>
              </label>
            </div>
          </div>

          {/* Notification Categories */}
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([category, categoryNotifications]) => (
              <div key={category} className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="mr-2">{getCategoryIcon(category)}</span>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h3>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {categoryNotifications.map((notification) => (
                    <div key={notification.id} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{notification.description}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4 ml-6">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notification.email}
                              onChange={(e) => handleNotificationChange(notification.id, 'email', e.target.checked)}
                              disabled={!smsEnabled && !pushEnabled && !notification.email}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-xs text-gray-600">Email</span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notification.sms}
                              onChange={(e) => handleNotificationChange(notification.id, 'sms', e.target.checked)}
                              disabled={!smsEnabled}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-xs text-gray-600">SMS</span>
                          </label>
                          
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={notification.push}
                              onChange={(e) => handleNotificationChange(notification.id, 'push', e.target.checked)}
                              disabled={!pushEnabled}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-xs text-gray-600">Push</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Enable SMS for critical notifications like job confirmations and cancellations</li>
              <li>• Use quiet hours to avoid notifications during your preferred sleep time</li>
              <li>• Daily digest emails are great for staying organized without constant interruptions</li>
              <li>• Push notifications work best for immediate job alerts and messages</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
} 