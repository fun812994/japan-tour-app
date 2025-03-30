import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

// Get the environment variables
const supabaseUrl = Constants.expoConfig.extra.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig.extra.supabaseAnonKey;

// Add logging to check if environment variables are loaded
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key exists:", !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase credentials. Please check your app.config.js file."
  );
  throw new Error(
    "Missing Supabase credentials. Please check your app.config.js file."
  );
}

// Create Supabase client with error handling
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Disable session persistence for now
    },
    global: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    db: {
      schema: "public",
    },
  });

  // Test the connection with a timeout
  const testConnection = async () => {
    try {
      const { data, error } = await Promise.race([
        supabase.from("locations").select("count").limit(0),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Connection timeout")), 5000)
        ),
      ]);

      if (error) {
        console.error("Supabase connection error:", error);
      } else {
        console.log("Supabase connected successfully");
      }
    } catch (error) {
      console.error("Connection test failed:", error);
    }
  };

  testConnection();
} catch (error) {
  console.error("Error creating Supabase client:", error);
  throw error;
}

export { supabase };
export default supabase;

// Database schema documentation
/**
 * @typedef {Object} Location
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} category
 * @property {string} created_at
 * @property {string} user_id
 * @property {string} language - 'ko' or 'en'
 * @property {string} cultural_info
 * @property {string[]} images
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} preferred_language
 * @property {string} created_at
 */
