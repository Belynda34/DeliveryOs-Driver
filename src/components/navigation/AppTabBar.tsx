import { Alert, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { RootStackParamList } from '@/navigation/RootNavigator';
import * as AuthService from '@/services/AuthService';
import { useAppDispatch } from '@/store';
import { clearSession } from '@/store/sessionSlice';

type TabKey = 'HomeDashboard' | 'Earnings';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'HomeDashboard', label: 'Home' },
  { key: 'Earnings', label: 'Earnings' },
];

type AppTabBarProps = { active: TabKey };

export function AppTabBar({ active }: AppTabBarProps): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const handleLogout = (): void => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          dispatch(clearSession());
          void AuthService.clearSession();
        },
      },
    ]);
  };

  return (
    <View
      className="absolute inset-x-0 bottom-0 flex-row items-center gap-3 rounded-t-card border-t border-border bg-surface px-6 pt-3"
      style={{ paddingBottom: insets.bottom + 12 }}>
      <View className="flex-1 flex-row gap-2 rounded-pill bg-background p-1">
        {TABS.map(({ key, label }) => {
          const isActive = key === active;
          return (
            <Pressable
              key={key}
              disabled={isActive}
              onPress={() => navigation.navigate(key)}
              className={`flex-1 items-center rounded-pill py-2 ${isActive ? 'bg-accent' : ''}`}>
              <Text
                className={`text-sm font-semibold ${
                  isActive ? 'text-accent-foreground' : 'text-text-secondary'
                }`}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable onPress={handleLogout} className="rounded-pill bg-surface-raised px-4 py-2">
        <Text className="text-sm font-semibold text-error">Logout</Text>
      </Pressable>
    </View>
  );
}
