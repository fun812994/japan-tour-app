import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

// Screens
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import LoginScreen from "../screens/LoginScreen";
import StationDetailsScreen from "../screens/StationDetailsScreen";
import LanguageSelectScreen from "../screens/LanguageSelectScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FF4B4B",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="LanguageSelect"
        component={LanguageSelectScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainHome"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StationDetails"
        component={StationDetailsScreen}
        options={({ route }) => ({
          title: route.params?.station?.name || t("stationDetails"),
        })}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Map") {
            iconName = "map";
          } else if (route.name === "Notifications") {
            iconName = "notifications";
          } else if (route.name === "Settings") {
            iconName = "settings";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: t("home"), headerShown: false }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ title: t("map") }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: t("notifications") }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t("settings") }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
