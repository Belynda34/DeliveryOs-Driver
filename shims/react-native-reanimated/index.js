// Minimal shim for react-native-reanimated to allow Metro bundling
// This is a DEVELOPMENT shim — install the real package for production.

function makeMutable(initial) {
  return { value: initial };
}

function withRepeat(animation, count, reverse = false) {
  return animation;
}

function withSequence(...animations) {
  return animations[animations.length - 1];
}

function useSharedValue(initial) {
  const ref = { current: { value: initial } };
  return ref.current;
}

function useAnimatedStyle(fn) {
  // Return a passthrough function that calls the passed fn.
  return fn;
}

module.exports = {
  makeMutable,
  withRepeat,
  withSequence,
  useSharedValue,
  useAnimatedStyle,
};
