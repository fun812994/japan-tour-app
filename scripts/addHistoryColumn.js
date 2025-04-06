const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function addHistoryColumn() {
  try {
    // Add history column to station_culture table
    const { error } = await supabase.rpc("add_history_column");

    if (error) throw error;
    console.log("Successfully added history column to station_culture table");
  } catch (error) {
    console.error("Error adding history column:", error);
  }
}

addHistoryColumn();
