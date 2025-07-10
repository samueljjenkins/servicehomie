"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const services = ["Window Cleaning", "Pressure Washing", "Gutter Cleaning", "Lawn Care", "Junk Removal", "Handyman"];

export default function TechnicianProfilePage() {
  const { user, profile: userProfile, loading: userLoading, refreshProfile } = useUser();
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    serviceCategory: '',
    experienceDescription: '',
    zipCodes: '',
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!userLoading && user && user.user_metadata) {
      setProfileData({
        fullName: user.user_metadata.full_name || '',
        phone: user.user_metadata.phone || '',
        serviceCategory: user.user_metadata.service_category || '',
        experienceDescription: user.user_metadata.experience_description || '',
        zipCodes: user.user_metadata.zip_codes || '',
      });
      setLoading(false);
    }
  }, [user, userLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: profileData.fullName,
        phone: profileData.phone,
        service_category: profileData.serviceCategory,
        experience_description: profileData.experienceDescription,
        zip_codes: profileData.zipCodes,
      }
    });

    if (!error) {
      setSaved(true);
      await refreshProfile();
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
          <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">Edit Technician Profile</h1>
          {saved && (
            <div className="mb-6 text-center">
              <span className="text-green-600 font-semibold">Profile saved successfully!</span>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField label="Full Name" name="fullName" value={profileData.fullName} onChange={handleChange} />
            <InputField label="Phone Number" name="phone" value={profileData.phone} onChange={handleChange} />
            
            <div>
              <label className="block text-gray-700 font-medium mb-1">Service Category</label>
              <select
                name="serviceCategory"
                value={profileData.serviceCategory}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {services.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <InputField label="Service Area Zip Codes" name="zipCodes" value={profileData.zipCodes} onChange={handleChange} />

            <div>
              <label className="block text-gray-700 font-medium mb-1">Description of Experience</label>
              <textarea
                name="experienceDescription"
                value={profileData.experienceDescription}
                onChange={handleChange}
                rows={5}
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

const InputField = ({ label, name, value, onChange }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
); 