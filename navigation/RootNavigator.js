import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useAuthStore from "../store/useAuthStore";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import useDeliveryStore from "../store/useDeliveryStore";
import { loadDriverSession } from "../services/SessionService";
import { APP_ROUTES } from "../constants/routes";
import { navigationRef } from "./navigationRef";

export default function RootNavigator() {
  const user = useAuthStore((state) => state.user);
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsBootstrapping = useAuthStore((state) => state.setIsBootstrapping);
  const incomingOrder = useDeliveryStore((state) => state.incomingOrder);
  const [navReady, setNavReady] = useState(false);

  useEffect(() => {
    loadDriverSession()
      .then((session) => setUser(session))
      .catch(() => setUser(null))
      .finally(() => setIsBootstrapping(false));
  }, []);

  useEffect(() => {
    if (!navReady || !user || !incomingOrder) return;
    const currentRoute = navigationRef.current?.getCurrentRoute();
    if (currentRoute?.name !== APP_ROUTES.NEW_DELIVERY) {
      navigationRef.current?.navigate(APP_ROUTES.NEW_DELIVERY);
    }
  }, [incomingOrder, user, navReady]);

  if (isBootstrapping) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer 
        ref={navigationRef}
        onReady={() => setNavReady(true)}
      >
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}