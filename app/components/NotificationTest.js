import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Modal,
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { locationService } from "../services/locationService";
import stationService from "../services/stationService";
import notificationService from "../services/notificationService";
import { useNavigation } from "@react-navigation/native";

const NotificationTest = () => {
  const navigation = useNavigation();
  const [notification, setNotification] = useState(false);
  const [permission, setPermission] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastNotificationTime, setLastNotificationTime] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationCulture, setStationCulture] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const NOTIFICATION_COOLDOWN = 5 * 1000;
  const PROXIMITY_THRESHOLD = 500;

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

  useEffect(() => {
    setupNotifications();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const result = await notificationService.handleNotificationResponse(
          response
        );
        if (result?.shouldNavigate) {
          navigation.navigate("StationDetails", {
            stationId: result.station.id,
          });
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  async function setupNotifications() {
    try {
      const hasPermission = await notificationService.setupNotifications();
      if (hasPermission) {
        setPermission("granted");
      } else {
        setPermission("denied");
      }
    } catch (error) {
      console.error("Error setting up notifications:", error);
      Alert.alert("Error", "Failed to set up notifications. Please try again.");
    }
  }

  async function startMonitoring() {
    if (isMonitoring) return;
    setIsMonitoring(true);

    try {
      // First check if location services are enabled
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert(
          "Location Services Disabled",
          "Please enable location services in your device settings to use this feature."
        );
        return;
      }

      // Request foreground permissions only
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "Please allow location access to find nearby train stations."
        );
        return;
      }

      // Start watching position with foreground updates only
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 30000, // Check every 30 seconds
          distanceInterval: 100, // Or when moved 100 meters
        },
        handleLocationUpdate
      );

      // Send a test notification immediately
      await sendTestNotification();
    } catch (error) {
      console.error("Error starting location monitoring:", error);
      Alert.alert(
        "Error",
        "Failed to start location monitoring. Please try again."
      );
    }
  }

  function stopMonitoring() {
    setIsMonitoring(false);
  }

  async function handleLocationUpdate(location) {
    try {
      const nearestStation = await locationService.findNearestTrainStation(
        location
      );
      console.log("Nearest station found:", nearestStation);

      if (nearestStation) {
        // Get station info from Supabase
        const stationInfo = await stationService.getStationInfo(
          nearestStation.id
        );
        if (stationInfo) {
          // Get cultural information for the station
          const cultureInfo = await stationService.getStationCulture(
            nearestStation.id
          );
          setStationCulture(cultureInfo);

          // Calculate distance to station
          const distance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            stationInfo.latitude,
            stationInfo.longitude
          );

          if (distance <= PROXIMITY_THRESHOLD) {
            await checkAndSendNotification(stationInfo, cultureInfo);
          }
        }
      }
    } catch (error) {
      console.error("Error handling location update:", error);
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

  async function sendTestNotification() {
    try {
      // Configure notification behavior for iOS
      if (Platform.OS === "ios") {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 Test Notification",
          body: "This is a test notification to verify notifications are working.",
          sound: true,
          priority:
            Platform.OS === "ios"
              ? "max"
              : Notifications.AndroidNotificationPriority.HIGH,
          vibrate: [0, 250, 250, 250],
          badge: 1,
          categoryIdentifier: "test-notification",
        },
        trigger: { seconds: 1 },
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
    }
  }

  async function checkAndSendNotification(station, cultureInfo) {
    const now = Date.now();
    if (
      lastNotificationTime &&
      now - lastNotificationTime < NOTIFICATION_COOLDOWN
    ) {
      return;
    }

    try {
      if (Platform.OS === "ios") {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🚂 You're near ${station.name}!`,
          body:
            cultureInfo?.short_description ||
            "Discover the history and culture of this station",
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          vibrate: [0, 250, 250, 250],
          data: {
            stationId: station.id,
            action: "show_details",
          },
        },
        trigger: { seconds: 1 },
      });

      setLastNotificationTime(now);
    } catch (error) {
      console.error("Error sending proximity notification:", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="notifications" size={24} color="#007AFF" />
        <Text style={styles.title}>Notification Test</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.status}>
          Notification Permission: {permission || "unknown"}
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            isMonitoring ? styles.buttonActive : styles.buttonInactive,
          ]}
          onPress={isMonitoring ? stopMonitoring : startMonitoring}
        >
          <MaterialIcons
            name={isMonitoring ? "location-on" : "location-off"}
            size={24}
            color="#fff"
          />
          <Text style={styles.buttonText}>
            {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
          </Text>
        </TouchableOpacity>

        {selectedStation && (
          <View style={styles.stationInfo}>
            <Text style={styles.stationName}>{selectedStation.name}</Text>
            <Text style={styles.stationAddress}>{selectedStation.address}</Text>
          </View>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Station Information</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {stationCulture && (
              <>
                <Text style={styles.modalText}>
                  {stationCulture.short_description}
                </Text>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("StationDetails", {
                      stationId: selectedStation.id,
                    });
                  }}
                >
                  <Text style={styles.detailsButtonText}>
                    View Full Details
                  </Text>
                  <MaterialIcons
                    name="arrow-forward"
                    size={24}
                    color="#007AFF"
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  content: {
    flex: 1,
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonActive: {
    backgroundColor: "#dc3545",
  },
  buttonInactive: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  stationInfo: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  stationName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  stationAddress: {
    fontSize: 14,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    marginBottom: 15,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
  },
  detailsButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginRight: 10,
  },
});

export default NotificationTest;
