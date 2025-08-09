import DashboardClient from "../_components/DashboardClient";

export default async function CreatorDashboardPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  return <DashboardClient tenant={tenant} />;
}


