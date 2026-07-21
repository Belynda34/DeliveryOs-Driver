import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import { AppTabBar } from '@/components/navigation/AppTabBar';
import * as OrderService from '@/services/OrderService';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectDeliveries, selectPendingPayout, setDeliveries } from '@/store/earningsSlice';
import { selectDriverId } from '@/store/sessionSlice';
import type { Order } from '@/types';

type Period = 'today' | 'week' | 'month';

const PERIODS: { key: Period; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

const QUERY_WINDOW_DAYS = 30;

function formatRwf(amount: number): string {
  return `${amount.toLocaleString('en-US')} RWF`;
}

function periodCutoff(period: Period): Date {
  const cutoff = new Date();
  if (period === 'today') {
    cutoff.setHours(0, 0, 0, 0);
  } else if (period === 'week') {
    cutoff.setDate(cutoff.getDate() - 7);
  } else {
    cutoff.setDate(cutoff.getDate() - QUERY_WINDOW_DAYS);
  }
  return cutoff;
}

export function EarningsScreen(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const driverId = useAppSelector(selectDriverId);
  const deliveries = useAppSelector(selectDeliveries);
  const pendingPayout = useAppSelector(selectPendingPayout);

  const [period, setPeriod] = useState<Period>('today');

  useEffect(() => {
    if (!driverId) {
      return;
    }
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - QUERY_WINDOW_DAYS);

    const unsubscribe = OrderService.listenForDeliveredOrders(driverId, sinceDate, (orders) => {
      dispatch(setDeliveries(orders));
    });
    return unsubscribe;
  }, [driverId, dispatch]);

  const filteredDeliveries = useMemo(() => {
    const cutoff = periodCutoff(period);
    return deliveries.filter((order) => order.assignedAt && new Date(order.assignedAt) >= cutoff);
  }, [deliveries, period]);

  const total = useMemo(
    () => filteredDeliveries.reduce((sum, order) => sum + OrderService.getZoneFee(order.zone), 0),
    [filteredDeliveries]
  );

  return (
    <View className="flex-1 bg-background px-6 pb-28 pt-16">
      <Text className="text-2xl font-bold text-text-primary">Earnings</Text>

      <View className="mt-6 gap-1 rounded-card bg-surface-raised p-5">
        <Text className="text-sm text-text-secondary">Pending payout</Text>
        <Text className="text-3xl font-bold text-accent">{formatRwf(pendingPayout)}</Text>
      </View>

      <View className="mt-6 flex-row rounded-pill bg-surface p-1">
        {PERIODS.map(({ key, label }) => {
          const isActive = key === period;
          return (
            <Pressable
              key={key}
              onPress={() => setPeriod(key)}
              className={`flex-1 items-center rounded-pill py-2 ${isActive ? 'bg-accent' : ''}`}>
              <Text
                className={`text-sm font-semibold ${
                  isActive ? 'text-accent-foreground' : 'text-text-secondary'
                }`}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-6 flex-row items-baseline justify-between">
        <Text className="text-sm text-text-secondary">Total</Text>
        <Text className="text-xl font-bold text-text-primary">{formatRwf(total)}</Text>
      </View>

      <View className="mt-4 flex-1">
        <FlatList
          data={filteredDeliveries}
          keyExtractor={(order) => order.orderId}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="mt-16 items-center gap-3">
              <View className="h-16 w-16 items-center justify-center rounded-full border border-border">
                <Text className="text-2xl text-text-secondary">$</Text>
              </View>
              <Text className="text-sm text-text-secondary">
                No deliveries yet {period === 'today' ? 'today' : `this ${period}`}
              </Text>
            </View>
          }
          renderItem={({ item }: { item: Order }) => <DeliveryRow order={item} />}
        />
      </View>

      <AppTabBar active="Earnings" />
    </View>
  );
}

type DeliveryRowProps = { order: Order };

function DeliveryRow({ order }: DeliveryRowProps): React.JSX.Element {
  return (
    <View className="flex-row items-center justify-between rounded-card bg-surface-raised p-4">
      <View className="gap-1">
        <Text className="text-base font-semibold text-text-primary">{order.zone}</Text>
        <View className="self-start rounded-pill bg-accent px-3 py-1">
          <Text className="text-xs font-bold text-accent-foreground">Delivered</Text>
        </View>
      </View>
      <Text className="text-base font-bold text-text-primary">
        {formatRwf(OrderService.getZoneFee(order.zone))}
      </Text>
    </View>
  );
}
