import { withWhopAppConfig } from "@whop/react/next.config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [{ hostname: "**" }],
	},
	async headers() {
		return [
			{
				// apply to all routes
				source: "/:path*",
				headers: [
					// Allow the app to be embedded inside Whop
					{ key: "Content-Security-Policy", value: "frame-ancestors https://whop.com https://*.whop.com;" },
					// Explicitly allow framing (avoid DENY or SAMEORIGIN)
					{ key: "X-Frame-Options", value: "ALLOWALL" },
				],
			},
		];
	},
};

export default withWhopAppConfig(nextConfig);
