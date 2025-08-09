export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-[#111111]">
      {/* dotted background + soft brand tints */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-dots" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-whop-pomegranate/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-whop-blue/15 blur-3xl" />
      </div>

      <main className="mx-auto flex min-h-screen max-w-none flex-col items-center justify-center px-6 text-center">
        <h1 className="whitespace-nowrap text-[clamp(48px,10vw,160px)] font-extrabold leading-[0.95] tracking-tight text-slate-900 dark:text-white">
          Service Homie
        </h1>
        <p className="mt-4 whitespace-nowrap text-[clamp(22px,4.5vw,56px)] font-semibold text-slate-700 dark:text-slate-300">
          Your All‑In‑One Whop Booking Platform
        </p>
        
        <div className="mt-8">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="inline-flex cursor-not-allowed items-center justify-center rounded-lg bg-whop-pomegranate/60 px-6 py-3 text-sm font-semibold text-white"
          >
            View on Whop App Store
          </button>
        </div>
      </main>
    </div>
  );
}
