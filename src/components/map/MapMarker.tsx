import { View } from 'react-native';

type MapMarkerVariant = 'current' | 'destination';

type Props = {
  variant: MapMarkerVariant;
};

export function MapMarker({ variant }: Props): React.JSX.Element {
  if (variant === 'current') {
    return (
      <View className="h-7 w-7 items-center justify-center rounded-full border-2 border-accent bg-background/40">
        <View className="h-3 w-3 rounded-full bg-text-primary" />
      </View>
    );
  }

  return (
    <View className="items-center">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-surface-raised">
        <View className="h-4 w-4 rounded-full bg-text-primary" />
      </View>
      <View className="-mt-1 h-2 w-2 rotate-45 rounded-sm bg-surface-raised" />
    </View>
  );
}
