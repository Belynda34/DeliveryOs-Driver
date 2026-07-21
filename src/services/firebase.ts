import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';

const firebaseConfig = {
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const EMULATOR_HOST = process.env.EXPO_PUBLIC_EMULATOR_HOST ?? 'localhost';

if (__DEV__) {
  firestore().useEmulator(EMULATOR_HOST, 8080);
  functions().useEmulator(EMULATOR_HOST, 5001);
  auth().useEmulator(`http://${EMULATOR_HOST}:9099`);
}

export { auth, firebase };
