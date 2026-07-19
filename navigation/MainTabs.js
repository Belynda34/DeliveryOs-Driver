import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { APP_ROUTES } from '../constants/routes';
import EarningsScreen from '../screens/main/EarningsScreen';
import HomeScreen from '../screens/main/HomeScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: { height: 64, paddingTop: 8 },
        tabBarLabelStyle: { fontWeight: '700', fontSize: 12 },
      }}
    >
      <Tab.Screen name={APP_ROUTES.HOME} component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name={APP_ROUTES.EARNINGS} component={EarningsScreen} />
    </Tab.Navigator>
  );
}
