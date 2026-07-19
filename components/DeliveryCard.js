import { Pressable, Text, View } from 'react-native';

import StatusBadge from './StatusBadge';

export default function DeliveryCard({ delivery, onPress }) {
  return (
    <Pressable onPress={onPress} className="rounded-3xl bg-slate-900 p-5 active:opacity-90">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-xs font-bold tracking-widest text-emerald-300">ACTIVE DELIVERY · {delivery.id}</Text>
          <Text className="mt-3 text-xl font-extrabold text-white">{delivery.merchant}</Text>
          <Text className="mt-1 text-sm text-slate-300">to {delivery.customer}</Text>
        </View>
        <StatusBadge label={delivery.status} tone="ready" />
      </View>
      <View className="my-5 h-px bg-slate-700" />
      <View className="flex-row justify-between">
        <View>
          <Text className="text-xs text-slate-400">Distance</Text>
          <Text className="mt-1 font-bold text-white">{delivery.distance}</Text>
        </View>
        <View>
          <Text className="text-xs text-slate-400">Your payout</Text>
          <Text className="mt-1 font-bold text-white">{delivery.payout}</Text>
        </View>
        <View>
          <Text className="text-xs text-slate-400">ETA</Text>
          <Text className="mt-1 font-bold text-white">{delivery.eta}</Text>
        </View>
      </View>
    </Pressable>
  );
}
