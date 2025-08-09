export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">Service Homie</h1>
        <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">your all‑in‑one Whop booking platform</p>
        <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-400">
          We help creators sell time, manage availability, take payments, and automate confirmations — all
          connected to your Whop community.
        </p>
        <div className="mt-8">
          <a
            href={process.env.NEXT_PUBLIC_WHOP_APP_STORE_URL || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-whop-pomegranate px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e53f13]"
          >
            View on Whop App Store
          </a>
        </div>
      </main>
    </div>
  );
}
