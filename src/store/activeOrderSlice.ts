import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import type { Order } from '@/types';

export type ActiveOrderState = {
  order: Order | null;
};

const initialState: ActiveOrderState = {
  order: null,
};

const activeOrderSlice = createSlice({
  name: 'activeOrder',
  initialState,
  reducers: {
    setActiveOrder(state, action: PayloadAction<Order>) {
      state.order = action.payload;
    },
    clearActiveOrder(state) {
      state.order = null;
    },
  },
});

export const { setActiveOrder, clearActiveOrder } = activeOrderSlice.actions;

export const selectActiveOrder = (state: RootState): Order | null => state.activeOrder.order;
export const selectActiveOrderCreatedAt = (state: RootState): string | null =>
  state.activeOrder.order?.createdAt ?? null;

export default activeOrderSlice.reducer;
