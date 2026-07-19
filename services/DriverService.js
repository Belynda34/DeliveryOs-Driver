// import * as Location from 'expo-location';
// import ngeohash from 'ngeohash';
// import { doc, updateDoc } from 'firebase/firestore';

// import { db } from './firebase';

// export async function updateDriverOnlineStatus(driverId, isOnline) {
//   if (!db) throw new Error('Firebase is not configured.');
//   await updateDoc(doc(db, 'drivers', driverId), { isOnline });
// }

// export async function syncDriverLocation(driverId) {
//   if (!db || !driverId) return;
//   const permission = await Location.requestForegroundPermissionsAsync();
//   if (permission.status !== 'granted') throw new Error('Location permission is required while you are online.');
//   const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
//   const { latitude, longitude } = position.coords;
//   await updateDoc(doc(db, 'drivers', driverId), {
//     location: { latitude, longitude },
//     geohash: ngeohash.encode(latitude, longitude, 9),
//   });
// }

// export async function syncFcmToken(driverId, fcmToken) {
//   if (!db || !driverId || !fcmToken) return;
//   await updateDoc(doc(db, 'drivers', driverId), { fcmToken });
// }


import * as Location from 'expo-location';
import ngeohash from 'ngeohash';
import { doc, updateDoc, GeoPoint } from 'firebase/firestore';

import { db } from './firebase';

export async function updateDriverOnlineStatus(driverId, isOnline) {
  if (!db) throw new Error('Firebase is not configured.');
  await updateDoc(doc(db, 'drivers', driverId), { isOnline });
}

export async function syncDriverLocation(driverId) {
  if (!db || !driverId) return;
  
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== 'granted') {
    throw new Error('Location permission is required while you are online.');
  }
  
  const position = await Location.getCurrentPositionAsync({ 
    accuracy: Location.Accuracy.Balanced 
  });
  
  const { latitude, longitude } = position.coords;
  
  // CRITICAL: Must use precision 9 to match backend queries
  const geohash = ngeohash.encode(latitude, longitude, 9);
  
  await updateDoc(doc(db, 'drivers', driverId), {
    location: new GeoPoint(latitude, longitude),
    geohash: geohash,
  });
}

export async function syncFcmToken(driverId, fcmToken) {
  if (!db || !driverId || !fcmToken) return;
  await updateDoc(doc(db, 'drivers', driverId), { fcmToken });
}