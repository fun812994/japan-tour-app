import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { MaterialIcons } from "@expo/vector-icons";

const StationDetails = ({ station, culture, onClose }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  if (!station || !culture) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stationName}>
          {currentLanguage === "ko" ? station.name_ko : station.name}
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Short Description */}
        <Text style={styles.shortDescription}>{culture.short_description}</Text>

        {/* Lines Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Available Lines")}</Text>
          {station.lines.map((line, index) => (
            <Text key={index} style={styles.lineText}>
              • {line}
            </Text>
          ))}
        </View>

        {/* Cultural Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Cultural Tips")}</Text>
          <Text style={styles.text}>{culture.cultural_tips}</Text>
        </View>

        {/* History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("History")}</Text>
          <Text style={styles.text}>{culture.history}</Text>
        </View>

        {/* Recommended Spots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Recommended Spots")}</Text>
          {culture.recommended_spots.map((spot, index) => (
            <Text key={index} style={styles.spotText}>
              • {spot}
            </Text>
          ))}
        </View>

        {/* Full Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("About the Area")}</Text>
          <Text style={styles.text}>{culture.full_description}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "70%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  stationName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  shortDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  lineText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 5,
  },
  spotText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 5,
  },
});

export default StationDetails;
