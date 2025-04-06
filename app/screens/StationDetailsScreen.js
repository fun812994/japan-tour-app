import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

const StationDetailsScreen = ({ route }) => {
  const { stationId, station: initialStation } = route.params;
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [station, setStation] = useState(initialStation);
  const [culture, setCulture] = useState(null);

  useEffect(() => {
    loadStationDetails();
  }, [i18n.language]); // Reload when language changes

  const loadStationDetails = async () => {
    try {
      setLoading(true);

      // Get station details
      const { data: stationData, error: stationError } = await supabase
        .from("stations")
        .select("*")
        .eq("id", stationId)
        .limit(1)
        .maybeSingle();

      if (stationError) throw stationError;
      if (!stationData) {
        console.error("Station not found");
        setStation(null);
        return;
      }
      setStation(stationData);

      // Get cultural information for the current language
      const { data: cultureData, error: cultureError } = await supabase
        .from("station_culture")
        .select("*")
        .eq("station_id", stationId)
        .eq("language", i18n.language)
        .limit(1)
        .maybeSingle();

      if (cultureError) throw cultureError;

      if (!cultureData && i18n.language === "ko") {
        // Fallback to English if Korean is not found
        const { data: enCulture, error: enError } = await supabase
          .from("station_culture")
          .select("*")
          .eq("station_id", stationId)
          .eq("language", "en")
          .limit(1)
          .maybeSingle();

        if (!enError && enCulture) {
          setCulture(enCulture);
        } else {
          console.error("No culture data found");
          setCulture(null);
        }
      } else {
        setCulture(cultureData);
      }
    } catch (error) {
      console.error("Error loading station details:", error);
      setStation(null);
      setCulture(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4B4B" />
      </View>
    );
  }

  if (!station || !culture) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("stationNotFound")}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stationName}>
          {i18n.language === "ko" ? station.name_ko : station.name}
        </Text>
        <Text style={styles.address}>{station.address}</Text>
      </View>

      {culture && (
        <>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="info" size={24} color="#FF4B4B" />
              <Text style={styles.sectionTitle}>{t("shortDescription")}</Text>
            </View>
            <Text style={styles.description}>{culture.short_description}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="description" size={24} color="#FF4B4B" />
              <Text style={styles.sectionTitle}>{t("fullDescription")}</Text>
            </View>
            <Text style={styles.description}>{culture.full_description}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="history" size={24} color="#FF4B4B" />
              <Text style={styles.sectionTitle}>{t("history")}</Text>
            </View>
            <Text style={styles.description}>{culture.history}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="lightbulb" size={24} color="#FF4B4B" />
              <Text style={styles.sectionTitle}>{t("culturalTips")}</Text>
            </View>
            <Text style={styles.description}>{culture.cultural_tips}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="place" size={24} color="#FF4B4B" />
              <Text style={styles.sectionTitle}>{t("recommendedSpots")}</Text>
            </View>
            <Text style={styles.description}>{culture.recommended_spots}</Text>
          </View>
        </>
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#FF4B4B",
    textAlign: "center",
  },
  header: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  stationName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
});

export default StationDetailsScreen;
