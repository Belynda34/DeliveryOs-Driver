import { createNavigationContainerRef } from '@react-navigation/native';

import type { RootStackParamList } from '@/navigation/RootNavigator';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigateToNewDeliveryRequest(orderId: string, createdAt: string): void {
  if (!navigationRef.isReady()) {
    return;
  }
  navigationRef.navigate('NewDeliveryRequest', { orderId, createdAt });
}
