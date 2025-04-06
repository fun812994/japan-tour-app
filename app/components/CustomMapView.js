import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useTranslation } from "react-i18next";

const CustomMapView = ({ currentLocation, destination }) => {
  const { t } = useTranslation();
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && currentLocation?.coords) {
      try {
        mapRef.current.animateToRegion(
          {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      } catch (error) {
        console.error("Error animating map:", error);
      }
    }
  }, [currentLocation]);

  const initialRegion = currentLocation?.coords
    ? {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        latitude: 35.6762,
        longitude: 139.6503,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

  try {
    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.select({
            ios: undefined,
            android: PROVIDER_GOOGLE,
          })}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          loadingEnabled={true}
          onError={(error) => console.error("Map error:", error)}
        >
          {destination && (
            <Marker
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              title={destination.name || ""}
              description={destination.address || ""}
              pinColor="red"
            />
          )}
        </MapView>
      </View>
    );
  } catch (error) {
    console.error("Error rendering map:", error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("mapError")}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 16,
    textAlign: "center",
  },
});

export default CustomMapView;
