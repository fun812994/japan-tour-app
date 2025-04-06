import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import supabaseService from "./supabaseService";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import i18n from "../i18n";

class NotificationService {
  constructor() {
    this.stationProximityTimers = new Map();
    this.lastNotificationTime = null;
    this.NOTIFICATION_COOLDOWN = 30000; // 30 seconds
    this.PROXIMITY_THRESHOLD = 500; // 500 meters
  }

  async setupNotifications() {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        throw new Error("Permission not granted for notifications");
      }

      // Configure notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      return true;
    } catch (error) {
      console.error("Error setting up notifications:", error);
      return false;
    }
  }

  async scheduleWelcomeNotification() {
    try {
      const language = (await AsyncStorage.getItem("language")) || "en";
      const title =
        language === "ko"
          ? "일본 여행 앱에 오신 것을 환영합니다!"
          : "Welcome to Japan Tour App!";
      const body =
        language === "ko"
          ? "근처 역의 문화와 역사를 발견해보세요."
          : "Discover the culture and history of nearby stations.";

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: { seconds: 1 },
      });
    } catch (error) {
      console.error("Error scheduling welcome notification:", error);
    }
  }

  async scheduleStationNotification(station, culture) {
    try {
      const now = Date.now();
      if (
        this.lastNotificationTime &&
        now - this.lastNotificationTime < this.NOTIFICATION_COOLDOWN
      ) {
        return;
      }

      const language = (await AsyncStorage.getItem("language")) || "en";
      const stationName = language === "ko" ? station.name_ko : station.name;
      const description =
        language === "ko"
          ? culture.short_description_ko
          : culture.short_description;

      await Notifications.scheduleNotificationAsync({
        content: {
          title:
            language === "ko"
              ? `🚉 ${stationName} 근처입니다!`
              : `🚉 You're near ${stationName}!`,
          body: description,
          data: { stationId: station.id, action: "view_details" },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: { seconds: 1 },
      });

      this.lastNotificationTime = now;
    } catch (error) {
      console.error("Error scheduling station notification:", error);
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error canceling notifications:", error);
      throw error;
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
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

  async checkStationProximity(userLocation, station, culture) {
    const distance = this.calculateDistance(
      userLocation.coords.latitude,
      userLocation.coords.longitude,
      station.latitude,
      station.longitude
    );

    const stationId = station.id;

    // If within proximity threshold
    if (distance <= this.PROXIMITY_THRESHOLD) {
      if (!this.stationProximityTimers.has(stationId)) {
        // Start a 30-second timer
        const timerId = setTimeout(async () => {
          await this.scheduleStationNotification(station, culture);
          this.stationProximityTimers.delete(stationId);
        }, 30000); // 30 seconds

        this.stationProximityTimers.set(stationId, timerId);
      }
    } else {
      // Clear timer if user moves away
      if (this.stationProximityTimers.has(stationId)) {
        clearTimeout(this.stationProximityTimers.get(stationId));
        this.stationProximityTimers.delete(stationId);
      }
    }
  }

  async handleNotificationResponse(response) {
    const data = response.notification.request.content.data;
    if (data?.action === "view_details" && data?.stationId) {
      return {
        shouldNavigate: true,
        stationId: data.stationId,
      };
    }
    return null;
  }
}

export default new NotificationService();
