# Backend Connection Requirements

## Short Answer

**You cannot test delivery status updates without Firebase configured.**

The error "Firebase is not configured" means the app **cannot connect to any backend**. This is not a development mode — it's a requirement to work with the real system.

---

## What You Need

### 1. **Backend must be deployed first**

Your backend engineer needs to set up:

- ✅ Firebase project (Firestore + Cloud Functions)
- ✅ Firestore collections: `drivers`, `orders`
- ✅ Cloud Functions: `accept_order`, `update_order_status`, `on_order_created` (trigger)
- ✅ FCM setup for push notifications

### 2. **Frontend must have Firebase credentials**

Create a `.env` file in the project root with Firebase values from your Firebase Console:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Then **restart the app**.

---

## Testing the Delivery Flow

### With Firebase ✅ (PRODUCTION)

1. Driver goes **Online**
2. Backend sends real orders via FCM
3. Full-screen **New Delivery Request** appears automatically
4. Driver clicks **ACCEPT**
5. Backend callable `accept_order()` executes
6. Driver sees active delivery screen
7. Click **"I have arrived"** → backend callable `update_order_status()` executes
8. Click **"Mark delivered"** → backend confirms completion

### Without Firebase ❌ (CANNOT TEST)

1. No incoming orders flow in (Firestore listener returns empty)
2. Clicking delivery status buttons fails with:
   - _"Firebase is not configured. Add EXPO*PUBLIC_FIREBASE*_ env vars to connect to backend."\*
3. The app is **waiting for backend connection**, not running offline

---

## Why Not "Offline Mode"?

This is **not a delivery app with offline support**. According to your spec:

- All orders stream from Firestore in real-time
- All status updates go to backend
- Driver earnings sync from backend

These features **require Firebase** — there's no graceful fallback.

---

## Checklist Before Testing

- [ ] Backend engineer deployed Cloud Functions
- [ ] Firestore collections exist with test data
- [ ] FCM is configured and functional
- [ ] You have Firebase credentials (.env file)
- [ ] Restart app after adding .env
- [ ] Login with test driver account
- [ ] Backend is sending test orders to your driver's zones

---

## Error Messages Explained

| Error                                    | Meaning                                                                    |
| ---------------------------------------- | -------------------------------------------------------------------------- |
| "Firebase is not configured"             | `.env` file missing or env vars not set                                    |
| "Order already taken"                    | Another driver accepted it first (race condition prevented by transaction) |
| "This delivery is no longer available"   | Order expired or cancelled                                                 |
| "The backend could not update the order" | Cloud Function `update_order_status` failed                                |
