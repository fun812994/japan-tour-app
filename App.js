import React, { useEffect, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nextProvider } from "react-i18next";
import i18n from "./app/i18n";
import AppNavigator from "./app/navigation/AppNavigator";
import * as Notifications from "expo-notifications";
import { supabase } from "./app/lib/supabase";
import { NavigationContainer } from "@react-navigation/native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const navigationRef = useRef();

  useEffect(() => {
    // Set up notification response handler
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const data = response.notification.request.content.data;
        if (data?.action === "view_details" && data?.stationId) {
          try {
            // Fetch station data
            const { data: station, error } = await supabase
              .from("stations")
              .select("*")
              .eq("id", data.stationId)
              .limit(1)
              .maybeSingle();

            if (error) throw error;
            if (!station) {
              console.error("Station not found");
              return;
            }

            // Navigate to StationDetails
            navigationRef.current?.navigate("Home", {
              screen: "StationDetails",
              params: { station, stationId: data.stationId },
            });
          } catch (error) {
            console.error("Error handling notification navigation:", error);
          }
        }
      }
    );

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
        </NavigationContainer>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}
