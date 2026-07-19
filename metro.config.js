const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Provide a local shim for react-native-reanimated so native installations
// are not required during development on devices when the app doesn't
// actually rely on Reanimated features yet.
const reanimatedShimPath = path.resolve(
  __dirname,
  "shims",
  "react-native-reanimated",
);

config.resolver = {
  ...(config.resolver || {}),
  extraNodeModules: {
    ...(config.resolver && config.resolver.extraNodeModules
      ? config.resolver.extraNodeModules
      : {}),
    "react-native-reanimated": reanimatedShimPath,
  },
};

// Ensure Metro watches the shim folder.
config.watchFolders = Array.from(
  new Set([...(config.watchFolders || []), path.resolve(__dirname, "shims")]),
);

module.exports = withNativeWind(config, { input: "./global.css" });
