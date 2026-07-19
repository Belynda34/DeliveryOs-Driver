import { ScrollView, Text, View } from 'react-native';

import DeliveryCard from '../../components/DeliveryCard';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import StatsCard from '../../components/StatsCard';
import StatusBadge from '../../components/StatusBadge';
import { activeDelivery, driver, stats } from '../../constants/mock-data';
import { APP_ROUTES } from '../../constants/routes';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ paddingBottom: 32 }} contentInsetAdjustmentBehavior="automatic">
      <View className="mx-auto w-full max-w-3xl">
        <Header title={`Good morning, ${driver.name.split(' ')[0]}.`} subtitle="Here is your delivery overview." initials={driver.initials} />
        <View className="px-5">
          <View className="mb-6 flex-row items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <View className="flex-row items-center gap-3">
              <View className="h-3 w-3 rounded-full bg-emerald-500" />
              <View>
                <Text className="font-bold text-emerald-950">You are online</Text>
                <Text className="mt-0.5 text-xs text-emerald-700">New offers will appear here.</Text>
              </View>
            </View>
            <StatusBadge label="ACTIVE" tone="active" />
          </View>

          <Text className="mb-3 text-lg font-extrabold text-slate-900">Today at a glance</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-7" contentContainerStyle={{ gap: 12 }}>
            {stats.map((stat) => <StatsCard key={stat.label} {...stat} />)}
          </ScrollView>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-extrabold text-slate-900">In progress</Text>
            <Text className="text-sm font-bold text-emerald-700">1 active</Text>
          </View>
          <DeliveryCard delivery={activeDelivery} onPress={() => navigation.navigate(APP_ROUTES.ACTIVE_DELIVERY)} />

          <View className="mb-3 mt-8 flex-row items-center justify-between">
            <Text className="text-lg font-extrabold text-slate-900">Next up</Text>
            <Text className="text-sm font-bold text-slate-400">No offers</Text>
          </View>
          <EmptyState title="You are all caught up" message="Stay online and we will notify you when a new delivery is ready." />
        </View>
      </View>
    </ScrollView>
  );
}
