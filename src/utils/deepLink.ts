import { Linking } from 'react-native';

import type { GeoLocation } from '@/types';

export function buildNavigationUrl(destination: GeoLocation): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
}

export async function openNavigation(destination: GeoLocation): Promise<void> {
  try {
    await Linking.openURL(buildNavigationUrl(destination));
  } catch (error) {
    console.error('[deepLink/openNavigation]', error);
  }
}
