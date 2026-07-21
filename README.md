# DeliveryOS — Driver App

React Native (Expo) driver app for the DeliveryOS dispatch system. Handles driver login, going online/offline, receiving and accepting delivery requests in real time, active-delivery navigation, and earnings tracking.

Built for the DeliveryOS Full-Stack Team Challenge. This repo is the **frontend**; it talks to the [backend Cloud Functions + Firestore repo](#) for dispatch, order acceptance, and earnings.

## Tech Stack

- **Expo** (React Native 0.85, React 19) with TypeScript
- **Redux Toolkit** for state (session, driver status, active order, earnings)
- **React Navigation** (native stack)
- **Firebase**: Auth (phone OTP), Firestore (real-time listeners), Cloud Functions (callable), Cloud Messaging (push)
- **Mapbox** (`@rnmapbox/maps`) for the pickup/dropoff map on the Active Delivery screen, with a deep link to Google Maps for turn-by-turn directions
- **NativeWind** (Tailwind for React Native) for styling
- **AsyncStorage** for session persistence (auto-login)

## Project Structure

```
src/
  screens/            Login, HomeDashboard, NewDeliveryRequest, ActiveDelivery, Earnings
  components/
    delivery-request/ AddressCard, CountdownTimer (server-synced)
    driver-status/    DriverStatusToggle (optimistic online/offline)
    map/               DeliveryMap, MapMarker
    navigation/        AppTabBar
  services/
    firebase.ts              Firebase init + emulator wiring
    AuthService.ts            Phone OTP login, session persistence
    OrderService.ts            listenForOrders/listenForOrder, acceptOrder, updateOrderStatus
    DriverService.ts           toggleOnlineStatus, listenToDriver, getTodayStats
    PushNotificationService.ts FCM token registration + foreground/background handlers
  store/               Redux slices: session, driverStatus, activeOrder, earnings
  navigation/           RootNavigator, navigationRef (for navigating from FCM handlers)
  utils/
    serverTime.ts        calculateRemainingTime() — server-timestamp-based countdown
    deepLink.ts           Google Maps navigation deep link
  types/                Shared Order / Driver / Zone types
```

## Prerequisites

- Node.js 20+
- npm
- A Firebase project with **Authentication (Phone)**, **Firestore**, **Cloud Functions**, and **Cloud Messaging** enabled — use the same project as the [backend repo](#) so the driver app and dispatch functions share data
- Android Studio (Android emulator/device) and/or Xcode (iOS simulator) — this app uses native Firebase modules, so it **cannot run in Expo Go**; it must be run as a development build
- (Optional, recommended for local dev) [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite) running for Firestore, Functions, and Auth — the app auto-connects to it in dev, see below

## Setup

1. **Clone and install**

   ```bash
   git clone <this-repo-url>
   cd DeliveryOs-Driver
   npm install
   ```

2. **Firebase config**

   - Download `google-services.json` from your Firebase project (Project Settings → Android app) and place it at the repo root (it's git-ignored — never commit it).
   - Android package name must match `app.config.ts` (`com.walmond.myexpoapp`) or be updated to match your Firebase Android app registration.

3. **Environment variables**

   Copy `.env.example` to `.env` and fill in your Firebase web config values (found in Firebase Console → Project Settings → General → Your apps):

   ```bash
   cp .env.example .env
   ```

   | Variable | Description |
   |---|---|
   | `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase Web API key |
   | `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
   | `EXPO_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |
   | `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | For FCM |
   | `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
   | `EXPO_PUBLIC_EMULATOR_HOST` | Host used to reach the Firebase emulators from a device/simulator (`localhost` for iOS simulator; your machine's LAN IP for a physical device or Android emulator using `10.0.2.2`) |
   | `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox public token, used at runtime by `@rnmapbox/maps` |
   | `MAPBOX_DOWNLOADS_TOKEN` | Mapbox **secret** downloads token (scope: `DOWNLOADS:READ`), used only at build time by the Mapbox Gradle/CocoaPods plugin |

   In development (`__DEV__`), [`src/services/firebase.ts`](src/services/firebase.ts) automatically points Firestore, Functions, and Auth at the local emulators on `EXPO_PUBLIC_EMULATOR_HOST`. To hit production Firebase instead, run a release build or strip the emulator wiring for your test.

4. **Prebuild native projects**

   ```bash
   npx expo prebuild
   ```

## Running the App

```bash
npm run android   # build + run on Android emulator/device
npm run ios       # build + run on iOS simulator (macOS only)
npm start         # start the Metro bundler for an already-installed dev build
```

Login uses a hardcoded OTP flow for the sprint — request a code for any phone number, then confirm using Firebase's phone auth test number/code configured in your Firebase project (Authentication → Sign-in method → Phone → Phone numbers for testing), e.g. `+250700000000` / `123456`.

## Architecture Notes

- **Auth & session**: `AuthService` wraps Firebase phone auth and persists `{ driverId, authToken }` to AsyncStorage on login. `App.tsx` restores the session on launch and gates `RootNavigator` between the `Login` stack and the authenticated stack.
- **Realtime data**: `DriverService.listenToDriver` and `OrderService.listenFor*` are thin wrappers around Firestore `onSnapshot` listeners, mapped into typed `Driver`/`Order` objects — no polling anywhere.
- **Optimistic online/offline toggle**: `DriverStatusToggle` flips local UI state immediately, fires `DriverService.toggleOnlineStatus`, and rolls back the UI if the Firestore update fails.
- **Order acceptance**: routed through the `accept_order` Cloud Function (HTTPS callable) rather than a direct Firestore write, so the backend's transactional double-booking check is the single source of truth. The app surfaces `network` vs `business` (e.g. "already taken") failures differently.
- **Server-synced countdown**: `NewDeliveryRequestScreen`'s 30s timer is derived every tick from `calculateRemainingTime(order.createdAt)` (`src/utils/serverTime.ts`), which diffs the device clock against the Firestore-issued `createdAt` rather than counting down locally — protects against device clock drift. The screen also locks the hardware back button while a request is active.
- **Push notifications**: `PushNotificationService.registerBackgroundHandler()` is called at module scope in `App.tsx` (not inside a component) so `setBackgroundMessageHandler` is wired before the app finishes mounting, per Firebase's requirement for background/killed-state delivery. A `NEW_ORDER` data message with `orderId` + `createdAt` navigates straight to `NewDeliveryRequestScreen` via `navigationRef`, working whether the app is foregrounded, backgrounded, or opened from a terminated state via `getInitialNotification`.
- **Navigation on Active Delivery**: rather than embedding turn-by-turn directions, "Navigate" deep-links out to Google Maps (`src/utils/deepLink.ts`) — the in-app Mapbox map just shows pickup/dropoff pins and the current leg.
- **Zones & earnings**: zone→fee mapping lives in `OrderService.getZoneFee` and is used both for the Earnings screen and for computing "today's" stats client-side from delivered orders; the authoritative wallet increment happens server-side in the backend's `on_delivery_completed` function.

## Known Issues

- This app **requires a development build** — it will not run inside Expo Go because of native Firebase and Mapbox modules.
