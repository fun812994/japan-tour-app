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

export default ({ config }) => ({
  ...config,
  name: "Japan Tour App",
  slug: "japan-tour-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./app/assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./app/assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.japantourapp.app",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "We need your location to find the nearest train stations and provide cultural information.",
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "We need your location to find the nearest train stations and provide cultural information.",
      NSLocationAlwaysUsageDescription:
        "We need your location to find the nearest train stations and provide cultural information.",
      NSLocationTemporaryUsageDescriptionDictionary: {
        LocationWhenInUse:
          "We need your location to find the nearest train stations and provide cultural information.",
        LocationAlways:
          "We need your location to find the nearest train stations and provide cultural information.",
      },
      UIBackgroundModes: ["location", "remote-notification", "fetch"],
      BGTaskSchedulerPermittedIdentifiers: [
        "com.japantourapp.app.location-updates",
      ],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./app/assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.japantourapp.app",
    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION",
      "ACCESS_BACKGROUND_LOCATION",
    ],
  },
  web: {
    favicon: "./app/assets/favicon.png",
  },
  extra: {
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    googleAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    eas: {
      projectId: "5f705e0d-07a7-4ae5-b64f-334d3902bbe6",
    },
  },
  plugins: [
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow Japan Tour App to use your location to find the nearest train stations.",
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./app/assets/notification-icon.png",
        color: "#ffffff",
        sounds: ["./app/assets/notification-sound.wav"],
      },
    ],
  ],
  owner: "chanlee12",
  runtimeVersion: {
    policy: "sdkVersion",
  },
  updates: {
    url: "https://u.expo.dev/5f705e0d-07a7-4ae5-b64f-334d3902bbe6",
  },
  newArchEnabled: true,
});
