// Firebase configuration file
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"

console.log("🔥 Firebase Config: Initializing...")

// Check if Firebase environment variables are present
const hasFirebaseConfig =
	process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
	process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
	process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

if (!hasFirebaseConfig) {
	console.warn(
		"⚠️ Firebase environment variables not found. Firebase authentication will not be available.",
	)
	console.log("💡 Guest login mode is available as an alternative.")
}

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
}

// Initialize Firebase only if config is present
let app: FirebaseApp | null = null
let auth: Auth | null = null

try {
	if (hasFirebaseConfig) {
		console.log("✅ Firebase config found, initializing Firebase...")
		app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
		auth = getAuth(app)
		console.log("✅ Firebase initialized successfully")
	} else {
		console.log("⚠️ Skipping Firebase initialization (no config)")
	}
} catch (error) {
	console.error("❌ Error initializing Firebase:", error)
	console.log("💡 Firebase features will be disabled. Guest login is still available.")
}

export { app, auth, hasFirebaseConfig }
