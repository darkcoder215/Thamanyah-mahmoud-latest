import {
	AuthError,
	GoogleAuthProvider,
	User,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
} from "firebase/auth"
import { auth, hasFirebaseConfig } from "./firebaseConfig"

// Check if a user's email is from thmanyah.com domain
export const isCompanyEmail = (email: string): boolean => {
	try {
		// Extract domain from email and check if it's thmanyah.com
		const domain = email.split("@")[1]
		if (!domain) {
			console.error("Invalid email format: Missing domain.")
			return false
		}

		// Only allow thmanyah.com domain
		return domain === "thmanyah.com"
	} catch (error) {
		console.error("Error checking email domain:", error)
		return false
	}
}

// Sign in with Google
export const signInWithGoogle = async (): Promise<{
	user: User | null
	error: string | null
}> => {
	console.log("🔑 signInWithGoogle: Starting...")

	// Check if Firebase is configured
	if (!hasFirebaseConfig || !auth) {
		console.error("❌ Firebase not configured")
		return {
			user: null,
			error: "Firebase is not configured. Please use Guest Login instead.",
		}
	}

	try {
		console.log("🔑 Opening Google sign-in popup...")
		const provider = new GoogleAuthProvider()
		const userCredential = await signInWithPopup(auth, provider)

		console.log("✅ Google popup completed")

		// Check if email is from thmanyah.com domain
		const email = userCredential.user.email
		if (!email) {
			console.error("❌ No email found in user credential")
			await signOut(auth)
			return { user: null, error: "No email associated with this Google account." }
		}

		console.log("📧 Checking email domain:", email)
		const isAllowed = isCompanyEmail(email)
		if (!isAllowed) {
			console.error("❌ Email not from authorized domain:", email)
			await signOut(auth)
			return {
				user: null,
				error: "You are not authorized to access this application. Only @thmanyah.com emails are allowed.",
			}
		}

		console.log("✅ User authorized:", email)
		return { user: userCredential.user, error: null }
	} catch (error: unknown) {
		const authError = error as AuthError
		console.error("❌ Google sign-in error:", authError.code, authError.message)
		return { user: null, error: authError.message }
	}
}

// Sign out
export const signOutUser = async (): Promise<{
	success: boolean
	error: string | null
}> => {
	console.log("🚪 signOutUser: Starting...")

	// Check if Firebase is configured
	if (!hasFirebaseConfig || !auth) {
		console.warn("⚠️ Firebase not configured, cannot sign out from Firebase")
		return { success: false, error: "Firebase not configured" }
	}

	try {
		await signOut(auth)
		console.log("✅ Firebase sign out successful")
		return { success: true, error: null }
	} catch (error: unknown) {
		const authError = error as AuthError
		console.error("❌ Firebase sign out error:", authError.code, authError.message)
		return { success: false, error: authError.message }
	}
}

// Listen to auth state changes
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
	console.log("👂 subscribeToAuthChanges: Setting up listener...")

	// Check if Firebase is configured
	if (!hasFirebaseConfig || !auth) {
		console.warn("⚠️ Firebase not configured, no auth state listener")
		// Return a no-op unsubscribe function
		callback(null)
		return () => {
			console.log("👂 No-op unsubscribe (Firebase not configured)")
		}
	}

	console.log("👂 Firebase auth listener active")
	return onAuthStateChanged(auth, (user) => {
		console.log("👂 Auth state changed:", user ? user.email : "No user")
		callback(user)
	})
}
