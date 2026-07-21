import firestore from '@react-native-firebase/firestore';
import messaging, { type FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import { navigateToNewDeliveryRequest } from '@/navigation/navigationRef';

type NewOrderMessageData = {
  type?: string;
  orderId?: string;
  createdAt?: string;
};

function handleNewOrderMessage(remoteMessage: FirebaseMessagingTypes.RemoteMessage): void {
  const data = remoteMessage.data as NewOrderMessageData | undefined;
  if (!data || data.type !== 'NEW_ORDER' || !data.orderId || !data.createdAt) {
    return;
  }
  navigateToNewDeliveryRequest(data.orderId, data.createdAt);
}

async function writeFcmToken(driverId: string, token: string): Promise<void> {
  try {
    await firestore().collection('drivers').doc(driverId).update({ fcmToken: token });
  } catch (error) {
    console.error('[PushNotificationService/writeFcmToken]', error);
  }
}

export function registerDeviceToken(driverId: string): () => void {
  messaging()
    .requestPermission()
    .then((authStatus) => {
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (!enabled) {
        return;
      }
      return messaging()
        .getToken()
        .then((token) => writeFcmToken(driverId, token));
    })
    .catch((error) => {
      console.error('[PushNotificationService/registerDeviceToken]', error);
    });

  return messaging().onTokenRefresh((token) => {
    writeFcmToken(driverId, token).catch((error) => {
      console.error('[PushNotificationService/onTokenRefresh]', error);
    });
  });
}

export function registerForegroundHandler(): () => void {
  return messaging().onMessage(async (remoteMessage) => {
    handleNewOrderMessage(remoteMessage);
  });
}

export function registerBackgroundHandler(): void {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('[PushNotificationService/backgroundHandler]', remoteMessage.data);
  });

  messaging().onNotificationOpenedApp((remoteMessage) => {
    handleNewOrderMessage(remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        handleNewOrderMessage(remoteMessage);
      }
    })
    .catch((error) => {
      console.error('[PushNotificationService/getInitialNotification]', error);
    });
}
