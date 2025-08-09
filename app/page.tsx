export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111111]">
      <main className="mx-auto flex min-h-screen max-w-none flex-col items-center justify-center px-6 text-center">
        <h1 className="w-full max-w-[50vw] text-balance text-[16vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] font-extrabold leading-[0.9] tracking-tight text-slate-900 dark:text-white">
          Service Homie
        </h1>
        <p className="mt-4 text-[5vw] sm:text-[4vw] md:text-[3vw] lg:text-[2.5vw] font-semibold text-slate-700 dark:text-slate-300">
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
