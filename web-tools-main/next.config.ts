import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	// Ensure proper routing for client-side navigation
	trailingSlash: false,
	// Skip trailing slash redirect to avoid 404s
	skipTrailingSlashRedirect: true,
}

export default nextConfig
