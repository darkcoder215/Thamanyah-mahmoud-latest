"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Typography } from "antd"
import { useAuth } from "@/lib/context/AuthContext"
import { getGreetingEmoji } from "@/utils/helpers"

const { Title } = Typography

export default function Home() {
	const { user } = useAuth()
	const router = useRouter()

	useEffect(() => {
		// Redirect to dashboard after login
		if (user) {
			console.log("✅ User logged in, redirecting to dashboard...")
			router.push("/dashboard")
		}
	}, [user, router])

	return (
		<main className="flex min-h-screen items-center justify-center">
			<Title>
				أهلًا {user?.displayName?.split(" ")[0]} {getGreetingEmoji()}
			</Title>
		</main>
	)
}
