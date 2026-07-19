import { Text, View } from "react-native";

const accent = {
  green: "bg-emerald-500",
  blue: "bg-sky-500",
  amber: "bg-amber-400",
};

export default function StatsCard({
  label,
  value,
  detail,
  tone = "green",
  icon = "•",
}) {
  return (
    <View className="min-w-44 flex-1 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <View className="mb-4 flex-row items-center justify-between">
        <View className={`h-2 w-10 rounded-full ${accent[tone]}`} />
        <Text className="text-lg">{icon}</Text>
      </View>
      <Text className="text-sm font-medium text-slate-500">{label}</Text>
      <Text className="mt-1 text-xl font-extrabold text-slate-900">
        {value}
      </Text>
      <Text className="mt-2 text-xs text-slate-400">{detail}</Text>
    </View>
  );
}
