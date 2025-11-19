"use client"

import { Typography } from "antd"
import { useAuth } from "@/lib/context/AuthContext"
import { getGreetingEmoji } from "@/utils/helpers"
import SelectForm from "@/components/Form/SelectForm"

const { Title } = Typography

export default function Home() {
	const { user } = useAuth()

	return (
		<main className="mx-auto flex min-h-screen max-w-[600px] flex-col items-center justify-center gap-8 p-10">
			<Title>
				أهلًا {user?.displayName?.split(" ")[0]} {getGreetingEmoji()}
			</Title>
			<SelectForm />
		</main>
	)
}
