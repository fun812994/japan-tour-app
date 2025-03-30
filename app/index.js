import React from "react";
import { SafeAreaView } from "react-native";
import AppNavigator from "./navigation/AppNavigator";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppNavigator />
    </SafeAreaView>
  );
}
