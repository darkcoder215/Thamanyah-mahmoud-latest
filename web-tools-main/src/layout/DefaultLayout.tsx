"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { BulbFilled, BulbOutlined, LogoutOutlined } from "@ant-design/icons"
import { Button, Space, Tooltip } from "antd"
import Login from "@/components/Login"
import { AuthProvider, useAuth } from "@/lib/context/AuthContext"
import { getGreetingEmoji } from "@/utils/helpers"

// Protected layout component that checks authentication
const ProtectedLayout = ({
	children,
	darkMode,
	onDarkModeToggle,
}: React.PropsWithChildren<{
	darkMode: boolean
	onDarkModeToggle: () => void
}>) => {
	const pathname = usePathname()
	const { user, logout, loading, isGuestMode } = useAuth()

	const handleLogout = async () => {
		console.log("🚪 Logout button clicked")
		const logoutMessage = isGuestMode
			? "هل أنت متأكد أنك تريد الخروج من وضع الضيف؟"
			: "هل أنت متأكد أنك تريد تسجيل الخروج؟"
		const confirmLogout = window.confirm(logoutMessage)
		if (confirmLogout) {
			console.log("✅ User confirmed logout")
			await logout()
		} else {
			console.log("❌ User cancelled logout")
		}
	}

	if (loading) {
		console.log("⏳ Auth loading...")
		return <></>
	}

	// If not authenticated, show login
	if (!user && process.env.NEXT_PUBLIC_PASS_LOGIN !== "true") {
		console.log("🔒 User not authenticated, showing login screen")
		return <Login />
	}

	console.log(
		`✅ User authenticated: ${user?.email} (Guest mode: ${isGuestMode ? "Yes" : "No"})`,
	)

	return (
		<>
			{user && (
				<div className="hide-print fixed-bottom flex w-full items-center justify-between p-2 px-4">
					{pathname !== "/dashboard" && pathname !== "/" && (
						<span className="font-semiBold font-8-sans me-2">
							أهلاً {user.displayName?.split(" ")[0]} {getGreetingEmoji()}
							{isGuestMode && (
								<span className="ms-2 rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
									وضع الضيف
								</span>
							)}
						</span>
					)}
					<Space className="ms-auto">
						<Tooltip
							title={darkMode ? "تبديل إلى الوضع الفاتح" : "تبديل إلى الوضع الداكن"}
						>
							<Button
								type={darkMode ? "default" : "primary"}
								shape="circle"
								icon={darkMode ? <BulbFilled /> : <BulbOutlined />}
								onClick={onDarkModeToggle}
							/>
						</Tooltip>
						<Tooltip title={isGuestMode ? "الخروج من وضع الضيف" : "تسجيل الخروج"}>
							<Button
								type="primary"
								color="danger"
								variant="outlined"
								shape="circle"
								icon={<LogoutOutlined />}
								onClick={handleLogout}
								loading={loading}
							></Button>
						</Tooltip>
					</Space>
				</div>
			)}
			{children}
		</>
	)
}

export default function DefaultLayout({
	children,
	darkMode,
	onDarkModeToggle,
}: React.PropsWithChildren<{
	darkMode: boolean
	onDarkModeToggle: () => void
}>) {
	return (
		<AuthProvider>
			<ProtectedLayout darkMode={darkMode} onDarkModeToggle={onDarkModeToggle}>
				{children}
			</ProtectedLayout>
		</AuthProvider>
	)
}
