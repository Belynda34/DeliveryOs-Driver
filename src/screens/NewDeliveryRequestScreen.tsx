import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Pressable, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AddressCard } from '@/components/delivery-request/AddressCard';
import { CountdownTimer } from '@/components/delivery-request/CountdownTimer';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import * as OrderService from '@/services/OrderService';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearActiveOrder, selectActiveOrder, setActiveOrder } from '@/store/activeOrderSlice';
import { selectDriverId } from '@/store/sessionSlice';

const EXIT_MESSAGE_DELAY_MS = 1500;

function formatRwf(amount: number): string {
  return `${amount.toLocaleString('en-US')} RWF`;
}

export function NewDeliveryRequestScreen(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'NewDeliveryRequest'>>();
  const driverId = useAppSelector(selectDriverId);
  const order = useAppSelector(selectActiveOrder);

  const { orderId, createdAt } = route.params ?? {};

  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const [exitMessage, setExitMessage] = useState<string | null>(null);
  const hasExitedRef = useRef(false);
  const isAcceptingRef = useRef(false);
  const hasCountdownExpiredRef = useRef(false);

  const exitToHomeDashboard = useCallback(
    (message?: string) => {
      if (hasExitedRef.current) {
        return;
      }
      hasExitedRef.current = true;

      setTimeout(() => {
        dispatch(clearActiveOrder());

        const reset = (): void => {
          navigation.reset({ index: 0, routes: [{ name: 'HomeDashboard' }] });
        };

        if (message) {
          setExitMessage(message);
          setTimeout(reset, EXIT_MESSAGE_DELAY_MS);
        } else {
          reset();
        }
      }, 0);
    },
    [dispatch, navigation]
  );

  useEffect(() => {
    if (!orderId || !createdAt) {
      exitToHomeDashboard();
    }
  }, [orderId, createdAt, exitToHomeDashboard]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!orderId) {
      return;
    }
    const unsubscribe = OrderService.listenForOrder(orderId, (fetchedOrder) => {
      if (!fetchedOrder) {
        return;
      }
      dispatch(setActiveOrder(fetchedOrder));
      if (fetchedOrder.status === 'assigned' && fetchedOrder.assignedDriverId !== driverId) {
        exitToHomeDashboard('This order was taken by another driver.');
      }
    });
    return () => {
      unsubscribe();
      dispatch(clearActiveOrder());
    };
  }, [orderId, driverId, dispatch, exitToHomeDashboard]);

  const handleAccept = async (): Promise<void> => {
    if (!orderId || !driverId || isAcceptingRef.current || hasExitedRef.current) {
      return;
    }
    isAcceptingRef.current = true;
    setIsAccepting(true);
    setAcceptError(null);

    const result = await OrderService.acceptOrder(orderId, driverId);

    isAcceptingRef.current = false;
    setIsAccepting(false);

    if (result.success) {
      if (hasExitedRef.current) {
        return;
      }
      hasExitedRef.current = true;
      dispatch(clearActiveOrder());
      navigation.reset({ index: 0, routes: [{ name: 'ActiveDelivery', params: { orderId } }] });
      return;
    }

    if (result.failureType === 'business') {
      exitToHomeDashboard(result.error);
      return;
    }

    if (hasCountdownExpiredRef.current) {
      exitToHomeDashboard(result.error);
      return;
    }
    setAcceptError(result.error);
  };

  const handleReject = (): void => {
    exitToHomeDashboard();
  };

  const handleExpire = useCallback(() => {
    hasCountdownExpiredRef.current = true;
    if (isAcceptingRef.current) {
      return;
    }
    exitToHomeDashboard();
  }, [exitToHomeDashboard]);

  if (exitMessage) {
    return (
      <View className="flex-1 items-center justify-center gap-2 bg-background px-6">
        <Text className="text-center text-lg font-semibold text-text-primary">{exitMessage}</Text>
      </View>
    );
  }

  if (!orderId || !createdAt) {
    return <View className="flex-1 bg-background" />;
  }

  return (
    <View className="flex-1 justify-between gap-6 bg-background px-6 py-10">
      <CountdownTimer serverCreatedAt={createdAt} onExpire={handleExpire} />

      {order ? (
        <View className="gap-4">
          <View className="items-center rounded-pill bg-accent px-6 py-2">
            <Text className="text-base font-bold text-accent-foreground">
              {formatRwf(OrderService.getZoneFee(order.zone))}
            </Text>
          </View>
          <AddressCard label="Pickup" name={order.pickup.name} address={order.pickup.address} />
          <AddressCard label="Dropoff" name={order.dropoff.name} address={order.dropoff.address} />
        </View>
      ) : (
        <View className="items-center gap-2">
          <ActivityIndicator color="#1FD65F" />
          <Text className="text-sm text-text-secondary">Loading request details…</Text>
        </View>
      )}

      <View className="gap-3">
        {acceptError ? (
          <Text className="text-center text-sm font-semibold text-error">{acceptError}</Text>
        ) : null}
        <Pressable
          onPress={handleAccept}
          disabled={isAccepting}
          className="w-full items-center rounded-pill bg-accent px-6 py-4">
          {isAccepting ? (
            <ActivityIndicator color="#0B0E11" />
          ) : (
            <Text className="text-lg font-bold text-accent-foreground">
              {acceptError ? 'Retry' : 'Accept'}
            </Text>
          )}
        </Pressable>
        <Pressable
          onPress={handleReject}
          className="w-full items-center rounded-pill bg-surface-raised px-6 py-3">
          <Text className="text-sm font-semibold text-text-secondary">Reject</Text>
        </Pressable>
      </View>
    </View>
  );
}
