import { Text, View } from 'react-native';

export default function EmptyState({ title, message }) {
  return (
    <View className="items-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-10">
      <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Text className="text-xl">⌁</Text>
      </View>
      <Text className="text-base font-bold text-slate-900">{title}</Text>
      <Text className="mt-2 text-center text-sm leading-5 text-slate-500">{message}</Text>
    </View>
  );
}
