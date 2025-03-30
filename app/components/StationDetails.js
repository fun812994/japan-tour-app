import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAI } from "../hooks/useAI";
import MapView from "./MapView";

const StationDetails = ({ route, navigation }) => {
  const { station } = route.params;
  const { generateLocationDescription, generateCulturalInsights } = useAI();
  const [description, setDescription] = useState("");
  const [culturalInsights, setCulturalInsights] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCulturalInsights, setShowCulturalInsights] = useState(false);

  useEffect(() => {
    loadStationDetails();
  }, []);

  const loadStationDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const stationDetails = {
        name: station.name,
        category: "train_station",
        description: `Train station located at ${station.address}`,
        latitude: station.location.latitude,
        longitude: station.location.longitude,
        culturalInfo: {
          openingHours: station.openingHours,
          rating: station.rating,
          phoneNumber: station.phoneNumber,
          website: station.website,
        },
      };

      const [desc, insights] = await Promise.all([
        generateLocationDescription(stationDetails),
        generateCulturalInsights(stationDetails),
      ]);

      setDescription(desc);
      setCulturalInsights(insights);
    } catch (err) {
      setError(err.message);
      console.error("Error loading station details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading station details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadStationDetails}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          currentLocation={null}
          destination={station}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.stationInfo}>
          <View style={styles.stationHeader}>
            <MaterialIcons name="train" size={24} color="#007AFF" />
            <Text style={styles.stationName}>{station.name}</Text>
          </View>

          <Text style={styles.stationAddress}>{station.address}</Text>

          {station.rating && (
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{station.rating}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Station</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <TouchableOpacity
          style={styles.insightsButton}
          onPress={() => setShowCulturalInsights(!showCulturalInsights)}
        >
          <MaterialIcons
            name={showCulturalInsights ? "expand-less" : "expand-more"}
            size={24}
            color="#333"
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

        {station.openingHours && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Opening Hours</Text>
            <Text style={styles.description}>
              {station.openingHours.weekdayText.join("\n")}
            </Text>
          </View>
        )}

        {station.phoneNumber && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <Text style={styles.description}>{station.phoneNumber}</Text>
          </View>
        )}

        {station.website && (
          <TouchableOpacity
            style={styles.websiteButton}
            onPress={() => Linking.openURL(station.website)}
          >
            <MaterialIcons name="language" size={20} color="#007AFF" />
            <Text style={styles.websiteButtonText}>Visit Website</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mapContainer: {
    height: 200,
    width: "100%",
  },
  map: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  stationInfo: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  stationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  stationName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  stationAddress: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  ratingText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
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
    borderRadius: 8,
    marginBottom: 10,
  },
  insightsButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  websiteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  websiteButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
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
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default StationDetails;
