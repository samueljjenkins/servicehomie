import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { WhopIframeSdkProvider } from "@whop/react/iframe";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ServiceHomie - Manage Your Service Business",
  description: "The easiest way to manage your service business and let customers book appointments online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://js.whop.com/static/checkout/loader.js"
          async
          defer
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <WhopIframeSdkProvider>
          <div className="min-h-screen bg-white dark:bg-black">
            {children}
          </div>
        </WhopIframeSdkProvider>
      </body>
    </html>
  );
}
