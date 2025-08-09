export default function Page() {
  const features = [
    { title: 'Sell sessions', desc: 'Create services with durations and pricing that match your offering.', color: 'pomegranate' },
    { title: 'Availability & buffers', desc: 'Set working hours, breaks, and buffers. Prevent double‑booking automatically.', color: 'blue' },
    { title: 'Payments & invoices', desc: 'Collect payments upfront or on completion. Auto‑issued receipts.', color: 'chartreuse' },
    { title: 'Group sessions', desc: 'Offer workshops with multiple seats and waitlists.', color: 'pomegranate' },
    { title: 'Team routing', desc: 'Round‑robin or priority routing for multi‑member teams.', color: 'blue' },
    { title: 'Reminders', desc: 'Automatic confirmations and reminders reduce no‑shows.', color: 'chartreuse' },
  ] as const;

  const colorClassMap: Record<(typeof features)[number]['color'], { bg: string; text: string; darkBg: string; darkText: string }>= {
    blue:        { bg: 'bg-whop-blue/10',        text: 'text-whop-blue',        darkBg: 'dark:bg-whop-blue/20',        darkText: 'dark:text-whop-blue' },
    pomegranate: { bg: 'bg-whop-pomegranate/10', text: 'text-whop-pomegranate', darkBg: 'dark:bg-whop-pomegranate/20', darkText: 'dark:text-whop-pomegranate' },
    chartreuse:  { bg: 'bg-whop-chartreuse/40',  text: 'text-whop-cod',         darkBg: 'dark:bg-whop-chartreuse/30',  darkText: 'dark:text-whop-cod' },
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Canvas background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-whop-fantasy to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950" />
        <div className="absolute inset-0 bg-grid-dots" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-whop-pomegranate/25 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-whop-blue/25 blur-3xl" />
        <div className="absolute -bottom-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-whop-chartreuse/60 blur-2xl" />
      </div>

      {/* Hero */}
      <section className="relative -mx-4 mb-16 overflow-hidden bg-gradient-to-br from-whop-pomegranate via-transparent to-whop-blue sm:-mx-6 lg:-mx-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 md:py-28 lg:px-8">
          <h1 className="text-balance bg-gradient-to-r from-whop-pomegranate via-whop-chartreuse to-whop-blue bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-sm sm:text-7xl md:text-8xl">
            Service Homie
          </h1>
          <p className="mt-4 text-pretty text-xl text-slate-800 dark:text-slate-200">
            your all‑in‑one Whop booking platform
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="/t/demo/book" className="inline-flex items-center justify-center rounded-xl bg-whop-blue px-6 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-whop-blue/30 transition-colors hover:bg-whop-blue/90">
              Get started
            </a>
            <a href="/t/demo/dashboard" className="inline-flex items-center justify-center rounded-xl border border-whop-pomegranate bg-white px-6 py-3 text-sm font-semibold text-whop-pomegranate hover:bg-whop-fantasy dark:border-whop-pomegranate dark:bg-slate-900 dark:text-whop-pomegranate dark:hover:bg-slate-800">
              Creator dashboard
            </a>
          </div>
        </div>
      </section>

      {/* Pain section */}
      <section className="-mx-4 mb-16 bg-slate-950 py-16 text-white sm:-mx-6 lg:-mx-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">The pain</h2>
          <p className="mt-2 text-white/70">Creators juggle DMs, spreadsheets, and missed payments. Clients get confused and no‑shows happen.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <span className="mb-2 inline-flex rounded-md bg-whop-pomegranate/20 px-2 py-1 text-xs text-whop-pomegranate">Scheduling chaos</span>
              <p className="text-sm text-white/80">Back‑and‑forth messages to find a time. Time zones, double‑bookings, and last‑minute changes.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <span className="mb-2 inline-flex rounded-md bg-whop-chartreuse/40 px-2 py-1 text-xs text-slate-900">Leaky payments</span>
              <p className="text-sm text-white/80">Chasing invoices, manual refunds, and no way to tie revenue back to affiliates and roles.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <span className="mb-2 inline-flex rounded-md bg-whop-blue/20 px-2 py-1 text-xs text-whop-blue">No‑shows</span>
              <p className="text-sm text-white/80">Clients forget. Reminders are manual. You lose time and momentum.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">

        {/* Solution overview */}
        <section className="mb-20">
          <h2 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">What you get</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const c = colorClassMap[f.color];
              const badge = `inline-flex h-9 w-9 items-center justify-center rounded-lg ${c.bg} ${c.text} ${c.darkBg} ${c.darkText}`;
              return (
              <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-3 flex items-center gap-3">
                  <span className={badge}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{f.title}</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{f.desc}</p>
              </div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="mb-20">
          <h2 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">How it works</h2>
          <div className="grid items-stretch gap-6 md:grid-cols-3">
            {[
              { n: '01', title: 'Connect Whop', desc: 'Link your company and choose who can book based on roles or products.', color: 'whop-blue' },
              { n: '02', title: 'Publish services', desc: 'Define durations and pricing, then share your booking link.', color: 'whop-pomegranate' },
              { n: '03', title: 'Get paid', desc: 'Customers check out on Whop and you stay in sync automatically.', color: 'whop-chartreuse' },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold text-slate-900`} style={{ background: s.color === 'whop-chartreuse' ? 'var(--color-whop-chartreuse, #DBF505)' : undefined }}>
                  {s.color === 'whop-blue' && <span className="bg-whop-blue/10 px-2 py-1 rounded-md text-whop-blue">{s.n}</span>}
                  {s.color === 'whop-pomegranate' && <span className="bg-whop-pomegranate/10 px-2 py-1 rounded-md text-whop-pomegranate">{s.n}</span>}
                  {s.color === 'whop-chartreuse' && <span className="px-2 py-1 rounded-md text-whop-cod">{s.n}</span>}
                </span>
                <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Whop Integration */}
        <section className="mb-20">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
              <h2 className="gradient-underline text-2xl font-bold text-slate-900 dark:text-slate-100">Deep Whop integration</h2>
                <p className="mt-3 text-slate-600 dark:text-slate-300">Connect your Whop community to control who can book, sync access after purchase, and track affiliate revenue.</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-whop-blue" /> Gate bookings by role or product</li>
                  <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-whop-pomegranate" /> Auto‑grant access after checkout</li>
                  <li className="flex items-start gap-2"><span className="mt-1 inline-block h-2 w-2 rounded-full bg-whop-chartreuse" /> Attribute and reward affiliates</li>
                </ul>
                <div className="mt-6 flex gap-3">
                  <a href="/t/demo/dashboard" className="inline-flex items-center justify-center rounded-xl bg-whop-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-whop-blue/90">Connect Whop</a>
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
          <div className="rounded-2xl bg-gradient-to-r from-whop-pomegranate via-whop-chartreuse to-whop-blue px-8 py-10 text-center text-white shadow-lg">
            <h2 className="text-3xl font-bold">Launch your booking flow today</h2>
            <p className="mt-2 text-white/90">Create your first service in minutes — connect Whop, set availability, share your link.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href="/discover" className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-whop-blue hover:bg-blue-50">Get started</a>
              <a href="/t/demo/book" className="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 hover:bg-white/15">View demo</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
