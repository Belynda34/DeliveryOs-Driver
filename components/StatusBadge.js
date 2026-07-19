import { Text, View } from 'react-native';

const tones = {
  ready: 'bg-amber-100 text-amber-800',
  active: 'bg-emerald-100 text-emerald-800',
  complete: 'bg-slate-100 text-slate-600',
};

export default function StatusBadge({ label, tone = 'active' }) {
  return (
    <View className={`self-start rounded-full px-3 py-1 ${tones[tone]}`}>
      <Text className="text-[11px] font-extrabold tracking-wide">{label}</Text>
    </View>
  );
}
