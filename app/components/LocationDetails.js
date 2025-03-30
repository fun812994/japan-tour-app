import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useAI } from "../hooks/useAI";
import { MaterialIcons } from "@expo/vector-icons";

const LocationDetails = ({ location }) => {
  const {
    loading,
    error,
    generateLocationDescription,
    generateCulturalInsights,
  } = useAI();
  const [description, setDescription] = useState("");
  const [culturalInsights, setCulturalInsights] = useState("");
  const [showCulturalInsights, setShowCulturalInsights] = useState(false);

  useEffect(() => {
    loadLocationDetails();
  }, [location]);

  const loadLocationDetails = async () => {
    try {
      const [locationDesc, insights] = await Promise.all([
        generateLocationDescription(location),
        generateCulturalInsights(location),
      ]);
      setDescription(locationDesc);
      setCulturalInsights(insights);
    } catch (err) {
      console.error("Error loading location details:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Generating location details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About {location.name}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <TouchableOpacity
        style={styles.insightsButton}
        onPress={() => setShowCulturalInsights(!showCulturalInsights)}
      >
        <MaterialIcons
          name={showCulturalInsights ? "expand-less" : "expand-more"}
          size={24}
          color="#000"
        />
        <Text style={styles.insightsButtonText}>
          {showCulturalInsights
            ? "Hide Cultural Insights"
            : "Show Cultural Insights"}
        </Text>
      </TouchableOpacity>

      {showCulturalInsights && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cultural Insights</Text>
          <Text style={styles.description}>{culturalInsights}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
  insightsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  insightsButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
});

export default LocationDetails;
