import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import LoginScreen from "../components/LoginScreen";
import HomeScreen from "../components/HomeScreen";
import StationDetails from "../components/StationDetails";
import MapView from "../components/MapView";
import NotificationTest from "../components/NotificationTest";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StationDetails"
        component={StationDetails}
        options={{ title: "Station Details" }}
      />
      <Stack.Screen
        name="NotificationTest"
        component={NotificationTest}
        options={{ title: "Test Notifications" }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Map"
          component={MapView}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Details"
          component={StationDetails}
          options={{ title: "Station Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
