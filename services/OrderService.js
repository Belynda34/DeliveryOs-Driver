import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

import { db, functions } from "./firebase";

const requireFirebase = () => Boolean(db && functions);

export const normalizeOrder = (snapshot) => ({
  id: snapshot.id,
  ...snapshot.data(),
});

export function getOrder(orderId) {
  if (!requireFirebase()) return Promise.resolve(null);
  return getDoc(doc(db, "orders", orderId)).then((snapshot) =>
    snapshot.exists() ? normalizeOrder(snapshot) : null,
  );
}

export function listenForOrders(zones, onOrder, onError) {
  if (!db || !zones?.length) return () => {};
  const ordersQuery = query(
    collection(db, "orders"),
    where("status", "==", "pending"),
    where("zone", "in", zones.slice(0, 10)),
  );
  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") onOrder(normalizeOrder(change.doc));
      });
    },
    onError,
  );
}

export function listenToDriver(driverId, onDriver, onError) {
  if (!db || !driverId) return () => {};
  return onSnapshot(
    doc(db, "drivers", driverId),
    (snapshot) =>
      onDriver(
        snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null,
      ),
    onError,
  );
}

export function listenToEarnings(driverId, onOrders, onError) {
  if (!db || !driverId) return () => {};
  const earningsQuery = query(
    collection(db, "orders"),
    where("assignedDriverId", "==", driverId),
    orderBy("assignedAt", "desc"),
  );
  return onSnapshot(
    earningsQuery,
    (snapshot) => onOrders(snapshot.docs.map(normalizeOrder)),
    onError,
  );
}

export async function acceptOrder(orderId, driverId) {
  if (!requireFirebase()) {
    throw new Error(
      "Firebase is not configured. Add EXPO_PUBLIC_FIREBASE_* env vars to connect to backend.",
    );
  }
  const result = await httpsCallable(
    functions,
    "accept_order",
  )({ orderId, driverId });
  if (!result.data?.success)
    throw new Error(
      result.data?.error || "This delivery is no longer available.",
    );
  return result.data;
}

export async function updateOrderStatus(orderId, status, driverId) {
  if (!requireFirebase()) {
    throw new Error(
      "Firebase is not configured. Add EXPO_PUBLIC_FIREBASE_* env vars to connect to backend.",
    );
  }
  const result = await httpsCallable(
    functions,
    "update_order_status",
  )({ orderId, driverId, status });
  if (!result.data?.success)
    throw new Error(
      result.data?.error || "The backend could not update the order.",
    );
  return result.data;
}
