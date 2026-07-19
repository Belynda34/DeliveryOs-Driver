import { Text, View } from 'react-native';

export default function Avatar({ initials = 'DD', size = 'md' }) {
  const sizeClasses = {
    sm: 'h-9 w-9',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <View className={`${sizeClasses[size]} items-center justify-center rounded-full bg-emerald-100`}>
      <Text className="text-sm font-bold text-emerald-700">{initials}</Text>
    </View>
  );
}
