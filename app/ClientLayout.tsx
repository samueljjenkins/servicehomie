"use client";
import { usePathname } from "next/navigation";
import AppHeader from "@/components/AppHeader";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeaderFooter = [
    "/technician-page",
    "/technician-profile-edit",
    "/technician-analytics"
  ].includes(pathname);

  return (
    <>
      {!hideHeaderFooter && <AppHeader />}
      <main>
        {hideHeaderFooter && (
          <a href="/technician-dashboard" className="fixed top-4 left-4 z-50 bg-white border border-gray-200 rounded-full px-4 py-2 shadow hover:bg-gray-100 text-blue-700 font-semibold flex items-center gap-2 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Dashboard
          </a>
        )}
        {children}
      </main>
    </>
  );
} 