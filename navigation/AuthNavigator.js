import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AUTH_ROUTES } from '../constants/routes';
import LoginScreen from '../screens/auth/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AUTH_ROUTES.SIGN_IN} component={LoginScreen} />
    </Stack.Navigator>
  );
}
