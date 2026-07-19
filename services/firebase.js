// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getApp, getApps, initializeApp } from 'firebase/app';
// import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
// import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
// import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

// const firebaseConfig = {
//   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
// };

// export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

// export const firebaseApp = isFirebaseConfigured
//   ? getApps().length
//     ? getApp()
//     : initializeApp(firebaseConfig)
//   : null;

// function createAuth() {
//   if (!firebaseApp) return null;

//   try {
//     return initializeAuth(firebaseApp, {
//       persistence: getReactNativePersistence(AsyncStorage),
//     });
//   } catch {
//     return getAuth(firebaseApp);
//   }
// }

// export const auth = createAuth();
// export const db = firebaseApp ? getFirestore(firebaseApp) : null;
// export const functions = firebaseApp ? getFunctions(firebaseApp) : null;

// if (db && functions && process.env.EXPO_PUBLIC_USE_EMULATORS === 'true') {
//   const host = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST || '10.0.2.2';
//   try {
//     connectFirestoreEmulator(db, host, 8080);
//     connectFunctionsEmulator(functions, host, 5001);
//   } catch {
//     // Hot reload can initialize an emulator connection more than once.
//   }
// }



import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Only configure Firebase if using real credentials (not test/dummy values)
export const isFirebaseConfigured = 
  process.env.EXPO_PUBLIC_FIREBASE_API_KEY && 
  process.env.EXPO_PUBLIC_FIREBASE_API_KEY !== 'test' &&
  process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID !== 'test-project';

export const firebaseApp = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

function createAuth() {
  if (!firebaseApp) return null;
  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(firebaseApp);
  }
}

export const auth = createAuth();
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
export const functions = firebaseApp ? getFunctions(firebaseApp) : null;

if (db && functions && process.env.EXPO_PUBLIC_USE_EMULATORS === 'true') {
  const host = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST || '10.0.2.2';
  try {
    connectFirestoreEmulator(db, host, 8080);
    connectFunctionsEmulator(functions, host, 5001);
    if (auth) {
      connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
    }
  } catch {
    // Hot reload can initialize an emulator connection more than once.
  }
}