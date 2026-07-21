import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';

export type DriverStatusState = {
  isOnline: boolean;
  isToggling: boolean;
  error: string | null;
  latestRequestId: number;
};

const initialState: DriverStatusState = {
  isOnline: false,
  isToggling: false,
  error: null,
  latestRequestId: 0,
};

const driverStatusSlice = createSlice({
  name: 'driverStatus',
  initialState,
  reducers: {
    setOnlineStatus(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload;
      state.error = null;
    },
    optimisticToggle(state, action: PayloadAction<{ isOnline: boolean; requestId: number }>) {
      state.isOnline = action.payload.isOnline;
      state.isToggling = true;
      state.error = null;
      state.latestRequestId = action.payload.requestId;
    },
    confirmToggle(state, action: PayloadAction<{ requestId: number }>) {
      if (action.payload.requestId !== state.latestRequestId) {
        return;
      }
      state.isToggling = false;
    },
    rollbackToggle(
      state,
      action: PayloadAction<{ requestId: number; previousIsOnline: boolean; error: string }>
    ) {
      if (action.payload.requestId !== state.latestRequestId) {
        return;
      }
      state.isOnline = action.payload.previousIsOnline;
      state.isToggling = false;
      state.error = action.payload.error;
    },
    clearDriverStatusError(state) {
      state.error = null;
    },
  },
});

export const {
  setOnlineStatus,
  optimisticToggle,
  confirmToggle,
  rollbackToggle,
  clearDriverStatusError,
} = driverStatusSlice.actions;

export const selectDriverStatus = (state: RootState): DriverStatusState => state.driverStatus;
export const selectIsOnline = (state: RootState): boolean => state.driverStatus.isOnline;
export const selectIsToggling = (state: RootState): boolean => state.driverStatus.isToggling;
export const selectDriverStatusError = (state: RootState): string | null =>
  state.driverStatus.error;

export default driverStatusSlice.reducer;
