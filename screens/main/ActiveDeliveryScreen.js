import { ScrollView, Text, View } from 'react-native';

import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import StatusBadge from '../../components/StatusBadge';
import { activeDelivery } from '../../constants/mock-data';

function Stop({ label, address, type }) {
  const dotColor = type === 'pickup' ? 'bg-emerald-500' : 'bg-slate-900';
  return (
    <View className="flex-row gap-4">
      <View className="items-center">
        <View className={`mt-1 h-4 w-4 rounded-full border-4 border-white ${dotColor}`} />
        {type === 'pickup' ? <View className="my-1 h-12 w-px border-l border-dashed border-slate-300" /> : null}
      </View>
      <View className="flex-1 pb-5">
        <Text className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</Text>
        <Text className="mt-1 text-base font-bold text-slate-900">{address}</Text>
      </View>
    </View>
  );
}

export default function ActiveDeliveryScreen({ navigation }) {
  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ paddingBottom: 32 }} contentInsetAdjustmentBehavior="automatic">
      <View className="mx-auto w-full max-w-3xl">
        <Header title="Active delivery" backLabel="Dashboard" onBackPress={navigation.goBack} />
        <View className="px-5">
          <View className="relative h-52 overflow-hidden rounded-3xl bg-emerald-100">
            <View className="absolute -left-8 top-12 h-48 w-96 rotate-[-18deg] rounded-full border-[22px] border-white/70" />
            <View className="absolute bottom-8 left-10 h-4 w-4 rounded-full border-4 border-white bg-emerald-600" />
            <View className="absolute right-12 top-9 h-4 w-4 rounded-full border-4 border-white bg-slate-900" />
            <View className="absolute bottom-5 right-5 rounded-xl bg-white px-3 py-2 shadow-sm">
              <Text className="text-xs font-bold text-slate-700">{activeDelivery.distance} · {activeDelivery.eta}</Text>
            </View>
          </View>

          <View className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <Text className="text-xs font-bold tracking-widest text-slate-400">{activeDelivery.id}</Text>
                <Text className="mt-2 text-xl font-extrabold text-slate-900">{activeDelivery.merchant}</Text>
              </View>
              <StatusBadge label={activeDelivery.status} tone="ready" />
            </View>
            <View className="my-6 h-px bg-slate-100" />
            <Stop label="Pick up from" address={activeDelivery.pickupAddress} type="pickup" />
            <Stop label={`Deliver to ${activeDelivery.customer}`} address={activeDelivery.dropoffAddress} type="dropoff" />
            <View className="mt-2 flex-row justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <Text className="text-sm text-slate-500">Delivery payout</Text>
              <Text className="text-sm font-extrabold text-slate-900">{activeDelivery.payout}</Text>
            </View>
          </View>
          <PrimaryButton title="Confirm pickup" className="mt-5" onPress={() => {}} />
          <SecondaryButton title="Contact customer" className="mt-3" onPress={() => {}} />
        </View>
      </View>
    </ScrollView>
  );
}
