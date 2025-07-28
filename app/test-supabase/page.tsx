"use client";
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TestSupabase() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        console.log('Fetching all technician profiles...');
        const { data, error } = await supabase
          .from('technician_profiles')
          .select('*');

        console.log('Supabase response:', { data, error });

        if (error) {
          console.error('Error fetching profiles:', error);
          setError(error.message);
        } else {
          console.log('Found profiles:', data);
          setProfiles(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch profiles');
      } finally {
        setLoading(false);
      }
    }

    fetchProfiles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Technician Profiles in Database</h1>
      {profiles.length === 0 ? (
        <p>No technician profiles found in database.</p>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile, index) => (
            <div key={index} className="border p-4 rounded">
              <h3 className="font-bold">Profile {index + 1}</h3>
              <p><strong>User ID:</strong> {profile.user_id}</p>
              <p><strong>Business Name:</strong> {profile.business_name}</p>
              <p><strong>URL Slug:</strong> {profile.url_slug || 'NOT SET'}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Location:</strong> {profile.location}</p>
              <p><strong>Service Type:</strong> {profile.service_type}</p>
              <p><strong>Description:</strong> {profile.description}</p>
              <p><strong>Hourly Rate:</strong> {profile.hourly_rate}</p>
              <p><strong>Calendly Link:</strong> {profile.calendly_link || 'NOT SET'}</p>
              <p><strong>Google Business URL:</strong> {profile.google_business_url || 'NOT SET'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 