import DashboardClient from "../_components/DashboardClient";

export default async function CreatorDashboardPage({ params }: { params: Promise<{ tenant: string }> }) {
  try {
    const { tenant } = await params;
    
    // If no tenant is provided, show a fallback
    if (!tenant) {
      return (
        <div className="min-h-screen bg-white dark:bg-[#111111] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Welcome to Service Homie
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              This is the creator dashboard. Please access this app through Whop to see your specific dashboard.
            </p>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-400">
              <p>Expected tenant: {tenant || 'undefined'}</p>
              <p>If you're seeing this message, please ensure you're accessing the app through Whop.</p>
            </div>
          </div>
        </div>
      );
    }
    
    return <DashboardClient tenant={tenant} />;
  } catch (error) {
    console.error('Error in dashboard page:', error);
    return (
      <div className="min-h-screen bg-white dark:bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Something went wrong
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            There was an error loading the dashboard. Please try refreshing the page.
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-400">
            <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        </div>
      </div>
    );
  }
}


