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
  const [schema, setSchema] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('=== DATABASE SCHEMA TEST ===');
        console.log('Supabase URL:', supabaseUrl);
        console.log('Supabase Key exists:', !!supabaseAnonKey);

        // First, let's try to get the schema information
        console.log('Testing database connection...');
        
        // Try to fetch all profiles to see the structure
        const { data, error } = await supabase
          .from('technician_profiles')
          .select('*')
          .limit(1);

        console.log('Database test result:', { data, error });

        if (error) {
          console.error('Database error:', error);
          setError(error.message);
          return;
        }

        if (data && data.length > 0) {
          console.log('Sample profile structure:', data[0]);
          console.log('Available columns:', Object.keys(data[0]));
          setSchema(data[0]);
        }

        // Now try to fetch all profiles
        const { data: allProfiles, error: profilesError } = await supabase
          .from('technician_profiles')
          .select('*');

        console.log('All profiles result:', { allProfiles, profilesError });

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          setError(profilesError.message);
        } else {
          console.log('Found profiles:', allProfiles);
          setProfiles(allProfiles || []);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading database test...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Schema Test</h1>
      
      {schema && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Database Schema</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Available columns:</strong></p>
            <ul className="list-disc list-inside">
              {Object.keys(schema).map((column) => (
                <li key={column} className="font-mono text-sm">
                  {column}: {typeof schema[column]} = {JSON.stringify(schema[column])}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Technician Profiles in Database</h2>
      {profiles.length === 0 ? (
        <p>No technician profiles found in database.</p>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile, index) => (
            <div key={index} className="border p-4 rounded">
              <h3 className="font-bold">Profile {index + 1}</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 