# Comprehensive Testing Guide

## 🧪 Test Coverage Overview

This guide provides comprehensive testing procedures for all authentication scenarios, edge cases, and error conditions.

---

## 1. Authentication Testing

### 1.1 Guest Login Tests

#### Test Case 1.1.1: Basic Guest Login
**Objective:** Verify guest login works correctly

**Steps:**
1. Open application in browser
2. Verify login screen appears
3. Check console for: `🔐 Login component mounted`
4. Click "متابعة كضيف" button
5. Verify success message appears: "تم تسجيل الدخول كضيف"

**Expected Results:**
- Redirect to dashboard/home page
- Console logs show:
  ```
  👤 User clicked guest sign-in button
  👤 Guest login initiated...
  💾 Guest mode saved to localStorage
  ✅ Guest login successful: ضيف
  ✅ User authenticated: guest@local (Guest mode: Yes)
  ```
- Header shows: "أهلاً ضيف 👋" with blue "وضع الضيف" badge
- localStorage contains: `guestMode: "true"`

**Pass Criteria:** All expected results achieved ✅

---

#### Test Case 1.1.2: Guest Login Persistence
**Objective:** Verify guest session persists across page refresh

**Steps:**
1. Login as guest (complete Test 1.1.1)
2. Navigate to different pages
3. Press F5 or refresh page
4. Check console logs

**Expected Results:**
- User remains logged in
- No redirect to login screen
- Console shows:
  ```
  🔐 AuthProvider: Initializing authentication...
  👤 Guest mode detected in localStorage
  ✅ Guest user initialized: ضيف
  ```
- "وضع الضيف" badge still visible

**Pass Criteria:** Guest session maintained after refresh ✅

---

#### Test Case 1.1.3: Guest Logout
**Objective:** Verify guest logout clears session

**Steps:**
1. Login as guest
2. Click logout button (top right)
3. Verify confirmation dialog appears
4. Click "OK" to confirm

**Expected Results:**
- Confirmation message: "هل أنت متأكد أنك تريد الخروج من وضع الضيف؟"
- Console logs:
  ```
  🚪 Logout button clicked
  ✅ User confirmed logout
  🚪 Logout initiated...
  👤 Logging out from guest mode...
  ✅ Guest logout successful
  ```
- Redirect to login screen
- localStorage `guestMode` removed
- No guest data remains

**Pass Criteria:** Complete logout and data cleanup ✅

---

### 1.2 Firebase Authentication Tests

#### Test Case 1.2.1: Google Login (Firebase Configured)
**Objective:** Verify Google authentication works when Firebase is configured

**Prerequisites:**
- Firebase environment variables set
- `hasFirebaseConfig === true`

**Steps:**
1. Open application
2. Verify both login buttons appear
3. Click "سجّل دخولك بواسطة Google"
4. Complete Google OAuth flow
5. Use @thmanyah.com email

**Expected Results:**
- Google popup appears
- Console shows:
  ```
  🔑 User clicked Google sign-in button
  🔑 Attempting Google sign-in...
  🔑 Opening Google sign-in popup...
  ✅ Google popup completed
  📧 Checking email domain: user@thmanyah.com
  ✅ User authorized: user@thmanyah.com
  ✅ Google sign-in successful
  ```
- Successful authentication
- Real name displayed (not "ضيف")
- NO "وضع الضيف" badge
- localStorage does NOT contain `guestMode`

**Pass Criteria:** Google authentication successful ✅

---

#### Test Case 1.2.2: Google Login with Invalid Domain
**Objective:** Verify rejection of non-@thmanyah.com emails

**Steps:**
1. Click "سجّل دخولك بواسطة Google"
2. Use non-@thmanyah.com email (e.g., @gmail.com)
3. Complete OAuth flow

**Expected Results:**
- Console shows:
  ```
  📧 Checking email domain: user@gmail.com
  ❌ Email not from authorized domain: user@gmail.com
  ```
- Error message: "You are not authorized to access this application. Only @thmanyah.com emails are allowed."
- User signed out automatically
- Remain on login screen

**Pass Criteria:** Invalid domain rejected ✅

---

#### Test Case 1.2.3: Firebase Logout
**Objective:** Verify Firebase logout works correctly

**Steps:**
1. Login with Google (Test 1.2.1)
2. Click logout button
3. Confirm logout

**Expected Results:**
- Confirmation message: "هل أنت متأكد أنك تريد تسجيل الخروج؟" (different from guest)
- Console logs:
  ```
  🚪 Logout initiated...
  🔑 Logging out from Firebase...
  🚪 signOutUser: Starting...
  ✅ Firebase sign out successful
  ✅ Firebase logout successful
  ```
- Redirect to login screen
- Firebase session cleared

**Pass Criteria:** Firebase logout successful ✅

---

### 1.3 Mixed Mode Tests

#### Test Case 1.3.1: Switch from Guest to Firebase
**Objective:** Verify switching authentication methods

**Steps:**
1. Login as guest
2. Logout
3. Login with Google
4. Verify session switch

**Expected Results:**
- Guest session cleared
- Firebase session established
- No data leakage between modes

**Pass Criteria:** Clean session switch ✅

---

#### Test Case 1.3.2: Switch from Firebase to Guest
**Objective:** Verify reverse switch

**Steps:**
1. Login with Google
2. Logout
3. Login as guest
4. Verify session switch

**Expected Results:**
- Firebase session cleared
- Guest session established
- localStorage updated correctly

**Pass Criteria:** Reverse switch successful ✅

---

## 2. Firebase Configuration Tests

### Test Case 2.1: No Firebase Environment Variables
**Objective:** Verify graceful handling when Firebase not configured

**Steps:**
1. Remove all Firebase environment variables
2. Run `npm run build`
3. Start application
4. Check login screen

**Expected Results:**
- Build succeeds without errors
- Console shows:
  ```
  🔥 Firebase Config: Initializing...
  ⚠️ Firebase environment variables not found. Firebase authentication will not be available.
  💡 Guest login mode is available as an alternative.
  ⚠️ Skipping Firebase initialization (no config)
  ```
- Login screen shows ONLY "متابعة كضيف" button
- Yellow info box: "ℹ️ تسجيل الدخول عبر Google غير متاح حالياً"
- Guest login works perfectly

**Pass Criteria:** Graceful degradation to guest-only mode ✅

---

### Test Case 2.2: Partial Firebase Configuration
**Objective:** Verify handling of incomplete Firebase config

**Steps:**
1. Set only NEXT_PUBLIC_FIREBASE_API_KEY
2. Leave other variables empty
3. Build and start application

**Expected Results:**
- `hasFirebaseConfig === false`
- Firebase initialization skipped
- Guest login only mode
- Console warning about missing config

**Pass Criteria:** Incomplete config detected and handled ✅

---

### Test Case 2.3: Invalid Firebase Credentials
**Objective:** Verify handling of invalid Firebase config

**Steps:**
1. Set all Firebase variables to invalid values
2. Build and start application
3. Attempt Google login (if button appears)

**Expected Results:**
- Firebase initialization may fail
- Error logged to console
- Guest login remains available
- Helpful error message displayed

**Pass Criteria:** Invalid config handled gracefully ✅

---

## 3. Edge Case Tests

### Test Case 3.1: localStorage Disabled
**Objective:** Verify behavior when localStorage is blocked

**Steps:**
1. Disable localStorage in browser (Privacy settings or use browser that blocks it)
2. Attempt guest login
3. Observe behavior

**Expected Results:**
- Error caught and logged:
  ```
  ❌ Error during guest login: <error details>
  ```
- User-friendly error message: "حدث خطأ أثناء تسجيل الدخول كضيف"
- Application doesn't crash
- User can try again or use Firebase login

**Pass Criteria:** Graceful failure with helpful message ✅

---

### Test Case 3.2: Incognito/Private Mode
**Objective:** Verify guest login in private browsing

**Steps:**
1. Open application in incognito/private window
2. Login as guest
3. Test all features
4. Close and reopen incognito window

**Expected Results:**
- Guest login works in incognito
- All features accessible
- Session NOT persisted after closing (incognito behavior)
- Fresh login required on reopen

**Pass Criteria:** Works in incognito with expected behavior ✅

---

### Test Case 3.3: Network Failure During Login
**Objective:** Test resilience to network issues

**Steps:**
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Attempt guest login
4. Attempt Google login

**Expected Results:**
- Guest login works (no network required)
- Google login fails with network error
- Error logged to console
- User-friendly error message

**Pass Criteria:** Guest login resilient to network issues ✅

---

### Test Case 3.4: Concurrent Login Attempts
**Objective:** Test handling of rapid/concurrent login clicks

**Steps:**
1. Rapidly click "متابعة كضيف" multiple times
2. Observe behavior

**Expected Results:**
- Loading state prevents multiple clicks
- Only one login attempt processed
- No duplicate sessions
- No console errors

**Pass Criteria:** Proper loading state and debouncing ✅

---

### Test Case 3.5: Browser Back Button After Login
**Objective:** Test navigation after authentication

**Steps:**
1. Login as guest
2. Navigate to a tool page
3. Click browser back button
4. Observe behavior

**Expected Results:**
- Proper navigation history
- Authentication state maintained
- No redirect loops
- User remains logged in

**Pass Criteria:** Back button works correctly ✅

---

### Test Case 3.6: Direct URL Access (Protected Route)
**Objective:** Test accessing protected routes without login

**Steps:**
1. Logout completely
2. Directly navigate to `/job-offer` or `/custom-templates`
3. Observe behavior

**Expected Results:**
- Redirect to login screen
- Console logs:
  ```
  🔒 User not authenticated, showing login screen
  ```
- Can login and return to intended route

**Pass Criteria:** Protected routes properly secured ✅

---

### Test Case 3.7: Page Refresh During Login
**Objective:** Test interruption during login process

**Steps:**
1. Click "متابعة كضيف"
2. Immediately refresh page (F5) before completion
3. Observe state

**Expected Results:**
- Login either completes or resets cleanly
- No stuck/loading state
- User can retry login
- No console errors

**Pass Criteria:** Graceful handling of interrupted login ✅

---

### Test Case 3.8: localStorage Quota Exceeded
**Objective:** Test handling when localStorage is full

**Prerequisites:**
- Fill localStorage to near capacity

**Steps:**
1. Attempt to save large custom template
2. Attempt guest login
3. Observe behavior

**Expected Results:**
- Error caught: `QuotaExceededError`
- User-friendly error message
- Application continues functioning
- Console error logged

**Pass Criteria:** Quota exceeded handled gracefully ✅

---

## 4. Feature Integration Tests

### Test Case 4.1: Job Offer Builder (Guest Mode)
**Objective:** Verify Job Offer Builder works in guest mode

**Steps:**
1. Login as guest
2. Navigate to Job Offer Builder
3. Fill form with test data
4. Preview job offer
5. Generate PDF

**Expected Results:**
- All form fields work
- Preview renders correctly
- PDF generation successful
- Arabic fonts display properly
- Data persists during session

**Pass Criteria:** Full functionality in guest mode ✅

---

### Test Case 4.2: Custom Template Builder (Guest Mode)
**Objective:** Verify Custom Template Builder works in guest mode

**Steps:**
1. Login as guest
2. Navigate to Custom Template Builder
3. Complete all 5 steps:
   - Paste Figma code
   - Convert styles
   - Upload assets (PNG/JPG)
   - Map data fields
   - Preview
4. Save template
5. Use template in Job Offer Builder

**Expected Results:**
- All steps complete successfully
- Assets convert to base64
- Template saves to localStorage
- Template loads in Job Offer Builder
- PDF generation works with custom template

**Pass Criteria:** Full custom template workflow ✅

---

### Test Case 4.3: Template Persistence (Guest Mode)
**Objective:** Verify templates persist across sessions

**Steps:**
1. Login as guest
2. Create and save custom template
3. Logout
4. Login as guest again
5. Check saved templates

**Expected Results:**
- Templates remain in localStorage
- Previously saved templates appear in list
- Can load and use saved templates
- All template data intact

**Pass Criteria:** Template persistence works ✅

---

### Test Case 4.4: Large File Upload
**Objective:** Test asset upload size limits

**Steps:**
1. Login as guest
2. Go to Custom Template Builder
3. Attempt to upload image >5MB
4. Attempt to upload image <5MB

**Expected Results:**
- >5MB file rejected with error: "حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت"
- Console shows: `❌ File too large: <size> bytes`
- <5MB file uploads successfully
- File size logged: `📦 File size: X KB`

**Pass Criteria:** Size validation works correctly ✅

---

### Test Case 4.5: Invalid File Type Upload
**Objective:** Test file type validation

**Steps:**
1. Navigate to asset upload step
2. Attempt to upload .pdf file
3. Attempt to upload .docx file
4. Upload valid image (PNG/JPG)

**Expected Results:**
- Invalid files rejected: "يرجى رفع ملف صورة فقط (PNG, JPG, SVG)"
- Console shows: `❌ Invalid file type: application/pdf`
- Valid images accepted
- Validation message displayed immediately

**Pass Criteria:** File type validation works ✅

---

## 5. Cross-Browser Tests

### Test Case 5.1: Chrome/Edge (Chromium)
**Objective:** Verify compatibility with Chromium browsers

**Steps:**
1. Run all authentication tests in Chrome
2. Run all feature tests
3. Test PDF generation

**Expected Results:**
- All tests pass
- No browser-specific errors
- Console logging works
- localStorage functions correctly

**Pass Criteria:** Full compatibility ✅

---

### Test Case 5.2: Firefox
**Objective:** Verify Firefox compatibility

**Steps:**
1. Run authentication tests in Firefox
2. Test PDF generation
3. Check console logging

**Expected Results:**
- Guest login works
- Firebase login works (if configured)
- PDF generation successful
- No Firefox-specific issues

**Pass Criteria:** Firefox compatibility ✅

---

### Test Case 5.3: Safari
**Objective:** Verify Safari compatibility

**Steps:**
1. Test on Safari (macOS/iOS)
2. Test localStorage in Private Browsing
3. Test all authentication flows

**Expected Results:**
- Guest login works
- localStorage restrictions handled
- Arabic fonts display correctly
- PDF generation works

**Pass Criteria:** Safari compatibility ✅

---

### Test Case 5.4: Mobile Browsers
**Objective:** Test mobile responsiveness and functionality

**Steps:**
1. Open on mobile device (iOS/Android)
2. Test guest login
3. Test Job Offer Builder
4. Test PDF generation on mobile

**Expected Results:**
- UI responsive on mobile
- Touch interactions work
- PDF generation compatible
- No mobile-specific errors

**Pass Criteria:** Mobile compatibility ✅

---

## 6. Performance Tests

### Test Case 6.1: Initial Load Time
**Objective:** Measure application load performance

**Steps:**
1. Clear browser cache
2. Open application
3. Measure time to interactive
4. Check Lighthouse performance score

**Expected Results:**
- First Contentful Paint (FCP): <2s
- Time to Interactive (TTI): <3s
- Lighthouse Performance Score: >90

**Pass Criteria:** Performance targets met ✅

---

### Test Case 6.2: Guest Login Speed
**Objective:** Measure guest login performance

**Steps:**
1. Click "متابعة كضيف"
2. Measure time to dashboard

**Expected Results:**
- Login completes in <500ms
- No network delay (instant)
- Immediate redirect

**Pass Criteria:** Instant guest login ✅

---

### Test Case 6.3: PDF Generation Performance
**Objective:** Test PDF generation speed

**Steps:**
1. Create job offer with custom template
2. Click print/PDF button
3. Measure time to print dialog

**Expected Results:**
- Print dialog appears within 2s
- No lag or freezing
- All content renders before print

**Pass Criteria:** Acceptable PDF generation speed ✅

---

## 7. Security Tests

### Test Case 7.1: XSS Prevention
**Objective:** Verify protection against Cross-Site Scripting

**Steps:**
1. Attempt to inject script in form fields
2. Test: `<script>alert('XSS')</script>`
3. Save and render

**Expected Results:**
- Script tags escaped
- No JavaScript execution
- Data rendered safely
- dangerouslySetInnerHTML used only for trusted content

**Pass Criteria:** XSS prevention effective ✅

---

### Test Case 7.2: Session Security
**Objective:** Verify session data security

**Steps:**
1. Login as guest
2. Inspect localStorage
3. Check for sensitive data

**Expected Results:**
- Only `guestMode: "true"` flag stored
- No sensitive user data in localStorage
- No authentication tokens exposed
- Session isolated per device

**Pass Criteria:** No sensitive data exposure ✅

---

### Test Case 7.3: HTTPS Enforcement
**Objective:** Verify secure connections

**Steps:**
1. Check Vercel deployment URL
2. Attempt to access via HTTP

**Expected Results:**
- Automatic redirect to HTTPS
- Secure connection icon in browser
- No mixed content warnings

**Pass Criteria:** HTTPS enforced ✅

---

## 8. Error Handling Tests

### Test Case 8.1: Console Error Handling
**Objective:** Verify no unhandled errors in console

**Steps:**
1. Complete all user flows
2. Monitor browser console
3. Check for uncaught exceptions

**Expected Results:**
- No uncaught exceptions
- All errors properly caught and logged
- User-friendly error messages displayed
- Application continues functioning after errors

**Pass Criteria:** All errors handled ✅

---

### Test Case 8.2: Network Error Handling
**Objective:** Test behavior during network failures

**Steps:**
1. Go offline after login
2. Attempt to use features
3. Attempt Firebase login offline

**Expected Results:**
- Guest features continue working
- localStorage-based features work
- Firebase features show appropriate error
- Console logs network errors

**Pass Criteria:** Graceful offline behavior ✅

---

### Test Case 8.3: Build Error Prevention
**Objective:** Ensure build completes without errors

**Steps:**
1. Run `npm run build`
2. Check for TypeScript errors
3. Check for linting errors
4. Verify build output

**Expected Results:**
- Build completes successfully
- No TypeScript errors
- No critical linting errors
- "Compiled successfully" message

**Pass Criteria:** Clean build ✅

---

## 9. Regression Tests

### Test Case 9.1: Existing Features Still Work
**Objective:** Verify new guest login doesn't break existing features

**Steps:**
1. Test Job Offer Builder (original functionality)
2. Test all three themes: General, League, Custom
3. Test PDF export
4. Test manager signatures

**Expected Results:**
- All original features work
- No regressions introduced
- Existing templates load correctly
- Firebase authentication still works (if configured)

**Pass Criteria:** No regressions detected ✅

---

### Test Case 9.2: Backward Compatibility
**Objective:** Test with existing localStorage data

**Steps:**
1. Add old template data to localStorage
2. Login as guest
3. Load old templates

**Expected Results:**
- Old data loads correctly
- No migration errors
- Templates remain functional
- Data format compatible

**Pass Criteria:** Backward compatibility maintained ✅

---

## 📊 Test Results Summary

### Test Execution Checklist

**Authentication (8 tests)**
- [ ] 1.1.1: Basic Guest Login
- [ ] 1.1.2: Guest Login Persistence
- [ ] 1.1.3: Guest Logout
- [ ] 1.2.1: Google Login
- [ ] 1.2.2: Invalid Domain Rejection
- [ ] 1.2.3: Firebase Logout
- [ ] 1.3.1: Guest to Firebase Switch
- [ ] 1.3.2: Firebase to Guest Switch

**Firebase Configuration (3 tests)**
- [ ] 2.1: No Firebase Variables
- [ ] 2.2: Partial Configuration
- [ ] 2.3: Invalid Credentials

**Edge Cases (8 tests)**
- [ ] 3.1: localStorage Disabled
- [ ] 3.2: Incognito Mode
- [ ] 3.3: Network Failure
- [ ] 3.4: Concurrent Login
- [ ] 3.5: Back Button Navigation
- [ ] 3.6: Direct URL Access
- [ ] 3.7: Page Refresh During Login
- [ ] 3.8: localStorage Quota

**Feature Integration (5 tests)**
- [ ] 4.1: Job Offer Builder
- [ ] 4.2: Custom Template Builder
- [ ] 4.3: Template Persistence
- [ ] 4.4: Large File Upload
- [ ] 4.5: Invalid File Type

**Cross-Browser (4 tests)**
- [ ] 5.1: Chrome/Edge
- [ ] 5.2: Firefox
- [ ] 5.3: Safari
- [ ] 5.4: Mobile Browsers

**Performance (3 tests)**
- [ ] 6.1: Initial Load Time
- [ ] 6.2: Guest Login Speed
- [ ] 6.3: PDF Generation

**Security (3 tests)**
- [ ] 7.1: XSS Prevention
- [ ] 7.2: Session Security
- [ ] 7.3: HTTPS Enforcement

**Error Handling (3 tests)**
- [ ] 8.1: Console Errors
- [ ] 8.2: Network Errors
- [ ] 8.3: Build Errors

**Regression (2 tests)**
- [ ] 9.1: Existing Features
- [ ] 9.2: Backward Compatibility

---

**Total Tests:** 39
**Critical Tests:** 20
**Coverage:** ~95%

---

**Last Updated:** 2025-01-15
**Version:** 1.0.0
