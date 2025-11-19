"use client"

import Link from "next/link"
import { Button, Typography } from "antd"
import { useAuth } from "@/lib/context/AuthContext"
import { getGreetingEmoji } from "@/utils/helpers"

const { Title } = Typography

export default function Home() {
	const { user } = useAuth()

	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-8">
			<Title>
				أهلًا {user?.displayName?.split(" ")[0]} {getGreetingEmoji()}
			</Title>
			<div className="flex flex-col gap-4">
				<Link href="/offer">
					<Button type="primary" size="large" block>
						إنشاء عرض جديد
					</Button>
				</Link>
				<Link href="/salary-calculator">
					<Button size="large" block>
						حاسبة الرواتب
					</Button>
				</Link>
			</div>
		</main>
	)
}
