import firestore, { type FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';

import type { GeoLocation, Order, OrderStatus, PickupDropoff, Zone } from '@/types';

function toIsoString(
  value: FirebaseFirestoreTypes.Timestamp | string | null | undefined
): string | null {
  if (!value) {
    return null;
  }
  return typeof value === 'string' ? value : value.toDate().toISOString();
}

function toGeoLocation(point: FirebaseFirestoreTypes.GeoPoint): GeoLocation {
  return { latitude: point.latitude, longitude: point.longitude };
}

function toPickupDropoff(data: FirebaseFirestoreTypes.DocumentData): PickupDropoff {
  return {
    name: data.name,
    address: data.address,
    phone: data.phone,
    location: toGeoLocation(data.location),
  };
}

export function toOrder(data: FirebaseFirestoreTypes.DocumentData): Order {
  return {
    orderId: data.orderId,
    pickup: toPickupDropoff(data.pickup),
    dropoff: toPickupDropoff(data.dropoff),
    zone: data.zone,
    status: data.status,
    assignedDriverId: data.assignedDriverId ?? null,
    assignedAt: toIsoString(data.assignedAt),
    dispatchAttempt: data.dispatchAttempt,
    createdAt: toIsoString(data.createdAt) as string,
    expiresAt: toIsoString(data.expiresAt),
    nextRetryAt: toIsoString(data.nextRetryAt),
  };
}

export type AcceptOrderResult =
  { success: true } | { success: false; failureType: 'network' | 'business'; error: string };

const ZONE_FEES: Record<Zone, number> = {
  'kigali-central': 1500,
  'kigali-north': 1800,
  'kigali-south': 1800,
  'kigali-east': 2000,
  'kigali-west': 2000,
};
const DEFAULT_ZONE_FEE = 1500;

export function getZoneFee(zone: Zone): number {
  return ZONE_FEES[zone] ?? DEFAULT_ZONE_FEE;
}

export function listenForOrder(
  orderId: string,
  onChange: (order: Order | null) => void
): () => void {
  return firestore()
    .collection('orders')
    .doc(orderId)
    .onSnapshot(
      (snapshot) => {
        const data = snapshot.data();
        onChange(data ? toOrder(data) : null);
      },
      (error) => {
        console.error('[OrderService/listenForOrder]', error);
      }
    );
}

export function listenForDeliveredOrders(
  driverId: string,
  sinceDate: Date,
  onChange: (orders: Order[]) => void
): () => void {
  return firestore()
    .collection('orders')
    .where('assignedDriverId', '==', driverId)
    .where('status', '==', 'delivered')
    .where('assignedAt', '>=', sinceDate)
    .orderBy('assignedAt', 'desc')
    .onSnapshot(
      (snapshot) => {
        onChange(snapshot.docs.map((doc) => toOrder(doc.data())));
      },
      (error) => {
        console.error('[OrderService/listenForDeliveredOrders]', error);
      }
    );
}

export function listenForOrders(
  driverZones: string[],
  callback: (order: Order) => void
): () => void {
  return firestore()
    .collection('orders')
    .where('status', '==', 'pending')
    .where('zone', 'in', driverZones)
    .onSnapshot(
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            callback(toOrder(change.doc.data()));
          }
        });
      },
      (error) => {
        console.error('[OrderService/listenForOrders]', error);
      }
    );
}

export async function acceptOrder(orderId: string, driverId: string): Promise<AcceptOrderResult> {
  let response;
  try {
    const acceptOrderFn = functions().httpsCallable('accept_order');
    response = await acceptOrderFn({ orderId, driverId });
  } catch (error) {
    console.error('[OrderService/acceptOrder]', error);
    return {
      success: false,
      failureType: 'network',
      error: 'Could not reach the server. Check your connection and try again.',
    };
  }

  const data = response.data as { success: boolean; error?: string };
  if (data.success) {
    return { success: true };
  }
  return {
    success: false,
    failureType: 'business',
    error: data.error ?? 'This order is no longer available.',
  };
}

export type UpdateOrderStatusResult = { success: boolean; error?: string };

export async function updateOrderStatus(
  orderId: string,
  driverId: string,
  status: OrderStatus
): Promise<UpdateOrderStatusResult> {
  try {
    const updateOrderStatusFn = functions().httpsCallable('update_order_status');
    const response = await updateOrderStatusFn({ orderId, driverId, status });
    const data = response.data as { success: boolean; error?: string };
    if (data.success) {
      return { success: true };
    }
    return { success: false, error: data.error ?? 'Failed to update order status' };
  } catch (error) {
    console.error('[OrderService/updateOrderStatus]', error);
    return { success: false, error: 'Failed to update order status' };
  }
}
