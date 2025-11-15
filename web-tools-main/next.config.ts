import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	// Ensure proper routing and output for Vercel
	trailingSlash: false,
	skipTrailingSlashRedirect: false,
	// Ensure rewrites work correctly
	async rewrites() {
		return []
	},
}

export default nextConfig
