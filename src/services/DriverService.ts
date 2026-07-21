import firestore, { type FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { getZoneFee, toOrder } from '@/services/OrderService';
import type { Driver, GeoLocation, Order, Zone } from '@/types';

export type ToggleOnlineStatusResult = { success: boolean; error?: string };

export type TodayStatsResult =
  { success: true; deliveriesCount: number; earnings: number } | { success: false; error: string };

const ZONE_CENTERS: Record<Zone, GeoLocation> = {
  'kigali-central': { latitude: -1.9441, longitude: 30.0619 },
  'kigali-north': { latitude: -1.9107, longitude: 30.0594 },
  'kigali-south': { latitude: -1.9806, longitude: 30.0644 },
  'kigali-east': { latitude: -1.9536, longitude: 30.1044 },
  'kigali-west': { latitude: -1.9578, longitude: 30.0212 },
};

function getNearestZone(location: GeoLocation): Zone {
  let nearestZone: Zone = 'kigali-central';
  let smallestDistance = Number.POSITIVE_INFINITY;

  (Object.keys(ZONE_CENTERS) as Zone[]).forEach((zone) => {
    const center = ZONE_CENTERS[zone];
    const distance =
      (location.latitude - center.latitude) ** 2 + (location.longitude - center.longitude) ** 2;
    if (distance < smallestDistance) {
      smallestDistance = distance;
      nearestZone = zone;
    }
  });

  return nearestZone;
}

function toGeoLocation(
  point: FirebaseFirestoreTypes.GeoPoint | null | undefined
): GeoLocation | null {
  if (!point) {
    return null;
  }
  return { latitude: point.latitude, longitude: point.longitude };
}

export async function toggleOnlineStatus(
  driverId: string,
  isOnline: boolean
): Promise<ToggleOnlineStatusResult> {
  try {
    await firestore().collection('drivers').doc(driverId).update({ isOnline });
    return { success: true };
  } catch (error) {
    console.error('[DriverService/toggleOnlineStatus]', error);
    return { success: false, error: 'Could not update your status. Please try again.' };
  }
}

export async function getTodayStats(driverId: string): Promise<TodayStatsResult> {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const snapshot = await firestore()
      .collection('orders')
      .where('assignedDriverId', '==', driverId)
      .where('status', '==', 'delivered')
      .where('assignedAt', '>=', startOfToday)
      .get();

    let earnings = 0;
    snapshot.forEach((doc) => {
      const order = doc.data() as Order;
      earnings += getZoneFee(order.zone);
    });

    return { success: true, deliveriesCount: snapshot.size, earnings };
  } catch (error) {
    console.error('[DriverService/getTodayStats]', error);
    return { success: false, error: "Could not load today's stats." };
  }
}

export function listenToDriver(
  driverId: string,
  onChange: (driver: Driver | null) => void
): () => void {
  return firestore()
    .collection('drivers')
    .doc(driverId)
    .onSnapshot(
      (snapshot) => {
        const data = snapshot.data();
        if (!data) {
          onChange(null);
          return;
        }
        onChange({
          driverId: snapshot.id,
          name: data.name,
          phone: data.phone,
          isOnline: data.isOnline,
          location: toGeoLocation(data.location),
          geohash: data.geohash ?? null,
          currentOrderId: data.currentOrderId ?? null,
          fcmToken: data.fcmToken ?? null,
          totalEarnings: data.totalEarnings ?? 0,
          pendingPayout: data.pendingPayout ?? 0,
          createdAt: data.createdAt,
        });
      },
      (error) => {
        console.error('[DriverService/listenToDriver]', error);
      }
    );
}

export function listenForPendingOrders(
  driverLocation: GeoLocation | null,
  onNewOrder: (order: Order) => void
): () => void {
  const zone = driverLocation ? getNearestZone(driverLocation) : 'kigali-central';

  return firestore()
    .collection('orders')
    .where('status', '==', 'pending')
    .where('zone', 'in', [zone])
    .onSnapshot(
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            onNewOrder(toOrder(change.doc.data()));
          }
        });
      },
      (error) => {
        console.error('[DriverService/listenForPendingOrders]', error);
      }
    );
}
