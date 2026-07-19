# Development Guide: DeliveryOS Driver

## Quick Answers to Your Questions

### 1. **"What does the offline alert mean?"**

✅ **Fixed**: The confusing alert is now removed. The app now silently switches to local mode when you toggle online/offline without Firebase configured.

### 2. **"When I go online, new delivery requests don't appear as full screen?"**

This is because **Firebase is not configured** in your app. Incoming orders come from Firestore, which requires Firebase credentials.

**To fix this, either:**

- **Option A**: Set up Firebase credentials (production path)
  - Copy `.env.example` to `.env`
  - Add your Firebase config values
  - Restart the app
- **Option B**: Use the new "Simulate Incoming Order" button (development path)
  - It appears at the bottom of the dashboard when Firebase isn't configured
  - Click it to test the full delivery flow locally
  - No backend needed

### 3. **"When I reload, why aren't I sent to login?"**

✅ **This is correct behavior**: The app remembers your login session across reloads using local storage. This is normal for driver apps — you stay logged in between app sessions.

If you want to test the login screen, you can:

1. Manually delete the session by clearing app data
2. Or add a "Logout" button to the profile (not yet added)

---

## How New Delivery Requests Work

### With Firebase Configured ✅

1. Driver goes online
2. Firestore streams new delivery orders to the app
3. New order triggers full-screen **NEW_DELIVERY_SCREEN**
4. Driver accepts/rejects within 30 seconds
5. Backend callable processes the acceptance

### Without Firebase (Current State) ⚠️

1. The Firestore listener doesn't work (no Firebase config)
2. No orders flow in
3. Use the **"Simulate Incoming Order"** button to test locally
4. The new delivery screen will open as if a real order arrived

---

## Testing the Full Flow (Without Firebase)

1. **Go online** — Toggle the driver status to "Online"
2. **Simulate an order** — Click "Simulate Incoming Order" button
3. **Accept delivery** — Press ACCEPT on the new-delivery screen
4. **Mark progress** — Click "I have arrived" on active-delivery screen
5. **Complete delivery** — Click "Mark delivered"

---

## Setting Up Firebase (Optional for Production)

1. Create a Firebase project at https://firebase.google.com
2. Get your project credentials from Firebase Console → Project Settings
3. Create `.env` file in project root:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=<your-value>
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-value>
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=<your-value>
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-value>
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-value>
   EXPO_PUBLIC_FIREBASE_APP_ID=<your-value>
   EXPO_PUBLIC_USE_EMULATORS=false
   ```
4. Restart the app — real orders will now flow in

---

## App Architecture

```
Home (Dashboard)
  ├─ Driver Status Toggle (Online/Offline)
  ├─ Stats Cards (Deliveries, Earnings)
  ├─ Active Delivery Card (or "No active delivery")
  └─ Test Button (when Firebase unconfigured)

  ↓ (when new order arrives)

New Delivery Screen (Full screen modal)
  ├─ Countdown timer (30 sec)
  ├─ Pickup & dropoff details
  └─ ACCEPT / REJECT buttons

  ↓ (if accepted)

Active Delivery Screen
  ├─ Map (pickup & dropoff)
  ├─ Delivery details
  ├─ "Open directions" button
  └─ "I have arrived" → "Mark delivered" progression

Back to Dashboard (when delivery complete)
```

---

## What Still Needs Firebase

| Feature                | With Firebase                 | Without Firebase          |
| ---------------------- | ----------------------------- | ------------------------- |
| Go online              | ✅ Syncs to backend           | ✅ Local only             |
| Receive orders         | ✅ Real orders from Firestore | ⚠️ Manual test button     |
| Accept orders          | ✅ Backend callable           | ⚠️ Local acceptance only  |
| Update delivery status | ✅ Syncs to backend           | ⚠️ Local only             |
| Earnings sync          | ✅ Pulled from backend        | ⚠️ Mock data only         |
| Driver location        | ✅ Syncs to Firestore         | ⚠️ Collected but not sent |
