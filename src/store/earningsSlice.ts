import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import type { Order } from '@/types';

export type EarningsState = {
  deliveries: Order[];
  pendingPayout: number;
};

const initialState: EarningsState = {
  deliveries: [],
  pendingPayout: 0,
};

const earningsSlice = createSlice({
  name: 'earnings',
  initialState,
  reducers: {
    setDeliveries(state, action: PayloadAction<Order[]>) {
      state.deliveries = action.payload;
    },
    setPendingPayout(state, action: PayloadAction<number>) {
      state.pendingPayout = action.payload;
    },
  },
});

export const { setDeliveries, setPendingPayout } = earningsSlice.actions;

export const selectDeliveries = (state: RootState): Order[] => state.earnings.deliveries;
export const selectPendingPayout = (state: RootState): number => state.earnings.pendingPayout;

export default earningsSlice.reducer;
