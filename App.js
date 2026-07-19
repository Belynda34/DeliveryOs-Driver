import 'react-native-gesture-handler';
import './global.css';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

import RootNavigator from './navigation/RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function App() {

    useEffect(() => {
    AsyncStorage.removeItem('@deliveryos_driver_session');
  }, []);
  return (
    <>
      <RootNavigator />
      <StatusBar style="dark" />
    </>
  );
}
