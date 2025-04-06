import Constants from "expo-constants";

// Get the environment variables directly from app.json's extra field
const SUPABASE_URL = "https://pazseexefvhvcxpdgrbb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhenNlZXhlZnZodmN4cGRncmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2OTE0ODIsImV4cCI6MjA1ODI2NzQ4Mn0.Mvr1MHvivpXlO20jXd7p7mWmKI0Ntx4YWrkFhXk7FIw";
const GOOGLE_MAPS_API_KEY = "AIzaSyA_MpOYIaF0ckMtSefysDyKf4uZ5B5mSBM";

const ENV = {
  dev: {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    GOOGLE_MAPS_API_KEY,
  },
  prod: {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    GOOGLE_MAPS_API_KEY,
  },
};

const getEnvVars = () => {
  // Return the environment variables directly
  return ENV.dev;
};

export default getEnvVars;
