import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { locationService } from "../services/locationService";
import notificationService from "../services/notificationService";
import MapView from "./MapView";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearestStation, setNearestStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setupNotifications();
    findNearestStation();
  }, []);

  const setupNotifications = async () => {
    try {
      await notificationService.registerForPushNotifications();
      await notificationService.scheduleWelcomeNotification();
    } catch (error) {
      console.error("Error setting up notifications:", error);
    }
  };

  const findNearestStation = async () => {
    try {
      setLoading(true);
      setError(null);

      const location = await locationService.getCurrentLocation();
      setCurrentLocation(location);

      const station = await locationService.findNearestTrainStation(location);
      if (!station || !station.displayName) {
        throw new Error("Invalid station data received");
      }
      setNearestStation(station);

      // Send notification about the nearest station
      await notificationService.scheduleStationNotification(station);
    } catch (err) {
      setError(err.message);
      console.error("Error finding nearest station:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
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

  if (!nearestStation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No station found nearby</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={findNearestStation}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          currentLocation={currentLocation}
          destination={nearestStation}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.stationCard}>
          <View style={styles.stationHeader}>
            <MaterialIcons name="train" size={24} color="#007AFF" />
            <Text style={styles.stationName}>
              {nearestStation.displayName?.text || "Unknown Station"}
            </Text>
          </View>

          <Text style={styles.stationAddress}>
            {nearestStation.formattedAddress || "Address not available"}
          </Text>

          {nearestStation.rating && (
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{nearestStation.rating}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() =>
              navigation.navigate("StationDetails", { station: nearestStation })
            }
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
            <MaterialIcons name="chevron-right" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={findNearestStation}
        >
          <MaterialIcons name="refresh" size={24} color="#007AFF" />
          <Text style={styles.refreshButtonText}>Refresh Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.testButton}
          onPress={() => navigation.navigate("NotificationTest")}
        >
          <Text style={styles.buttonText}>Test Notifications</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mapContainer: {
    height: 300,
    width: "100%",
  },
  map: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  stationCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  stationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  stationName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  stationAddress: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  ratingText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  detailsButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginLeft: 8,
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
  testButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default HomeScreen;
