import ExperienceNav from "./_components/ExperienceNav";

export default function ExperienceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ experienceId: string }>;
}) {
  // Render a nav that works inside the Whop iframe for deep links
  return (
    <div className="min-h-screen">
      {/* Nav */}
      {/* Note: params is a Promise in app router. We pass it down via an async wrapper below. */}
      <AsyncNav params={params} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

async function AsyncNav({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const { experienceId } = await params;
  return (
    <div className="sticky top-0 z-10 w-full border-b border-slate-200 bg-white/70 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mx-auto max-w-5xl px-4">
        <ExperienceNav experienceId={experienceId} />
      </div>
    </div>
  );
}


