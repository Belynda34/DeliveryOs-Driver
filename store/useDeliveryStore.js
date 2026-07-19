import { create } from 'zustand';

const useDeliveryStore = create((set) => ({
  incomingOrder: null,
  activeOrder: null,
  driver: null,
  setIncomingOrder: (incomingOrder) => set({ incomingOrder }),
  clearIncomingOrder: () => set({ incomingOrder: null }),
  setActiveOrder: (activeOrder) => set({ activeOrder, incomingOrder: null }),
  setDriver: (driver) => set({ driver }),
}));

export default useDeliveryStore;
