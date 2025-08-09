"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ExperienceNav({ experienceId }: { experienceId: string }) {
  const pathname = usePathname();

  const tabs = [
    { href: `/experiences/${experienceId}`, label: "Overview" },
    { href: `/experiences/${experienceId}/services`, label: "Services" },
    { href: `/experiences/${experienceId}/bookings`, label: "Bookings" },
    { href: `/experiences/${experienceId}/settings`, label: "Settings" },
  ];

  return (
    <nav className="flex h-14 items-center gap-1 overflow-x-auto">
      {tabs.map((t) => {
        const active = pathname === t.href || (t.href !== `/experiences/${experienceId}` && pathname?.startsWith(t.href));
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors
              ${active ? "bg-whop-blue text-white" : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}


