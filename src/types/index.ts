export type Zone =
  'kigali-central' | 'kigali-north' | 'kigali-south' | 'kigali-east' | 'kigali-west';

export type OrderStatus = 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'expired';

export type GeoLocation = {
  latitude: number;
  longitude: number;
};

export type Driver = {
  driverId: string;
  name: string;
  phone: string;
  isOnline: boolean;
  location: GeoLocation | null;
  geohash: string | null;
  currentOrderId: string | null;
  fcmToken: string | null;
  totalEarnings: number;
  pendingPayout: number;
  createdAt: string;
};

export type PickupDropoff = {
  name: string;
  address: string;
  location: GeoLocation;
  phone: string;
};

export type Order = {
  orderId: string;
  pickup: PickupDropoff;
  dropoff: PickupDropoff;
  zone: Zone;
  status: OrderStatus;
  assignedDriverId: string | null;
  assignedAt: string | null;
  dispatchAttempt: number;
  createdAt: string;
  expiresAt: string | null;
  nextRetryAt: string | null;
};
