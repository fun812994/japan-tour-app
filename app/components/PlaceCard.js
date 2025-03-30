import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PlaceCard({ placeName }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{placeName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
