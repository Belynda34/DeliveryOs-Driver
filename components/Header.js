import { Pressable, Text, View } from 'react-native';

import Avatar from './Avatar';

export default function Header({ title, subtitle, initials, onAvatarPress, backLabel, onBackPress }) {
  return (
    <View className="flex-row items-center justify-between px-5 pb-3 pt-2">
      <View className="flex-1">
        {backLabel ? (
          <Pressable onPress={onBackPress} className="mb-2 self-start">
            <Text className="text-sm font-semibold text-emerald-700">‹ {backLabel}</Text>
          </Pressable>
        ) : null}
        <Text className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</Text>
        {subtitle ? <Text className="mt-1 text-sm text-slate-500">{subtitle}</Text> : null}
      </View>
      {initials ? (
        <Pressable onPress={onAvatarPress} accessibilityRole="button" accessibilityLabel="Driver profile">
          <Avatar initials={initials} />
        </Pressable>
      ) : null}
    </View>
  );
}
