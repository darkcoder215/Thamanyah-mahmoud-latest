# Guest Login Feature - Technical Guide

## Overview

The Guest Login feature allows users to access all tools in the Thamanyah Web Tools application **without requiring Firebase authentication or environment variables**. This is particularly useful for:

- **Quick deployments** without setting up Firebase
- **Testing and development** without authentication overhead
- **Public access** to the tools without domain restrictions

## How It Works

### 1. Authentication Flow

```
User visits app → Login screen loads → Two options:
├─ Google Sign-in (Firebase OAuth - requires @thmanyah.com email)
└─ Continue as Guest (localStorage-based authentication)
```

### 2. Guest Mode Implementation

#### **Storage**
- Guest mode state is stored in `localStorage` with key `"guestMode": "true"`
- Persists across page refreshes
- Cleared on logout

#### **Mock User Object**
When guest mode is activated, a mock Firebase User object is created:
```typescript
{
  uid: "guest",
  email: "guest@local",
  displayName: "ضيف",
  photoURL: null
}
```

This ensures compatibility with all existing components that expect a User object.

### 3. Technical Implementation

#### **Modified Files**

##### **1. AuthContext.tsx** (`src/lib/context/AuthContext.tsx`)

**Added State:**
```typescript
const [isGuestMode, setIsGuestMode] = useState<boolean>(false)
```

**New Functions:**
- `signInAsGuest()` - Sets guest mode and creates mock user
- Updated `logout()` - Handles both Firebase and guest mode logout

**Initialization Logic:**
```typescript
useEffect(() => {
  // Check localStorage for guest mode
  const guestModeActive = localStorage.getItem("guestMode") === "true"

  if (guestModeActive) {
    // Set guest mode
    setIsGuestMode(true)
    setUser(guestUser)
    return
  }

  // Otherwise, subscribe to Firebase auth
  subscribeToAuthChanges((user) => {
    setUser(user)
  })
}, [])
```

##### **2. Login.tsx** (`src/components/Login.tsx`)

**Added UI Elements:**
- "Continue as Guest" button with UserOutlined icon
- Divider between Google and Guest login
- Info box explaining guest mode benefits

**Guest Login Handler:**
```typescript
const handleGuestSignIn = () => {
  console.log("👤 User clicked guest sign-in button")
  signInAsGuest()
  messageApi.success({ content: "تم تسجيل الدخول كضيف", duration: 2 })
}
```

##### **3. DefaultLayout.tsx** (`src/layout/DefaultLayout.tsx`)

**Enhanced User Display:**
- Shows "وضع الضيف" badge for guest users
- Different logout confirmation messages for guest vs. Firebase users
- Tooltip shows appropriate logout text based on mode

**Guest User Display:**
```typescript
<span className="font-semiBold font-8-sans me-2">
  أهلاً {user.displayName?.split(" ")[0]} {getGreetingEmoji()}
  {isGuestMode && (
    <span className="ms-2 rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
      وضع الضيف
    </span>
  )}
</span>
```

## Comprehensive Logging

All guest login operations are logged to the console with emoji indicators:

### Login Flow
```
🔐 AuthProvider: Initializing authentication...
👤 Guest mode detected in localStorage
✅ Guest user initialized: ضيف
```

### Guest Sign-in
```
🔐 Login component mounted
👤 User clicked guest sign-in button
👤 Guest login initiated...
💾 Guest mode saved to localStorage
✅ Guest login successful: ضيف
```

### Logout
```
🚪 Logout button clicked
✅ User confirmed logout
🚪 Logout initiated...
👤 Logging out from guest mode...
✅ Guest logout successful
```

### Authentication Status
```
✅ User authenticated: guest@local (Guest mode: Yes)
```

## Security Considerations

### What Guest Mode Allows
✅ Access to all tools (Job Offer Builder, Custom Templates, etc.)
✅ Use of localStorage for templates and data
✅ Print/export functionality
✅ Full UI access

### What Guest Mode Does NOT Allow
❌ Data stored in Firebase Firestore (if applicable)
❌ Server-side user authentication
❌ Access to protected backend APIs that require Firebase Auth tokens

### Important Notes
1. **No Data Persistence Across Devices**: Guest mode data is stored in localStorage, which is device-specific
2. **Not for Production User Data**: Guest mode should not be used for storing sensitive user information
3. **Firebase Features Disabled**: Any features that require Firebase Authentication will not work in guest mode

## Deployment Guide

### Option 1: Deploy with Guest Mode Only
1. Build the application without setting Firebase environment variables
2. Deploy to hosting platform
3. Users can access via "Continue as Guest" button
4. No Firebase configuration needed

### Option 2: Deploy with Both Authentication Methods
1. Set up Firebase environment variables:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
2. Deploy the application
3. Users can choose:
   - Google Sign-in (for @thmanyah.com emails)
   - Continue as Guest (for public access)

### Option 3: Bypass Login Screen Entirely (Legacy)
Set environment variable:
```env
NEXT_PUBLIC_PASS_LOGIN=true
```
This skips the login screen completely (not recommended for production).

## Testing Checklist

### Guest Login Functionality
- [ ] Click "Continue as Guest" button
- [ ] Verify "تم تسجيل الدخول كضيف" success message appears
- [ ] Confirm redirection to dashboard/home page
- [ ] Check localStorage contains `guestMode: "true"`
- [ ] Verify "وضع الضيف" badge appears in header
- [ ] Confirm user greeting shows "أهلاً ضيف"

### Tools Access (Guest Mode)
- [ ] Access Job Offer Builder
- [ ] Create and preview job offer
- [ ] Generate PDF successfully
- [ ] Access Custom Template Builder
- [ ] Upload Figma code and convert
- [ ] Upload images and map data fields
- [ ] Preview and generate custom template
- [ ] Save templates to localStorage
- [ ] Load saved templates

### Logout Functionality
- [ ] Click logout button
- [ ] Verify custom logout message: "هل أنت متأكد أنك تريد الخروج من وضع الضيف؟"
- [ ] Confirm logout
- [ ] Verify localStorage `guestMode` is removed
- [ ] Confirm redirection to login screen
- [ ] Verify no user data remains

### Page Refresh Persistence
- [ ] Login as guest
- [ ] Navigate to different pages
- [ ] Refresh the page (F5)
- [ ] Verify still logged in as guest
- [ ] Check localStorage still contains `guestMode: "true"`

### Google Sign-in (if Firebase configured)
- [ ] Click "سجّل دخولك بواسطة Google"
- [ ] Verify Google OAuth popup appears
- [ ] Login with @thmanyah.com email
- [ ] Confirm Firebase authentication
- [ ] Verify NO "وضع الضيف" badge appears
- [ ] Check localStorage does NOT contain `guestMode`

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if applicable)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Console Logging Guide

All logs use emoji prefixes for easy filtering:

| Emoji | Meaning | Example |
|-------|---------|---------|
| 🔐 | Authentication initialization | `🔐 AuthProvider: Initializing authentication...` |
| 👤 | Guest mode operation | `👤 Guest login initiated...` |
| 🔑 | Firebase authentication | `🔑 Subscribing to Firebase auth changes...` |
| ✅ | Success | `✅ Guest login successful: ضيف` |
| ❌ | Error | `❌ Firebase logout error: ...` |
| 💾 | Storage operation | `💾 Guest mode saved to localStorage` |
| 🚪 | Logout | `🚪 Logout button clicked` |
| ⏳ | Loading state | `⏳ Auth loading...` |
| 🔒 | Access control | `🔒 User not authenticated, showing login screen` |

### Filtering Console Logs

**Chrome DevTools:**
- Filter by emoji: Enter `👤` in the filter box to see only guest mode logs
- Filter by keyword: `"guest"` or `"Guest mode"`

**Firefox DevTools:**
- Use filter input: `guest` or specific emoji

## Error Handling

### Guest Login Errors

All errors are caught and logged with proper error messages:

```typescript
try {
  // Guest login logic
  localStorage.setItem("guestMode", "true")
  setIsGuestMode(true)
  setUser(guestUser)
  console.log("✅ Guest login successful:", guestUser.displayName)
} catch (err) {
  console.error("❌ Error during guest login:", err)
  setError("حدث خطأ أثناء تسجيل الدخول كضيف")
}
```

### Common Issues and Solutions

#### Issue: Guest mode doesn't persist after refresh
**Cause:** localStorage is disabled or blocked
**Solution:**
1. Check browser settings allow localStorage
2. Verify not in incognito/private mode
3. Check console for localStorage errors

#### Issue: Can't logout from guest mode
**Cause:** localStorage.removeItem() failed
**Solution:**
1. Check console for errors
2. Manually clear localStorage in DevTools
3. Close and reopen browser

#### Issue: "Continue as Guest" button doesn't work
**Cause:** JavaScript error in signInAsGuest function
**Solution:**
1. Open console and check for errors
2. Verify AuthContext is properly imported
3. Check localStorage is accessible

## Feature Compatibility Matrix

| Feature | Google Login | Guest Login | No Login (PASS_LOGIN) |
|---------|-------------|-------------|----------------------|
| Job Offer Builder | ✅ | ✅ | ✅ |
| Custom Templates | ✅ | ✅ | ✅ |
| PDF Generation | ✅ | ✅ | ✅ |
| localStorage Templates | ✅ | ✅ | ✅ |
| Firebase Firestore | ✅ | ❌ | ❌ |
| User Display Name | ✅ (Real name) | ✅ ("ضيف") | ❌ (No display) |
| Logout Functionality | ✅ | ✅ | N/A |
| Session Persistence | ✅ | ✅ (localStorage) | ✅ |

## API Reference

### AuthContext Additions

```typescript
interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  isGuestMode: boolean              // NEW: Indicates if in guest mode
  signInWithGoogleProvider: () => Promise<void>
  signInAsGuest: () => void         // NEW: Activate guest mode
  logout: () => Promise<void>       // UPDATED: Handles guest logout
  clearError: () => void
}
```

### Functions

#### `signInAsGuest()`
Activates guest mode and creates a mock user.

**Parameters:** None

**Returns:** `void`

**Side Effects:**
- Sets `localStorage.guestMode = "true"`
- Sets `isGuestMode = true`
- Creates mock user object
- Sets `loading = false`

**Example:**
```typescript
const { signInAsGuest } = useAuth()
signInAsGuest() // User is now in guest mode
```

#### `logout()` (Updated)
Logs out the user (Firebase or guest).

**Parameters:** None

**Returns:** `Promise<void>`

**Behavior:**
- If `isGuestMode === true`: Removes localStorage entry and clears state
- If `isGuestMode === false`: Calls Firebase signOut()

**Example:**
```typescript
const { logout, isGuestMode } = useAuth()
await logout() // Handles both guest and Firebase logout
```

## Backward Compatibility

### Existing Code Compatibility
✅ **All existing components continue to work unchanged**

The guest login feature is designed to be **100% backward compatible**:

1. **Existing Firebase authentication still works** exactly as before
2. **No changes required** to components that use `useAuth()` hook
3. **User object structure** remains compatible with Firebase User type
4. **All existing features** (Job Offer Builder, Custom Templates) work identically in both modes

### Migration Path

**Before Guest Login:**
```typescript
const { user, loading } = useAuth()
// Only Firebase authentication
```

**After Guest Login:**
```typescript
const { user, loading, isGuestMode } = useAuth()
// Works with both Firebase AND guest authentication
// Optional: Check isGuestMode if needed for conditional logic
```

No changes required to existing code unless you want to add guest-specific features!

## Future Enhancements

Potential improvements to the guest login feature:

1. **Guest Session Expiration**: Auto-logout after N hours of inactivity
2. **Guest Data Export**: Allow exporting guest templates before logout
3. **Guest to User Upgrade**: Convert guest session to authenticated session
4. **Anonymous Analytics**: Track guest usage (privacy-compliant)
5. **Guest Limitations UI**: Show what features require full authentication
6. **Multi-Device Guest Sync**: Optional cloud sync for guest data (via unique ID)

## Support and Troubleshooting

### Debug Mode

Enable verbose logging by adding to console:
```javascript
localStorage.setItem('debug', 'true')
```

### Common Debug Commands

```javascript
// Check current auth state
console.log(localStorage.getItem('guestMode'))

// Force guest mode
localStorage.setItem('guestMode', 'true')
location.reload()

// Clear guest mode
localStorage.removeItem('guestMode')
location.reload()

// View all localStorage
console.table(localStorage)
```

### Getting Help

If you encounter issues:
1. Check browser console for error messages
2. Verify localStorage is enabled in browser
3. Test in incognito mode to rule out extension conflicts
4. Clear browser cache and cookies
5. Review this guide's troubleshooting section

---

## Summary

The Guest Login feature provides a **seamless, zero-configuration** authentication alternative that:

✅ Requires **no Firebase setup**
✅ Works **immediately after deployment**
✅ Maintains **100% feature compatibility**
✅ Includes **comprehensive logging**
✅ Provides **proper error handling**
✅ **Doesn't break existing code**

Perfect for quick deployments, testing, and public access scenarios!

---

**Last Updated:** 2025-01-15
**Version:** 1.0.0
**Author:** Thamanyah Development Team
