import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './global.css';
import '@/services/firebase';
import { RootNavigator } from '@/navigation/RootNavigator';
import * as AuthService from '@/services/AuthService';
import * as PushNotificationService from '@/services/PushNotificationService';
import { store, useAppDispatch, useAppSelector } from '@/store';
import {
  selectDriverId,
  selectIsSessionLoading,
  setSession,
  setSessionLoading,
} from '@/store/sessionSlice';

// Registered at module scope, not inside a component: setBackgroundMessageHandler must
// be called as early as possible so it's wired even if the app is launched from a killed
// state by the OS delivering the message, not by the user opening it.
PushNotificationService.registerBackgroundHandler();

function AppContent(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const isSessionLoading = useAppSelector(selectIsSessionLoading);
  const driverId = useAppSelector(selectDriverId);

  useEffect(() => {
    let isMounted = true;
    AuthService.getSession()
      .then((session) => {
        if (!isMounted) {
          return;
        }
        if (session) {
          dispatch(setSession(session));
        }
        dispatch(setSessionLoading(false));
      })
      .catch(() => {
        if (isMounted) {
          dispatch(setSessionLoading(false));
        }
      });
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    return PushNotificationService.registerForegroundHandler();
  }, []);

  useEffect(() => {
    if (!driverId) {
      return;
    }
    return PushNotificationService.registerDeviceToken(driverId);
  }, [driverId]);

  if (isSessionLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        {/* ActivityIndicator's `color` is a native prop, not a style — mirrors ui-tokens.md's accent */}
        <ActivityIndicator color="#1FD65F" />
      </View>
    );
  }

  return <RootNavigator />;
}

export default function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
        <StatusBar style="light" />
      </SafeAreaProvider>
    </Provider>
  );
}
