"use client";
import { useState } from 'react';

const mockSettings = {
  email: 'jane.doe@email.com',
  password: '',
  notifications: {
    email: true,
    sms: false,
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === 'email' || name === 'password') {
      setSettings({ ...settings, [name]: value });
    } else {
      setSettings({
        ...settings,
        notifications: {
          ...settings.notifications,
          [name]: type === 'checkbox' ? checked : value,
        },
      });
    }
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">User Settings</h1>
          {saved && (
            <div className="mb-6 text-center">
              <span className="text-green-600 font-semibold">Settings saved successfully!</span>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">New Password</label>
              <input
                type="password"
                name="password"
                value={settings.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Notification Preferences</label>
              <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="email"
                    checked={settings.notifications.email}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  <span className="text-gray-700">Email</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="sms"
                    checked={settings.notifications.sms}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  <span className="text-gray-700">SMS</span>
                </label>
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition">Save Settings</button>
          </form>
        </div>
      </div>
    </section>
  );
} 