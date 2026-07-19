import { ActivityIndicator, Text, View } from 'react-native';

export default function LoadingComponent({ label = 'Loading your deliveries...' }) {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-slate-50 px-6">
      <ActivityIndicator size="large" color="#059669" />
      <Text className="text-sm text-slate-500">{label}</Text>
    </View>
  );
}
