import { WhopApp } from "@whop/react/components";
import { Theme } from 'frosted-ui';
import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Service Homie - Whop Booking Platform",
	description: "Your All-In-One Whop Booking Platform",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Script id="set-dark-mode" strategy="beforeInteractive">
					{`
					(function() {
					  try {
					    var storedTheme = localStorage.getItem('theme');
					    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
					    var shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark;
					    var root = document.documentElement;
					    if (shouldUseDark) {
					      root.classList.add('dark');
					    } else {
					      root.classList.remove('dark');
					    }
					  } catch (e) {}
					})();
					`}
				</Script>
				<Theme>
					<WhopApp>
						{children}
					</WhopApp>
				</Theme>
			</body>
		</html>
	);
}
