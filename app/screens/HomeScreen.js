import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import CustomMapView from "../components/CustomMapView";
import { useTranslation } from "react-i18next";
import locationService from "../services/locationService";
import notificationService from "../services/notificationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import supabaseService from "../services/supabaseService";
import i18n from "../i18n";
import { supabase } from "../lib/supabase";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearestStation, setNearestStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stationCulture, setStationCulture] = useState(null);
  const proximityTimer = useRef(null);
  const locationSubscription = useRef(null);

  useEffect(() => {
    setupLocationAndNotifications();
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
      if (proximityTimer.current) {
        clearTimeout(proximityTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (nearestStation) {
      loadStationCulture();
    }
  }, [nearestStation]);

  const loadStationCulture = async () => {
    try {
      const { data: culture, error } = await supabase
        .from("station_culture")
        .select("*")
        .eq("station_id", nearestStation.id)
        .eq("language", i18n.language)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error loading station culture:", error);
        setStationCulture(null);
        return;
      }

      if (!culture) {
        console.error(
          `No culture data found for station in language: ${i18n.language}`
        );
        // Fallback to English if Korean is not found
        if (i18n.language === "ko") {
          const { data: enCulture, error: enError } = await supabase
            .from("station_culture")
            .select("*")
            .eq("station_id", nearestStation.id)
            .eq("language", "en")
            .limit(1)
            .maybeSingle();

          if (!enError && enCulture) {
            setStationCulture(enCulture);
          }
        }
        return;
      }

      setStationCulture(culture);
    } catch (error) {
      console.error("Error loading station culture:", error);
      setStationCulture(null);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const findNearestStation = async (coords) => {
    try {
      const { data: stations, error } = await supabase
        .from("stations")
        .select("*");
      if (error) throw error;

      let nearest = null;
      let minDistance = Infinity;

      stations.forEach((station) => {
        const distance = calculateDistance(
          coords.latitude,
          coords.longitude,
          station.latitude,
          station.longitude
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearest = station;
        }
      });

      setNearestStation(nearest);

      // If within 500m, start timer for notification
      if (minDistance <= 500) {
        if (!proximityTimer.current) {
          proximityTimer.current = setTimeout(async () => {
            const { data: culture, error: cultureError } = await supabase
              .from("station_culture")
              .select("*")
              .eq("station_id", nearest.id)
              .limit(1)
              .maybeSingle();

            if (!cultureError && culture) {
              await notificationService.scheduleStationNotification(
                nearest,
                culture
              );
            } else {
              console.error("Error fetching culture data:", cultureError);
            }
          }, 30000); // 30 seconds
        }
      } else {
        if (proximityTimer.current) {
          clearTimeout(proximityTimer.current);
          proximityTimer.current = null;
        }
      }
    } catch (error) {
      console.error("Error finding nearest station:", error);
    }
  };

  const setupLocationAndNotifications = async () => {
    try {
      const { status: existingStatus } =
        await Location.getForegroundPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          i18n.t("locationPermission"),
          i18n.t("locationPermissionMessage"),
          [
            {
              text: i18n.t("settings"),
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
            { text: "OK" },
          ]
        );
        return;
      }

      await notificationService.setupNotifications();
      // Send welcome notification immediately
      await notificationService.scheduleWelcomeNotification();

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // 10 seconds
          distanceInterval: 100, // 100 meters
        },
        (location) => {
          setCurrentLocation(location.coords);
          findNearestStation(location.coords);
        }
      );

      setLoading(false);
    } catch (error) {
      console.error("Error setting up location tracking:", error);
      setLoading(false);
    }
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Location permission not granted");
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
      await findNearestStation(location.coords);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert(t("error"), t("locationError"), [{ text: "OK" }]);
    } finally {
      setLoading(false);
    }
  };

  const refreshLocation = async () => {
    try {
      setLoading(true);
      await getLocation();
    } catch (error) {
      console.error("Error refreshing location:", error);
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (nearestStation) {
      navigation.navigate("StationDetails", {
        stationId: nearestStation.id,
        station: nearestStation,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4B4B" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="train" size={24} color="#007AFF" />
        <Text style={styles.headerText}>{t("nearestStation")}</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshLocation}
        >
          <MaterialIcons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {currentLocation && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            {t("currentLocation")}: {"\n"}
            Lat: {currentLocation.latitude.toFixed(6)}
            {"\n"}
            Long: {currentLocation.longitude.toFixed(6)}
          </Text>
        </View>
      )}

      {nearestStation && (
        <View style={styles.stationCard}>
          <Text style={styles.stationName}>
            {i18n.language === "ko"
              ? nearestStation.name_ko
              : nearestStation.name}
          </Text>
          <Text style={styles.stationAddress}>{nearestStation.address}</Text>
          {stationCulture && (
            <Text style={styles.stationDescription}>
              {stationCulture.short_description}
            </Text>
          )}
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={handleViewDetails}
          >
            <Text style={styles.detailsButtonText}>{t("viewDetails")}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.mapContainer}>
        <CustomMapView
          currentLocation={currentLocation}
          destination={nearestStation}
        />
      </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 8,
    color: "#333",
  },
  refreshButton: {
    padding: 8,
  },
  stationCard: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stationName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  stationAddress: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  stationDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    fontStyle: "italic",
  },
  detailsButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  mapContainer: {
    height: 300,
    margin: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  locationInfo: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});

export default HomeScreen;
