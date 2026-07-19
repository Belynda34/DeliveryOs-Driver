export const driver = {
  name: 'Alex Morgan',
  initials: 'AM',
  rating: '4.9',
};

export const activeDelivery = {
  id: 'DLV-2048',
  merchant: 'Green Bowl Kitchen',
  pickupAddress: '12 Kingfisher Avenue',
  customer: 'Nina Wilson',
  dropoffAddress: '8 Palm Grove, Kacyiru',
  distance: '3.8 km',
  payout: 'RWF 4,500',
  eta: '14 min',
  status: 'PICKUP READY',
};

export const stats = [
  { label: 'Today', value: 'RWF 18,500', detail: '+12% vs. yesterday', tone: 'green' },
  { label: 'Deliveries', value: '6', detail: '2 active this week', tone: 'blue' },
  { label: 'Rating', value: '4.9', detail: 'Top 10% of drivers', tone: 'amber' },
];

export const earnings = [
  { day: 'Mon', amount: 18000 },
  { day: 'Tue', amount: 12000 },
  { day: 'Wed', amount: 24500 },
  { day: 'Thu', amount: 16500 },
  { day: 'Fri', amount: 28000 },
  { day: 'Sat', amount: 21500 },
  { day: 'Sun', amount: 14000 },
];

export const payoutHistory = [
  { id: 'DLV-2048', place: 'Green Bowl Kitchen', amount: 'RWF 4,500', time: 'Today, 10:24' },
  { id: 'DLV-2041', place: 'Kigali Coffee House', amount: 'RWF 3,800', time: 'Today, 09:18' },
  { id: 'DLV-2037', place: 'The Burger Lab', amount: 'RWF 5,200', time: 'Yesterday, 18:42' },
];
