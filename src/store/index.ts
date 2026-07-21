import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

import activeOrderReducer from '@/store/activeOrderSlice';
import driverStatusReducer from '@/store/driverStatusSlice';
import earningsReducer from '@/store/earningsSlice';
import sessionReducer from '@/store/sessionSlice';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    driverStatus: driverStatusReducer,
    activeOrder: activeOrderReducer,
    earnings: earningsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
