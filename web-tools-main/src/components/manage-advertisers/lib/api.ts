import { createClient } from "@supabase/supabase-js"
import { getAdvertisers, getPosts } from "@/components/manage-advertisers/lib/queries"

console.log("🗄️ Supabase API: Initializing...")

// Check if Supabase environment variables are present
const hasSupabaseConfig =
	process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!hasSupabaseConfig) {
	console.warn(
		"⚠️ Supabase environment variables not found. Manage Advertisers feature will not be available.",
	)
}

// Initialize Supabase only if config is present
const supabase = hasSupabaseConfig
	? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
	: null

export async function getInitialData() {
	console.log("📊 getInitialData: Starting...")

	// Check if Supabase is configured
	if (!hasSupabaseConfig || !supabase) {
		console.warn("⚠️ Supabase not configured, returning empty data")
		return {
			posts: [],
			advertisers: [],
		}
	}

	try {
		const [postsResult, advertisersResult] = await Promise.all([
			getPosts(supabase),
			getAdvertisers(supabase),
		])

		if (postsResult.error || advertisersResult.error) {
			console.error("❌ Supabase error:", postsResult.error || advertisersResult.error)
			throw new Error("Error fetching data from Supabase")
		}

		console.log("✅ Supabase data fetched successfully")

		return {
			posts:
				postsResult.data?.map((post) => ({
					id: post.id,
					postId: post.postId,
					title: post.title,
					productHandle: post.productHandle,
					productName: post.productName,
					advertiser_name: (post.advertisers as unknown as { name: string })?.name || "",
				})) || [],
			advertisers: advertisersResult.data || [],
		}
	} catch (error) {
		console.error("❌ Error in getInitialData:", error)
		return {
			posts: [],
			advertisers: [],
		}
	}
}

export { hasSupabaseConfig }
