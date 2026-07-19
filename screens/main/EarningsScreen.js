import { ScrollView, Text, View } from 'react-native';

import Header from '../../components/Header';
import { driver, earnings, payoutHistory } from '../../constants/mock-data';

export default function EarningsScreen() {
  const maxAmount = Math.max(...earnings.map((entry) => entry.amount));

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ paddingBottom: 32 }} contentInsetAdjustmentBehavior="automatic">
      <View className="mx-auto w-full max-w-3xl">
        <Header title="Earnings" subtitle="Your week in review." initials={driver.initials} />
        <View className="px-5">
          <View className="rounded-3xl bg-emerald-600 p-6">
            <Text className="text-sm font-medium text-emerald-100">This week</Text>
            <Text className="mt-2 text-3xl font-extrabold text-white">RWF 134,500</Text>
            <View className="mt-5 self-start rounded-full bg-white/15 px-3 py-1.5">
              <Text className="text-xs font-bold text-white">↑ 18% from last week</Text>
            </View>
          </View>

          <Text className="mb-3 mt-8 text-lg font-extrabold text-slate-900">Weekly activity</Text>
          <View className="h-60 rounded-3xl bg-white p-5 shadow-sm">
            <View className="flex-1 flex-row items-end justify-between gap-2">
              {earnings.map((entry) => (
                <View key={entry.day} className="flex-1 items-center justify-end gap-2">
                  <View style={{ height: Math.max(18, (entry.amount / maxAmount) * 142) }} className="w-full max-w-8 rounded-t-xl bg-emerald-500" />
                  <Text className="text-[10px] font-semibold text-slate-400">{entry.day}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mb-3 mt-8 flex-row items-center justify-between">
            <Text className="text-lg font-extrabold text-slate-900">Recent payouts</Text>
            <Text className="text-sm font-bold text-emerald-700">View all</Text>
          </View>
          <View className="overflow-hidden rounded-3xl bg-white shadow-sm">
            {payoutHistory.map((payout, index) => (
              <View key={payout.id} className={`flex-row items-center justify-between px-5 py-4 ${index < payoutHistory.length - 1 ? 'border-b border-slate-100' : ''}`}>
                <View>
                  <Text className="font-bold text-slate-900">{payout.place}</Text>
                  <Text className="mt-1 text-xs text-slate-400">{payout.id} · {payout.time}</Text>
                </View>
                <Text className="font-extrabold text-emerald-700">{payout.amount}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
