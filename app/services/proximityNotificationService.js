import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { locationService } from "./locationService";
import { aiService } from "./aiService";

class ProximityNotificationService {
  constructor() {
    this.isMonitoring = false;
    this.lastNotificationTime = null;
    this.NOTIFICATION_COOLDOWN = 60 * 60 * 1000; // 1 hour cooldown
    this.PROXIMITY_THRESHOLD = 500; // 500 meters
  }

  async startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

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
        this.handleLocationUpdate.bind(this)
      );
    } catch (error) {
      console.error("Error starting location monitoring:", error);
    }
  }

  async handleLocationUpdate(location) {
    try {
      const nearestStation = await locationService.findNearestTrainStation(
        location.coords.latitude,
        location.coords.longitude
      );

      if (!nearestStation) return;

      // Calculate distance to station
      const distance = this.calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        nearestStation.latitude,
        nearestStation.longitude
      );

      // Check if we're within proximity threshold
      if (distance <= this.PROXIMITY_THRESHOLD) {
        await this.checkAndSendNotification(nearestStation);
      }
    } catch (error) {
      console.error("Error handling location update:", error);
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

  async checkAndSendNotification(station) {
    const now = Date.now();
    if (
      this.lastNotificationTime &&
      now - this.lastNotificationTime < this.NOTIFICATION_COOLDOWN
    ) {
      return;
    }

    try {
      // Get cultural information from AI service
      const culturalInfo = await aiService.getCulturalInsights(
        station.latitude,
        station.longitude
      );

      // Schedule notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Near ${station.name}`,
          body: culturalInfo.summary,
          sound: true,
        },
        trigger: { seconds: 60 }, // Send after 1 minute
        data: {
          stationId: station.id,
          latitude: station.latitude,
          longitude: station.longitude,
        },
      });

      this.lastNotificationTime = now;
    } catch (error) {
      console.error("Error sending proximity notification:", error);
    }
  }

  stopMonitoring() {
    this.isMonitoring = false;
  }
}

export const proximityNotificationService = new ProximityNotificationService();
