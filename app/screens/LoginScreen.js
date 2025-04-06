import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

const LanguageSelection = ({ onLanguageSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeTitle}>Welcome • 환영합니다</Text>
      <Text style={styles.welcomeSubtitle}>Please select your language</Text>
      <Text style={styles.welcomeSubtitle}>언어를 선택해주세요</Text>

      <View style={styles.languageButtons}>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => onLanguageSelect("en")}
        >
          <MaterialIcons name="language" size={30} color="#007AFF" />
          <Text style={styles.languageButtonText}>English</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => onLanguageSelect("ko")}
        >
          <MaterialIcons name="language" size={30} color="#007AFF" />
          <Text style={styles.languageButtonText}>한국어</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const LoginForm = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      setLoading(true);
      if (email && password) {
        await AsyncStorage.setItem("userToken", "test-token");
        navigation.replace("Main");
      } else {
        Alert.alert(t("error"), t("pleaseEnterCredentials"));
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      Alert.alert(t("error"), t("signInError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("welcome")}</Text>
        <Text style={styles.subtitle}>{t("welcomeSubtitle")}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name="email"
            size={24}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={t("email")}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons
            name="lock"
            size={24}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={t("password")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? t("signingIn") : t("signIn")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const LoginScreen = () => {
  const { i18n } = useTranslation();
  const [languageSelected, setLanguageSelected] = useState(false);

  const handleLanguageSelect = async (language) => {
    await AsyncStorage.setItem("user-language", language);
    i18n.changeLanguage(language);
    setLanguageSelected(true);
  };

  return languageSelected ? (
    <LoginForm />
  ) : (
    <LanguageSelection onLanguageSelect={handleLanguageSelect} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  languageButtons: {
    marginTop: 40,
    width: "100%",
    maxWidth: 300,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageButtonText: {
    fontSize: 18,
    color: "#333",
    marginLeft: 15,
    fontWeight: "500",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
