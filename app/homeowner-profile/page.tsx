"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function HomeownerProfilePage() {
  const { user, profile: userProfile, loading: userLoading, refreshProfile } = useUser();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!userLoading && user && userProfile) {
      setProfile({
        name: userProfile.full_name || '',
        email: user.email || '',
        phone: userProfile.phone || '',
      });
      setLoading(false);
    }
  }, [user, userProfile, userLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Here, you would update the user's profile in the database
    const { data, error } = await supabase
      .from('users')
      .update({ 
        full_name: profile.name,
        phone: profile.phone,
        // email updates are often handled separately via supabase.auth.updateUser
      })
      .eq('id', user.id);

    if (!error) {
      setSaved(true);
      await refreshProfile(); // Refresh the user context
    } else {
      console.error("Error updating profile:", error);
    }
  };

  if (loading || userLoading) {
    return (
      <section className="py-20 bg-gray-50 min-h-[80vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 min-h-[80vh]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Edit Profile</h1>
          {saved && (
            <div className="mb-6 text-center">
              <span className="text-green-600 font-semibold">Profile saved successfully!</span>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition">Save Profile</button>
          </form>
        </div>
      </div>
    </section>
  );
} 