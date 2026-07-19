import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { APP_ROUTES } from '../constants/routes';
import ActiveDeliveryScreen from '../screens/main/ActiveDeliveryScreen';
import MainTabs from './MainTabs';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={APP_ROUTES.MAIN_TABS} component={MainTabs} />
      <Stack.Screen name={APP_ROUTES.ACTIVE_DELIVERY} component={ActiveDeliveryScreen} />
    </Stack.Navigator>
  );
}
