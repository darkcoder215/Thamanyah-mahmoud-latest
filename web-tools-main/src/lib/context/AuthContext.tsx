"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { User } from "firebase/auth"
import { signInWithGoogle, signOutUser, subscribeToAuthChanges } from "../firebase/auth"

interface AuthContextType {
	user: User | null
	loading: boolean
	error: string | null
	isGuestMode: boolean
	signInWithGoogleProvider: () => Promise<void>
	signInAsGuest: () => void
	logout: () => Promise<void>
	clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [isGuestMode, setIsGuestMode] = useState<boolean>(false)

	useEffect(() => {
		console.log("🔐 AuthProvider: Initializing authentication...")

		// Check if guest mode is active in localStorage
		const guestModeActive = localStorage.getItem("guestMode") === "true"
		if (guestModeActive) {
			console.log("👤 Guest mode detected in localStorage")
			setIsGuestMode(true)
			// Create a mock guest user
			const guestUser = {
				uid: "guest",
				email: "guest@local",
				displayName: "ضيف",
				photoURL: null,
			} as User
			setUser(guestUser)
			setLoading(false)
			console.log("✅ Guest user initialized:", guestUser.displayName)
			return
		}

		// Normal Firebase authentication
		console.log("🔑 Subscribing to Firebase auth changes...")
		const unsubscribe = subscribeToAuthChanges((user) => {
			if (user) {
				console.log("✅ User authenticated:", user.email)
			} else {
				console.log("❌ No authenticated user")
			}
			setUser(user)
			setLoading(false)
		})

		return () => {
			console.log("🔓 Unsubscribing from auth changes")
			unsubscribe()
		}
	}, [])

	const signInWithGoogleProvider = async () => {
		console.log("🔑 Attempting Google sign-in...")
		try {
			setLoading(true)
			setError(null)
			const { error } = await signInWithGoogle()
			if (error) {
				console.error("❌ Google sign-in error:", error)
				setError(error)
			} else {
				console.log("✅ Google sign-in successful")
			}
		} catch (err) {
			console.error("❌ Unexpected error during Google sign-in:", err)
			setError("An unexpected error occurred during Google sign in.")
		} finally {
			setLoading(false)
		}
	}

	const signInAsGuest = () => {
		console.log("👤 Guest login initiated...")
		try {
			setLoading(true)
			setError(null)

			// Set guest mode in localStorage
			localStorage.setItem("guestMode", "true")
			console.log("💾 Guest mode saved to localStorage")

			// Create a mock guest user
			const guestUser = {
				uid: "guest",
				email: "guest@local",
				displayName: "ضيف",
				photoURL: null,
			} as User

			setIsGuestMode(true)
			setUser(guestUser)
			console.log("✅ Guest login successful:", guestUser.displayName)
		} catch (err) {
			console.error("❌ Error during guest login:", err)
			setError("حدث خطأ أثناء تسجيل الدخول كضيف")
		} finally {
			setLoading(false)
		}
	}

	const logout = async () => {
		console.log("🚪 Logout initiated...")
		try {
			setLoading(true)
			setError(null)

			// Check if in guest mode
			if (isGuestMode) {
				console.log("👤 Logging out from guest mode...")
				localStorage.removeItem("guestMode")
				setIsGuestMode(false)
				setUser(null)
				console.log("✅ Guest logout successful")
			} else {
				console.log("🔑 Logging out from Firebase...")
				const { success, error } = await signOutUser()
				if (!success && error) {
					console.error("❌ Firebase logout error:", error)
					setError(error)
				} else {
					console.log("✅ Firebase logout successful")
				}
			}
		} catch (err) {
			console.error("❌ Unexpected error during logout:", err)
			setError("An unexpected error occurred during logout.")
		} finally {
			setLoading(false)
		}
	}

	const clearError = () => {
		setError(null)
	}

	const value = {
		user,
		loading,
		error,
		isGuestMode,
		signInWithGoogleProvider,
		signInAsGuest,
		logout,
		clearError,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
