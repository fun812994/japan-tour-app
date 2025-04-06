import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { MaterialIcons } from "@expo/vector-icons";

const LanguageSelectScreen = ({ navigation }) => {
  const { i18n } = useTranslation();

  const handleLanguageSelect = async (language) => {
    try {
      await AsyncStorage.setItem("language", language);
      await i18n.changeLanguage(language);
      navigation.replace("MainHome");
    } catch (error) {
      console.error("Error setting language:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="explore" size={100} color="#FF4B4B" />
        </View>

        <Text style={styles.title}>Welcome to Japan Tour Guide</Text>
        <Text style={styles.subtitle}>Please select your language</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => handleLanguageSelect("ko")}
          >
            <MaterialIcons name="language" size={24} color="#FFF" />
            <Text style={styles.buttonText}>한국어</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => handleLanguageSelect("en")}
          >
            <MaterialIcons name="language" size={24} color="#FFF" />
            <Text style={styles.buttonText}>English</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    marginBottom: 40,
    padding: 20,
    borderRadius: 75,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    gap: 20,
  },
  languageButton: {
    backgroundColor: "#FF4B4B",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LanguageSelectScreen;
