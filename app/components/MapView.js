import React from "react";
import { StyleSheet, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const MapViewComponent = ({ style, currentLocation, destination }) => {
  const initialRegion = {
    latitude:
      currentLocation?.latitude || destination?.location?.latitude || 35.6895,
    longitude:
      currentLocation?.longitude ||
      destination?.location?.longitude ||
      139.6917,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <MapView
      provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
      style={[styles.map, style]}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton
    >
      {currentLocation && (
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          title="You are here"
          description="Your current location"
          pinColor="#007AFF"
        />
      )}
      {destination?.location && (
        <Marker
          coordinate={{
            latitude: destination.location.latitude,
            longitude: destination.location.longitude,
          }}
          title={destination.displayName?.text || "Station"}
          description={destination.formattedAddress || "Address not available"}
          pinColor="#FF3B30"
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default MapViewComponent;
