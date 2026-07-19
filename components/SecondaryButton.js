import { Pressable, Text } from 'react-native';

export default function SecondaryButton({ title, onPress, className = '' }) {
  return (
    <Pressable onPress={onPress} className={`min-h-14 items-center justify-center rounded-2xl border border-emerald-200 bg-white px-5 active:bg-emerald-50 ${className}`}>
      <Text className="text-base font-bold text-emerald-700">{title}</Text>
    </Pressable>
  );
}
