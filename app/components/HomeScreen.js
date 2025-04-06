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
import CustomMapView from "./MapView";
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
      await notificationService.setupNotifications();
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
        <MaterialIcons name="error" size={48} color="#dc3545" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={findNearestStation}
        >
          <MaterialIcons name="refresh" size={24} color="#fff" />
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        <CustomMapView
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
              {nearestStation?.name || "Unknown Station"}
            </Text>
          </View>

          <Text style={styles.stationAddress}>
            {nearestStation?.address || "Address not available"}
          </Text>

          {nearestStation?.rating && (
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{nearestStation.rating}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() =>
              navigation.navigate("StationDetails", {
                stationId: nearestStation.id,
              })
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
          onPress={() => navigation.navigate("Notifications")}
        >
          <MaterialIcons name="notifications" size={24} color="#fff" />
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
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  stationCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
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
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
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
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
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
    marginBottom: 10,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginLeft: 10,
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 10,
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
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginVertical: 20,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 10,
  },
});

export default HomeScreen;
