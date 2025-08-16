import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { WhopIframeSdkProvider } from "@whop/react/iframe";
import { Theme } from "frosted-ui";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ServiceHomie - Manage Your Service Business",
  description: "The easiest way to manage your service business and let customers book appointments online",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ServiceHomie',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
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
        <Theme>
          <WhopIframeSdkProvider>
            {children}
          </WhopIframeSdkProvider>
        </Theme>
      </body>
    </html>
  );
}
