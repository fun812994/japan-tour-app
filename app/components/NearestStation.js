import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { locationService } from "../services/locationService";
import MapView from "./MapView";

const NearestStation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearestStation, setNearestStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    findNearestStation();
  }, []);

  const findNearestStation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current location
      const location = await locationService.getCurrentLocation();
      setCurrentLocation(location);

      // Find nearest train station
      const station = await locationService.findNearestTrainStation(location);
      setNearestStation(station);

      // Temporarily disabled AI features
      // const stationDetails = await locationService.getStationDetails(station);
      // const [desc, insights] = await Promise.all([
      //   generateLocationDescription(stationDetails),
      //   generateCulturalInsights(stationDetails),
      // ]);
      // setDescription(desc);
      // setCulturalInsights(insights);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Finding nearest station...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={findNearestStation}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        currentLocation={currentLocation}
        destination={nearestStation}
      />
      <View style={styles.content}>
        <View style={styles.stationInfo}>
          <Text style={styles.stationName}>{nearestStation.name}</Text>
          <Text style={styles.stationAddress}>{nearestStation.address}</Text>
          {nearestStation.rating && (
            <Text style={styles.distance}>
              Rating: {nearestStation.rating} ⭐
            </Text>
          )}
        </View>

        {/* Temporarily disabled AI features
        <TouchableOpacity
          style={styles.insightsButton}
          onPress={() => setShowInsights(!showInsights)}
        >
          <MaterialIcons
            name={showInsights ? "expand-less" : "expand-more"}
            size={24}
            color="#333"
          />
          <Text style={styles.insightsButtonText}>
            {showInsights ? "Hide Cultural Insights" : "Show Cultural Insights"}
          </Text>
        </TouchableOpacity>

        {showInsights && (
          <View style={styles.insights}>
            <Text style={styles.insightsText}>{culturalInsights}</Text>
          </View>
        )}
        */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  map: {
    height: "40%",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stationInfo: {
    marginBottom: 20,
  },
  stationName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  stationAddress: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  distance: {
    fontSize: 14,
    color: "#888",
  },
});

export default NearestStation;
