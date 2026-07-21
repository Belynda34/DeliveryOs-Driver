import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppTabBar } from '@/components/navigation/AppTabBar';
import { DriverStatusToggle } from '@/components/driver-status/DriverStatusToggle';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import * as DriverService from '@/services/DriverService';
import { useAppDispatch, useAppSelector } from '@/store';
import { setOnlineStatus } from '@/store/driverStatusSlice';
import { setPendingPayout } from '@/store/earningsSlice';
import { selectDriverId } from '@/store/sessionSlice';
import type { GeoLocation, Order } from '@/types';

type TodayStats = {
  deliveriesCount: number;
  earnings: number;
  isLoading: boolean;
  error: string | null;
};

function formatRwf(amount: number): string {
  return `${amount.toLocaleString('en-US')} RWF`;
}

export function HomeDashboardScreen(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const driverId = useAppSelector(selectDriverId);

  const [driverLocation, setDriverLocation] = useState<GeoLocation | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [pendingOrderNotice, setPendingOrderNotice] = useState<Order | null>(null);
  const [stats, setStats] = useState<TodayStats>({
    deliveriesCount: 0,
    earnings: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!driverId) {
      return;
    }
    let isMounted = true;
    DriverService.getTodayStats(driverId).then((result) => {
      if (!isMounted) {
        return;
      }
      if (result.success) {
        setStats({
          deliveriesCount: result.deliveriesCount,
          earnings: result.earnings,
          isLoading: false,
          error: null,
        });
      } else {
        setStats((previous) => ({ ...previous, isLoading: false, error: result.error }));
      }
    });
    return () => {
      isMounted = false;
    };
  }, [driverId]);

  useEffect(() => {
    if (!driverId) {
      return;
    }
    const unsubscribe = DriverService.listenToDriver(driverId, (driver) => {
      if (!driver) {
        return;
      }
      dispatch(setOnlineStatus(driver.isOnline));
      dispatch(setPendingPayout(driver.pendingPayout));
      setDriverLocation(driver.location);
      setCurrentOrderId(driver.currentOrderId);
    });
    return unsubscribe;
  }, [driverId, dispatch]);

  useEffect(() => {
    const unsubscribe = DriverService.listenForPendingOrders(driverLocation, (order) => {
      setPendingOrderNotice(order);
      navigation.navigate('NewDeliveryRequest', {
        orderId: order.orderId,
        createdAt: order.createdAt,
      });
    });
    return unsubscribe;
  }, [driverLocation, navigation]);

  return (
    <View className="flex-1 items-center justify-center gap-8 bg-background px-6 pb-28">
      <DriverStatusToggle />

      <View className="w-full gap-3 rounded-card border border-border bg-surface p-6">
        <Text className="text-sm text-text-secondary">Today</Text>
        {stats.isLoading ? (
          <ActivityIndicator color="#1FD65F" />
        ) : stats.error ? (
          <Text className="text-sm text-error">{stats.error}</Text>
        ) : (
          <View className="flex-row justify-between">
            <View>
              <Text className="text-2xl font-bold text-text-primary">{stats.deliveriesCount}</Text>
              <Text className="text-xs text-text-secondary">Deliveries</Text>
            </View>
            <View>
              <Text className="text-2xl font-bold text-text-primary">
                {formatRwf(stats.earnings)}
              </Text>
              <Text className="text-xs text-text-secondary">Earnings</Text>
            </View>
          </View>
        )}
      </View>

      {currentOrderId ? (
        <View className="w-full rounded-card border border-border bg-surface-raised p-4">
          <Text className="text-sm text-text-secondary">Active order</Text>
          <Text className="text-base font-semibold text-text-primary">{currentOrderId}</Text>
        </View>
      ) : null}

      {pendingOrderNotice ? (
        <View className="w-full rounded-card border border-accent bg-surface-raised p-4">
          <Text className="text-sm font-semibold text-accent">New delivery request nearby</Text>
          <Text className="text-xs text-text-secondary">{pendingOrderNotice.orderId}</Text>
        </View>
      ) : null}

      <AppTabBar active="HomeDashboard" />
    </View>
  );
}
