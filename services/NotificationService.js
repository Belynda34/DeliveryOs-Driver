import { Platform } from 'react-native';
import getDevicePushTokenAsync from 'expo-notifications/build/getDevicePushTokenAsync';
import setNotificationChannelAsync from 'expo-notifications/build/setNotificationChannelAsync';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { addNotificationReceivedListener, addNotificationResponseReceivedListener } from 'expo-notifications/build/NotificationsEmitter';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';

setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: false, shouldShowList: false, shouldPlaySound: false, shouldSetBadge: false }),
});

export async function registerForDeliveryNotifications(onToken) {
  if (Platform.OS === 'android') {
    await setNotificationChannelAsync('delivery-requests', { name: 'Delivery requests', importance: 5 });
  }
  const current = await getPermissionsAsync();
  const permission = current.status === 'granted' ? current : await requestPermissionsAsync();
  if (permission.status !== 'granted') return null;
  const token = await getDevicePushTokenAsync();
  onToken?.(token.data);
  return token.data;
}

export function subscribeToNewOrders(onOrder) {
  const receive = addNotificationReceivedListener((notification) => {
    const data = notification.request.content.data;
    if (data?.type === 'NEW_ORDER' && data.orderId) onOrder(data);
  });
  const response = addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    if (data?.type === 'NEW_ORDER' && data.orderId) onOrder(data);
  });
  return () => { receive.remove(); response.remove(); };
}
