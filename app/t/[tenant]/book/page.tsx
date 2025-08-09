import CustomerBookingClient from "./Client";

export default async function Page({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  return <CustomerBookingClient tenant={tenant} />;
}


