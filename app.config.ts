import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'my-expo-app',
  slug: 'my-expo-app',
  version: '1.0.0',
  web: {
    favicon: './assets/favicon.png',
  },
  experiments: {
    tsconfigPaths: true,
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        image: './assets/splash.png',
        backgroundColor: '#ffffff',
      },
    ],
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    '@react-native-firebase/messaging',
    [
      '@rnmapbox/maps',
      {
        RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOADS_TOKEN,
      },
    ],
  ],
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.walmond.myexpoapp',
    googleServicesFile: './google-services.json',
  },
};

export default config;
