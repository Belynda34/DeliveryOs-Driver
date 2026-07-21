import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AddressCard } from '@/components/delivery-request/AddressCard';
import { DeliveryMap } from '@/components/map/DeliveryMap';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import * as DriverService from '@/services/DriverService';
import * as OrderService from '@/services/OrderService';
import { openNavigation } from '@/utils/deepLink';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearActiveOrder, selectActiveOrder, setActiveOrder } from '@/store/activeOrderSlice';
import { selectDriverId } from '@/store/sessionSlice';
import type { GeoLocation } from '@/types';

function formatRwf(amount: number): string {
  return `${amount.toLocaleString('en-US')} RWF`;
}

export function ActiveDeliveryScreen(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ActiveDelivery'>>();
  const driverId = useAppSelector(selectDriverId);
  const order = useAppSelector(selectActiveOrder);

  const { orderId } = route.params ?? {};

  const [driverLocation, setDriverLocation] = useState<GeoLocation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (!orderId) {
      return;
    }
    const unsubscribe = OrderService.listenForOrder(orderId, (fetchedOrder) => {
      if (fetchedOrder) {
        dispatch(setActiveOrder(fetchedOrder));
      }
    });
    return () => {
      unsubscribe();
      dispatch(clearActiveOrder());
    };
  }, [orderId, dispatch]);

  useEffect(() => {
    if (!driverId) {
      return;
    }
    const unsubscribe = DriverService.listenToDriver(driverId, (driver) => {
      if (driver) {
        setDriverLocation(driver.location);
      }
    });
    return unsubscribe;
  }, [driverId]);

  const isDropoffPhase = order?.status === 'picked_up';
  const destination = order ? (isDropoffPhase ? order.dropoff : order.pickup) : null;

  const handleNavigate = useCallback((): void => {
    if (!destination) {
      return;
    }
    void openNavigation(destination.location);
  }, [destination]);

  const handleArrived = useCallback(async (): Promise<void> => {
    if (!orderId || !driverId || isSubmittingRef.current) {
      return;
    }
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    const result = await OrderService.updateOrderStatus(orderId, driverId, 'picked_up');

    isSubmittingRef.current = false;
    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error ?? 'Could not update the order. Please try again.');
    }
  }, [orderId, driverId]);

  const handleDelivered = useCallback(async (): Promise<void> => {
    if (!orderId || !driverId || isSubmittingRef.current) {
      return;
    }
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    const result = await OrderService.updateOrderStatus(orderId, driverId, 'delivered');

    if (!result.success) {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      setSubmitError(result.error ?? 'Could not mark this order delivered. Please try again.');
      return;
    }

    dispatch(clearActiveOrder());
    navigation.reset({ index: 0, routes: [{ name: 'HomeDashboard' }] });
  }, [orderId, driverId, dispatch, navigation]);

  if (!orderId || !order || !destination) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#1FD65F" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <DeliveryMap currentLocation={driverLocation} destination={destination.location} />

      <View className="absolute bottom-0 left-0 right-0 gap-4 rounded-t-card bg-surface p-6">
        <View className="gap-1">
          <Text className="text-xs font-semibold uppercase text-text-secondary">
            {isDropoffPhase ? 'Deliver to' : 'Pick up from'}
          </Text>
          <View className="items-center self-start rounded-pill bg-accent px-4 py-1">
            <Text className="text-sm font-bold text-accent-foreground">
              {formatRwf(OrderService.getZoneFee(order.zone))}
            </Text>
          </View>
        </View>

        <AddressCard
          label={isDropoffPhase ? 'Dropoff' : 'Pickup'}
          name={destination.name}
          address={destination.address}
        />

        <Pressable
          onPress={handleNavigate}
          className="w-full items-center rounded-pill bg-surface-raised px-6 py-3">
          <Text className="text-sm font-semibold text-text-primary">Navigate</Text>
        </Pressable>

        {submitError ? (
          <Text className="text-center text-sm font-semibold text-error">{submitError}</Text>
        ) : null}

        <Pressable
          onPress={isDropoffPhase ? handleDelivered : handleArrived}
          disabled={isSubmitting}
          className="w-full items-center rounded-pill bg-accent px-6 py-4">
          {isSubmitting ? (
            <ActivityIndicator color="#0B0E11" />
          ) : (
            <Text className="text-lg font-bold text-accent-foreground">
              {isDropoffPhase ? 'Delivered' : 'Arrived'}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
