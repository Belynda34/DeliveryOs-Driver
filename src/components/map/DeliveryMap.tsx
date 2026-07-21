import { useMemo } from 'react';
import Mapbox, { Camera, LineLayer, MapView, MarkerView, ShapeSource } from '@rnmapbox/maps';

import { MapMarker } from '@/components/map/MapMarker';
import type { GeoLocation } from '@/types';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '');

const BOUNDS_PADDING = { paddingTop: 120, paddingBottom: 320, paddingLeft: 60, paddingRight: 60 };
const DESTINATION_ONLY_ZOOM = 14;

type Props = {
  currentLocation: GeoLocation | null;
  destination: GeoLocation;
};

function toPosition(location: GeoLocation): [number, number] {
  return [location.longitude, location.latitude];
}

export function DeliveryMap({ currentLocation, destination }: Props): React.JSX.Element {
  const destinationPosition = toPosition(destination);
  const currentPosition = currentLocation ? toPosition(currentLocation) : null;

  const routeGeoJson = useMemo(() => {
    if (!currentPosition) {
      return null;
    }
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: [currentPosition, destinationPosition],
      },
    };
  }, [currentPosition, destinationPosition]);

  return (
    <MapView style={{ flex: 1 }} styleURL={Mapbox.StyleURL.Dark}>
      {currentPosition ? (
        <Camera
          animationMode="none"
          bounds={{
            ne: [
              Math.max(currentPosition[0], destinationPosition[0]),
              Math.max(currentPosition[1], destinationPosition[1]),
            ],
            sw: [
              Math.min(currentPosition[0], destinationPosition[0]),
              Math.min(currentPosition[1], destinationPosition[1]),
            ],
            ...BOUNDS_PADDING,
          }}
        />
      ) : (
        <Camera
          animationMode="none"
          centerCoordinate={destinationPosition}
          zoomLevel={DESTINATION_ONLY_ZOOM}
        />
      )}

      {routeGeoJson ? (
        <ShapeSource id="deliveryRouteSource" shape={routeGeoJson}>
          <LineLayer
            id="deliveryRouteLine"
            style={{ lineColor: '#1FD65F', lineWidth: 4, lineCap: 'round', lineJoin: 'round' }}
          />
        </ShapeSource>
      ) : null}

      {currentPosition ? (
        <MarkerView coordinate={currentPosition}>
          <MapMarker variant="current" />
        </MarkerView>
      ) : null}

      <MarkerView coordinate={destinationPosition}>
        <MapMarker variant="destination" />
      </MarkerView>
    </MapView>
  );
}
