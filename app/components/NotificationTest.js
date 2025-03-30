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

const NotificationTest = () => {
  const [notification, setNotification] = useState(false);
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    setupNotifications();
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

  async function sendTestNotification() {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notification",
          body: "This is a test notification from Japan Tour App!",
          sound: true,
        },
        trigger: { seconds: 2 },
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
      Alert.alert(
        "Error",
        "Failed to send test notification. Please try again."
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Test</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Permission Status:</Text>
        <Text style={styles.value}>{permission || "Not checked"}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={sendTestNotification}>
        <Text style={styles.buttonText}>Send Test Notification</Text>
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
});

export default NotificationTest;
