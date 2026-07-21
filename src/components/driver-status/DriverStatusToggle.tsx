import { useEffect, useRef } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import * as DriverService from '@/services/DriverService';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectDriverId } from '@/store/sessionSlice';
import {
  clearDriverStatusError,
  confirmToggle,
  optimisticToggle,
  rollbackToggle,
  selectDriverStatusError,
  selectIsOnline,
  selectIsToggling,
} from '@/store/driverStatusSlice';

const ERROR_BANNER_DURATION_MS = 4000;

export function DriverStatusToggle(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const driverId = useAppSelector(selectDriverId);
  const isOnline = useAppSelector(selectIsOnline);
  const isToggling = useAppSelector(selectIsToggling);
  const error = useAppSelector(selectDriverStatusError);

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!error) {
      return;
    }
    const timeout = setTimeout(() => {
      dispatch(clearDriverStatusError());
    }, ERROR_BANNER_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [error, dispatch]);

  const handlePress = async (): Promise<void> => {
    if (!driverId) {
      return;
    }

    const previousIsOnline = isOnline;
    const nextIsOnline = !isOnline;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    dispatch(optimisticToggle({ isOnline: nextIsOnline, requestId }));

    const result = await DriverService.toggleOnlineStatus(driverId, nextIsOnline);

    if (result.success) {
      dispatch(confirmToggle({ requestId }));
    } else {
      dispatch(
        rollbackToggle({
          requestId,
          previousIsOnline,
          error: result.error ?? 'Could not update your status. Please try again.',
        })
      );
    }
  };

  return (
    <View className="items-center gap-3">
      <Pressable
        onPress={handlePress}
        className={`h-40 w-40 items-center justify-center rounded-pill ${
          isOnline ? 'bg-accent' : 'bg-surface-raised'
        }`}>
        {isToggling ? (
          <ActivityIndicator color={isOnline ? '#0B0E11' : '#FFFFFF'} />
        ) : (
          <Text
            className={`text-xl font-bold ${isOnline ? 'text-accent-foreground' : 'text-text-primary'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        )}
      </Pressable>
      <Text className="text-sm text-text-secondary">
        {isOnline ? "You're visible to new delivery requests" : 'Tap to go online'}
      </Text>
      {error ? (
        <View className="rounded-card border border-error bg-surface px-4 py-2">
          <Text className="text-sm text-error">{error}</Text>
        </View>
      ) : null}
    </View>
  );
}
