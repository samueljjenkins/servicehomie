"use client";

import { useState, useEffect } from 'react';

export default function TestServicesPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testServices() {
      const testResults: any = {};

      // Test 1: Basic environment variables
      try {
        testResults.envVars = {
          supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          clerkPubKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
          clerkSecret: !!process.env.CLERK_SECRET_KEY,
          stripeSecret: !!process.env.STRIPE_SECRET_KEY,
          stripePubKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          siteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
        };
      } catch (error) {
        testResults.envVars = { error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test 2: Supabase client initialization
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        testResults.supabase = { success: true };
      } catch (error) {
        testResults.supabase = { error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test 3: Stripe client initialization
      try {
        const Stripe = await import('stripe');
        const stripe = new Stripe.default(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: '2025-06-30.basil',
        });
        testResults.stripe = { success: true };
      } catch (error) {
        testResults.stripe = { error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test 4: Clerk initialization (client-side)
      try {
        const { useAuth } = await import('@clerk/nextjs');
        testResults.clerk = { success: true };
      } catch (error) {
        testResults.clerk = { error: error instanceof Error ? error.message : 'Unknown error' };
      }

      setResults(testResults);
      setLoading(false);
    }

    testServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Testing services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Service Initialization Test</h1>
        
        <div className="space-y-4">
          {/* Environment Variables */}
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 mb-2">Environment Variables:</h2>
            <div className="text-sm space-y-1">
              {Object.entries(results.envVars || {}).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {value ? '✅ Available' : '❌ Missing'}
                </div>
              ))}
            </div>
          </div>

          {/* Supabase Test */}
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 mb-2">Supabase Client:</h2>
            <div className="text-sm">
              {results.supabase?.success ? (
                <span className="text-green-600">✅ Initialized successfully</span>
              ) : (
                <div>
                  <span className="text-red-600">❌ Failed to initialize</span>
                  <div className="text-red-500 mt-1">{results.supabase?.error}</div>
                </div>
              )}
            </div>
          </div>

          {/* Stripe Test */}
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 mb-2">Stripe Client:</h2>
            <div className="text-sm">
              {results.stripe?.success ? (
                <span className="text-green-600">✅ Initialized successfully</span>
              ) : (
                <div>
                  <span className="text-red-600">❌ Failed to initialize</span>
                  <div className="text-red-500 mt-1">{results.stripe?.error}</div>
                </div>
              )}
            </div>
          </div>

          {/* Clerk Test */}
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 mb-2">Clerk Client:</h2>
            <div className="text-sm">
              {results.clerk?.success ? (
                <span className="text-green-600">✅ Initialized successfully</span>
              ) : (
                <div>
                  <span className="text-red-600">❌ Failed to initialize</span>
                  <div className="text-red-500 mt-1">{results.clerk?.error}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This test initializes each service individually to identify which one is causing the error.
          </p>
        </div>
      </div>
    </div>
  );
} 