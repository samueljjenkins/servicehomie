import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import AppHeader from "@/components/AppHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Service Homie - Book a Local Technician Today",
  description: "Your one-stop marketplace for home services. Find and book trusted, local technicians for window cleaning, gutter cleaning, pressure washing, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <AppHeader />
          <main>{children}</main>
          {/* Footer can be added here */}
        </UserProvider>
      </body>
    </html>
  );
}
