export default function TestEnvPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Environment Variables Test</h1>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 mb-2">App Configuration:</h2>
            <div className="text-sm space-y-1">
              <div><strong>NEXT_PUBLIC_APP_URL:</strong> {process.env.NEXT_PUBLIC_APP_URL ? '✅ Set' : '❌ Missing'}</div>
              <div><strong>Value:</strong> {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}</div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 mb-2">Supabase Variables:</h2>
            <div className="text-sm space-y-1">
              <div><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</div>
              <div><strong>Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 mb-2">Clerk Variables:</h2>
            <div className="text-sm space-y-1">
              <div><strong>Publishable Key:</strong> {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}</div>
              <div><strong>Secret Key:</strong> {process.env.CLERK_SECRET_KEY ? '✅ Set' : '❌ Missing'}</div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h2 className="font-semibold text-gray-800 mb-2">Stripe Variables:</h2>
            <div className="text-sm space-y-1">
              <div><strong>Secret Key:</strong> {process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing'}</div>
              <div><strong>Publishable Key:</strong> {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing'}</div>
              <div><strong>Price ID:</strong> {process.env.STRIPE_SUBSCRIPTION_PRICE_ID ? '✅ Set' : '❌ Missing'}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This page shows which environment variables are available. 
            If any show "❌ Missing", that could be causing the error.
          </p>
        </div>
      </div>
    </div>
  );
} 