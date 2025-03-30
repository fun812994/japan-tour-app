import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Location from "expo-location";

const NotificationTest = () => {
  const [notification, setNotification] = useState(false);
  const [permission, setPermission] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastNotificationTime, setLastNotificationTime] = useState(null);
  const NOTIFICATION_COOLDOWN = 60 * 60 * 1000; // 1 hour cooldown
  const PROXIMITY_THRESHOLD = 5000; // Increased to 5km for testing

  useEffect(() => {
    setupNotifications();
    return () => {
      if (isMonitoring) {
        stopMonitoring();
      }
    };
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    return () => subscription.remove();
  }, []);

  async function setupNotifications() {
    try {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Failed to get permission for notifications!");
        return;
      }

      setPermission(finalStatus);
    } catch (error) {
      console.error("Error setting up notifications:", error);
      Alert.alert("Error", "Failed to set up notifications. Please try again.");
    }
  }

  async function startMonitoring() {
    if (isMonitoring) return;
    setIsMonitoring(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission not granted");
        return;
      }

      // Start watching position
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 30000, // Check every 30 seconds
          distanceInterval: 100, // Or when moved 100 meters
        },
        handleLocationUpdate
      );
    } catch (error) {
      console.error("Error starting location monitoring:", error);
    }
  }

  function stopMonitoring() {
    setIsMonitoring(false);
  }

  async function handleLocationUpdate(location) {
    try {
      const nearestStation = await locationService.findNearestTrainStation(
        location.coords.latitude,
        location.coords.longitude
      );

      // Transform the Places API response into our expected format
      const station = nearestStation
        ? {
            id: nearestStation.id,
            name: nearestStation.displayName.text,
            latitude: nearestStation.location.latitude,
            longitude: nearestStation.location.longitude,
            address: nearestStation.formattedAddress,
            rating: nearestStation.rating,
          }
        : {
            id: "test-station",
            name: "Test Station",
            latitude: location.coords.latitude + 0.001,
            longitude: location.coords.longitude + 0.001,
          };

      // Calculate distance to station
      const distance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        station.latitude,
        station.longitude
      );

      console.log("Distance to station:", distance, "meters");
      console.log("Station details:", station);

      // Check if we're within proximity threshold
      if (distance <= PROXIMITY_THRESHOLD) {
        await checkAndSendNotification(station);
      }
    } catch (error) {
      console.error("Error handling location update:", error);
      // For testing, create a dummy station even if there's an error
      const dummyStation = {
        id: "test-station",
        name: "Test Station",
        latitude: location.coords.latitude + 0.001,
        longitude: location.coords.longitude + 0.001,
      };
      await checkAndSendNotification(dummyStation);
    }
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  async function checkAndSendNotification(station) {
    const now = Date.now();
    if (
      lastNotificationTime &&
      now - lastNotificationTime < NOTIFICATION_COOLDOWN
    ) {
      return;
    }

    try {
      // Dummy cultural information until DeepSeek is set up
      const dummyCulturalInfo = {
        summary: `Welcome to ${station.name}! This area is rich in Japanese culture. Visit the nearby temples, try local street food, and explore the traditional shopping streets. Don't forget to check out the seasonal festivals and events happening around the station.`,
        recommendations: [
          "Visit local temples and shrines",
          "Try traditional street food",
          "Explore shopping streets",
          "Check seasonal events",
        ],
      };

      // Schedule notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Near ${station.name}`,
          body: dummyCulturalInfo.summary,
          sound: true,
        },
        trigger: { seconds: 60 }, // Send after 1 minute
        data: {
          stationId: station.id,
          latitude: station.latitude,
          longitude: station.longitude,
        },
      });

      setLastNotificationTime(now);
    } catch (error) {
      console.error("Error sending proximity notification:", error);
    }
  }

  async function simulateNearStation() {
    try {
      const { coords } = await Location.getCurrentPositionAsync({});
      const dummyStation = {
        id: "test-station",
        name: "Test Station",
        latitude: coords.latitude + 0.001,
        longitude: coords.longitude + 0.001,
        address: "Test Address",
        rating: 4.5,
      };
      await checkAndSendNotification(dummyStation);
    } catch (error) {
      console.error("Error simulating near station:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Station Proximity Notifications</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Permission Status:</Text>
        <Text style={styles.value}>{permission || "Not checked"}</Text>
        <Text style={styles.label}>Monitoring Status:</Text>
        <Text style={styles.value}>{isMonitoring ? "Active" : "Inactive"}</Text>
        <Text style={styles.label}>Proximity Threshold:</Text>
        <Text style={styles.value}>{PROXIMITY_THRESHOLD / 1000} km</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isMonitoring && styles.buttonActive]}
        onPress={isMonitoring ? stopMonitoring : startMonitoring}
      >
        <Text style={styles.buttonText}>
          {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.testButton]}
        onPress={simulateNearStation}
      >
        <Text style={styles.buttonText}>Simulate Near Station</Text>
      </TouchableOpacity>

      {notification && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationTitle}>Last Notification:</Text>
          <Text style={styles.notificationText}>
            {notification.request.content.title}
          </Text>
          <Text style={styles.notificationText}>
            {notification.request.content.body}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#007AFF",
  },
  infoContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  value: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonActive: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#e3f2fd",
    borderRadius: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007AFF",
  },
  notificationText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  testButton: {
    backgroundColor: "#34C759",
    marginTop: 10,
  },
});

export default NotificationTest;
