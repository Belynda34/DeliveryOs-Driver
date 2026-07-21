import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { navigationRef } from '@/navigation/navigationRef';
import { ActiveDeliveryScreen } from '@/screens/ActiveDeliveryScreen';
import { EarningsScreen } from '@/screens/EarningsScreen';
import { HomeDashboardScreen } from '@/screens/HomeDashboardScreen';
import { LoginScreen } from '@/screens/LoginScreen';
import { NewDeliveryRequestScreen } from '@/screens/NewDeliveryRequestScreen';
import { useAppSelector } from '@/store';
import { selectIsAuthenticated } from '@/store/sessionSlice';

export type RootStackParamList = {
  Login: undefined;
  HomeDashboard: undefined;
  NewDeliveryRequest: { orderId: string; createdAt: string } | undefined;
  ActiveDelivery: { orderId: string } | undefined;
  Earnings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="HomeDashboard" component={HomeDashboardScreen} />
            <Stack.Screen
              name="NewDeliveryRequest"
              component={NewDeliveryRequestScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen
              name="ActiveDelivery"
              component={ActiveDeliveryScreen}
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="Earnings" component={EarningsScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
