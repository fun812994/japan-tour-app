import Constants from "expo-constants";

const ENV = {
  dev: {
    SUPABASE_URL:
      process.env.SUPABASE_URL || Constants.expoConfig?.extra?.SUPABASE_URL,
    SUPABASE_ANON_KEY:
      process.env.SUPABASE_ANON_KEY ||
      Constants.expoConfig?.extra?.SUPABASE_ANON_KEY,
    GOOGLE_MAPS_API_KEY:
      process.env.GOOGLE_MAPS_API_KEY ||
      Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY,
  },
  prod: {
    SUPABASE_URL:
      process.env.SUPABASE_URL || Constants.expoConfig?.extra?.SUPABASE_URL,
    SUPABASE_ANON_KEY:
      process.env.SUPABASE_ANON_KEY ||
      Constants.expoConfig?.extra?.SUPABASE_ANON_KEY,
    GOOGLE_MAPS_API_KEY:
      process.env.GOOGLE_MAPS_API_KEY ||
      Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY,
  },
};

const getEnvVars = () => {
  // Return the environment variables
  return ENV.dev;
};

export default getEnvVars;
