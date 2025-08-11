import DashboardClient from "../_components/DashboardClient";

export default async function CreatorDashboardPage({ params }: { params: Promise<{ tenant: string }> }) {
  try {
    const { tenant } = await params;
    return <DashboardClient tenant={tenant || 'default'} />;
  } catch (error) {
    // If there's any error with params, just show the dashboard with a default tenant
    return <DashboardClient tenant="default" />;
  }
}


