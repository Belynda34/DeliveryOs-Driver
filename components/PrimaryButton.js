import { ActivityIndicator, Pressable, Text } from 'react-native';

export default function PrimaryButton({ title, onPress, loading, disabled, className = '' }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`min-h-14 items-center justify-center rounded-2xl bg-emerald-600 px-5 active:bg-emerald-700 ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {loading ? <ActivityIndicator color="#ffffff" /> : <Text className="text-base font-bold text-white">{title}</Text>}
    </Pressable>
  );
}
