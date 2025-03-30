import React from "react";
import { Stack } from "expo-router";
import NearestStation from "./components/NearestStation";

export default function NearestStationScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Nearest Train Station",
          headerShown: true,
        }}
      />
      <NearestStation />
    </>
  );
}
