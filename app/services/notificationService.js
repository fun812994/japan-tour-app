import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

const notificationService = {
  async registerForPushNotifications() {
    try {
      if (!Device.isDevice) {
        console.log("Must use physical device for Push Notifications");
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });

      console.log("Push token:", token.data);
      return token.data;
    } catch (error) {
      console.error("Error registering for push notifications:", error);
      throw error;
    }
  },

  async scheduleStationNotification(station) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Nearest Station Found!",
          body: `${station.displayName.text} is nearby. Tap to view details.`,
          data: { stationId: station.id },
        },
        trigger: null, // null means send immediately
      });
    } catch (error) {
      console.error("Error scheduling notification:", error);
      throw error;
    }
  },

  async scheduleWelcomeNotification() {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Welcome to Japan Tour App!",
          body: "We'll help you find the nearest train stations and provide cultural insights.",
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Error scheduling welcome notification:", error);
      throw error;
    }
  },

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error canceling notifications:", error);
      throw error;
    }
  },
};

export default notificationService;
