import React from "react";
import { View, StyleSheet } from "react-native";
import LocationDetails from "../components/LocationDetails";
import MapView from "../components/MapView";

const LocationScreen = ({ route }) => {
  const { location } = route.params;

  return (
    <View style={styles.container}>
      <MapView location={location} style={styles.map} />
      <LocationDetails location={location} style={styles.details} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: "40%",
  },
  details: {
    flex: 1,
  },
});

export default LocationScreen;
