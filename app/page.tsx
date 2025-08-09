export default function Page() {
  const features = [
    { title: 'Availability & buffers', desc: 'Set working hours, breaks, and buffers. Prevent double‑booking automatically.', color: 'blue' },
    { title: 'Payments & invoices', desc: 'Collect payments upfront or on completion. Auto‑issued receipts.', color: 'green' },
    { title: 'Reminders', desc: 'Email reminders and confirmations reduce no‑shows.', color: 'violet' },
    { title: 'Group sessions', desc: 'Offer workshops with multiple seats and waitlists.', color: 'amber' },
    { title: 'Team routing', desc: 'Round‑robin or priority routing for multi‑member teams.', color: 'rose' },
    { title: 'Analytics', desc: 'Track conversions, utilization, and revenue at a glance.', color: 'indigo' },
  ] as const;

  const colorClassMap: Record<(typeof features)[number]['color'], { bg: string; text: string; darkBg: string; darkText: string }>= {
    blue:   { bg: 'bg-blue-100',   text: 'text-blue-700',   darkBg: 'dark:bg-blue-900/30',   darkText: 'dark:text-blue-300' },
    green:  { bg: 'bg-green-100',  text: 'text-green-700',  darkBg: 'dark:bg-green-900/30',  darkText: 'dark:text-green-300' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-700', darkBg: 'dark:bg-violet-900/30', darkText: 'dark:text-violet-300' },
    amber:  { bg: 'bg-amber-100',  text: 'text-amber-700',  darkBg: 'dark:bg-amber-900/30',  darkText: 'dark:text-amber-300' },
    rose:   { bg: 'bg-rose-100',   text: 'text-rose-700',   darkBg: 'dark:bg-rose-900/30',   darkText: 'dark:text-rose-300' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', darkBg: 'dark:bg-indigo-900/30', darkText: 'dark:text-indigo-300' },
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-100 dark:from-slate-950 dark:via-slate-950 dark:to-indigo-950" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-500/15" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/15" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <section className="relative mb-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/60 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm backdrop-blur-sm dark:border-blue-900/40 dark:bg-slate-900/60 dark:text-blue-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-blue-600 dark:text-blue-400"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/></svg>
              Built for Whop creators
            </span>
            <h1 className="mt-5 text-balance text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
              The all‑in‑one booking system for Whop
            </h1>
            <p className="mt-5 text-pretty text-lg text-gray-700 dark:text-gray-300">
              Service Homie helps you sell time, manage availability, take payments, and automate confirmations — tightly integrated with your Whop communities.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="/discover" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-blue-600/30 transition-colors hover:bg-blue-700">
                Get started
              </a>
              <a href="/experiences/demo" className="inline-flex items-center justify-center rounded-xl border border-blue-600 bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-500 dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-slate-800">
                View demo
              </a>
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">No code required. Works with your existing Whop setup.</p>
          </div>

          {/* Hero Preview Card */}
          <div className="mx-auto mt-12 max-w-5xl">
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">1</span>
                    Accept bookings
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Share a link and let clients pick a time. Instant confirmations, reschedules, and reminders built‑in.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">2</span>
                    Get paid automatically
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Charge per session or offer packages. Invoices and receipts are generated for you.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">3</span>
                    Sync with Whop
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Gate bookings to members, reward affiliates, and keep access in sync with your Whop roles.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="mb-20">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const c = colorClassMap[f.color];
              const badge = `inline-flex h-9 w-9 items-center justify-center rounded-lg ${c.bg} ${c.text} ${c.darkBg} ${c.darkText}`;
              return (
              <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-3 flex items-center gap-3">
                  <span className={badge}> 
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{f.title}</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{f.desc}</p>
              </div>
              );
            })}
          </div>
        </section>

        {/* Whop Integration */}
        <section className="mb-20">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Deep Whop integration</h2>
                <p className="mt-3 text-slate-600 dark:text-slate-300">Connect your Whop community to control who can book, sync access after purchase, and track affiliate revenue.</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500" /> Gate bookings by role or product</li>
                  <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500" /> Auto‑grant access after checkout</li>
                  <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-500" /> Attribute and reward affiliates</li>
                </ul>
                <div className="mt-6 flex gap-3">
                  <a href="/discover" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Connect Whop</a>
                  <a href="/experiences/demo" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">See it in action</a>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Booking link</p>
                    <p className="truncate font-mono text-slate-800 dark:text-slate-100">/book/your-name</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Role required</p>
                    <p className="font-medium text-slate-800 dark:text-slate-100">Premium Member</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Payment</p>
                    <p className="font-medium text-slate-800 dark:text-slate-100">$99 / session</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Affiliate</p>
                    <p className="font-medium text-slate-800 dark:text-slate-100">Tracked</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="rounded-2xl bg-blue-600 px-8 py-10 text-center text-white shadow-lg">
            <h2 className="text-3xl font-bold">Launch your booking flow today</h2>
            <p className="mt-2 text-white/90">Create your first service in minutes — connect Whop, set availability, share your link.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href="/discover" className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">Get started</a>
              <a href="/experiences/demo" className="inline-flex items-center justify-center rounded-xl bg-blue-700/30 px-6 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 hover:bg-blue-700/40">View demo</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
