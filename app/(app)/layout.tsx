import { WhopApp } from "@whop/react/components";

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<WhopApp>
			<div className="min-h-screen bg-white dark:bg-[#111111]">
				{children}
			</div>
		</WhopApp>
	);
}
