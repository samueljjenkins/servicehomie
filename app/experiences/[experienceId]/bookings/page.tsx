export default async function BookingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Bookings</h1>
      <p className="text-slate-600 dark:text-slate-300">See upcoming and past bookings. (Coming soon)</p>
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">No bookings yet.</p>
      </div>
    </div>
  );
}


