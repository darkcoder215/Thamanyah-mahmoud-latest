import { useEffect, useState } from "react"
import { GoogleOutlined, UserOutlined } from "@ant-design/icons"
import { Alert, Button, Card, Divider, message } from "antd"
import { useAuth } from "@/lib/context/AuthContext"
import { hasFirebaseConfig } from "@/lib/firebase/firebaseConfig"

const Login = () => {
	const [messageApi, contextHolder] = message.useMessage()
	const [firebaseAvailable, setFirebaseAvailable] = useState(false)

	const { signInWithGoogleProvider, signInAsGuest, loading, error, clearError } = useAuth()

	useEffect(() => {
		// Check if Firebase is configured
		console.log("🔍 Checking Firebase configuration...")
		setFirebaseAvailable(hasFirebaseConfig)
		if (!hasFirebaseConfig) {
			console.log("⚠️ Firebase not configured - Google login will be disabled")
		} else {
			console.log("✅ Firebase configured - Google login available")
		}
	}, [])

	useEffect(() => {
		console.log("🔐 Login component mounted")
		if (error) {
			console.error("❌ Login error detected:", error)
			messageApi.error({ content: error, duration: 4 })
		}
	}, [error, messageApi])

	const handleGoogleSignIn = async () => {
		console.log("🔑 User clicked Google sign-in button")
		await signInWithGoogleProvider()
	}

	const handleGuestSignIn = () => {
		console.log("👤 User clicked guest sign-in button")
		signInAsGuest()
		messageApi.success({ content: "تم تسجيل الدخول كضيف", duration: 1 })
		// Force full page reload to dashboard
		setTimeout(() => {
			window.location.href = "/dashboard"
		}, 1000)
	}

	return (
		<div className="flex min-h-screen items-center justify-center">
			<Card className="mx-auto w-[400px] max-w-[90%] rounded-lg p-5 shadow-md">
				{contextHolder}
				{error && (
					<Alert
						message={error}
						type="error"
						showIcon
						closable
						onClose={clearError}
						className="mb-4"
					/>
				)}
				<div className="mb-4 text-center">
					<h2 className="text-xl font-semibold">مرحباً بك</h2>
					<p className="text-gray-600">سجّل دخولك للمتابعة</p>
				</div>

				{firebaseAvailable ? (
					<>
						<Button
							icon={<GoogleOutlined />}
							onClick={handleGoogleSignIn}
							loading={loading}
							block
							size="large"
							type="primary"
						>
							سجّل دخولك بواسطة Google
						</Button>

						<Divider plain>أو</Divider>

						<Button
							icon={<UserOutlined />}
							onClick={handleGuestSignIn}
							loading={loading}
							block
							size="large"
							type="default"
						>
							متابعة كضيف
						</Button>
					</>
				) : (
					<>
						<Button
							icon={<UserOutlined />}
							onClick={handleGuestSignIn}
							loading={loading}
							block
							size="large"
							type="primary"
						>
							متابعة كضيف
						</Button>

						<div className="mt-4 rounded bg-yellow-50 p-3 text-center text-sm text-yellow-800">
							<p>
								ℹ️ <strong>ملاحظة:</strong> تسجيل الدخول عبر Google غير متاح حالياً.
								يمكنك المتابعة كضيف للوصول لجميع الأدوات.
							</p>
						</div>
					</>
				)}

				<div className="mt-4 rounded bg-blue-50 p-3 text-center text-sm text-blue-800">
					<p>
						💡 <strong>نصيحة:</strong> تسجيل الدخول كضيف يتيح لك استخدام جميع الأدوات
						بدون الحاجة للمصادقة
					</p>
				</div>
			</Card>
		</div>
	)
}

export default Login
