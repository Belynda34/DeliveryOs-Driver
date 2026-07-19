import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@deliveryos_driver_session';

export async function loadDriverSession() {
  const value = await AsyncStorage.getItem(SESSION_KEY);
  return value ? JSON.parse(value) : null;
}

export function saveDriverSession(driver) {
  return AsyncStorage.setItem(SESSION_KEY, JSON.stringify(driver));
}

export function clearDriverSession() {
  return AsyncStorage.removeItem(SESSION_KEY);
}
