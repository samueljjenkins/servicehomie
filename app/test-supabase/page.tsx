"use client";

import { useState } from "react";
import { createClient } from '@supabase/supabase-js';

export default function TestSupabasePage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testInvite = async () => {
    setLoading(true);
    setResult(null);

    try {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      console.log('Testing with email:', email);
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('Service role key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

      const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: {
          full_name: 'Test User',
          user_type: 'technician'
        },
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/technician-onboarding`
      });

      if (error) {
        console.error('Error details:', error);
        setResult({ error: error.message, details: error });
      } else {
        console.log('Success:', data);
        setResult({ success: true, user: data.user });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setResult({ error: 'Unexpected error', details: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Test Supabase Invite
          </h2>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="test@example.com"
              />
            </div>
            
            <button
              onClick={testInvite}
              disabled={loading || !email}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test Invite"}
            </button>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Result:</h3>
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 