import { ExpoConfig, ConfigContext } from "expo/config";
import dotenv from "dotenv";

dotenv.config();

// Log environment variables for debugging
console.log("Environment variables loaded:");
console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "Present" : "Missing");
console.log(
  "SUPABASE_ANON_KEY:",
  process.env.SUPABASE_ANON_KEY ? "Present" : "Missing"
);
console.log(
  "DEEPSEEK_API_KEY:",
  process.env.DEEPSEEK_API_KEY ? "Present" : "Missing"
);
console.log(
  "GOOGLE_MAPS_API_KEY:",
  process.env.GOOGLE_MAPS_API_KEY ? "Present" : "Missing"
);
console.log(
  "GOOGLE_MAPS_API_KEY length:",
  process.env.GOOGLE_MAPS_API_KEY?.length
);

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Japan Tour App",
  slug: "japan-tour-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.yourcompany.japantourapp",
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.japantourapp",
    permissions: ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    deepseekApiKey: process.env.DEEPSEEK_API_KEY,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
  plugins: [
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow $(PRODUCT_NAME) to use your location.",
      },
    ],
  ],
});
