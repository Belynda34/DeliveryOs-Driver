import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isBootstrapping: true,
  setUser: (user) => set({ user }),
  setIsBootstrapping: (isBootstrapping) => set({ isBootstrapping }),
  reset: () => set({ user: null, isBootstrapping: false }),
}));

export default useAuthStore;
