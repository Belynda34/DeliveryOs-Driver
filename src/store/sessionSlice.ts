import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';

export type SessionState = {
  driverId: string | null;
  authToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const initialState: SessionState = {
  driverId: null,
  authToken: null,
  isAuthenticated: false,
  isLoading: true,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<{ driverId: string; authToken: string }>) {
      state.driverId = action.payload.driverId;
      state.authToken = action.payload.authToken;
      state.isAuthenticated = true;
    },
    clearSession(state) {
      state.driverId = null;
      state.authToken = null;
      state.isAuthenticated = false;
    },
    setSessionLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setSession, clearSession, setSessionLoading } = sessionSlice.actions;

export const selectSession = (state: RootState): SessionState => state.session;
export const selectDriverId = (state: RootState): string | null => state.session.driverId;
export const selectIsAuthenticated = (state: RootState): boolean => state.session.isAuthenticated;
export const selectIsSessionLoading = (state: RootState): boolean => state.session.isLoading;

export default sessionSlice.reducer;
