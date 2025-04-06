import { supabase } from "./supabase";

const stationService = {
  async getStationInfo(stationId) {
    try {
      const { data, error } = await supabase
        .from("stations")
        .select("*")
        .eq("id", stationId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching station info:", error);
      return null;
    }
  },

  async getNearbyStations(latitude, longitude, radius = 500) {
    try {
      const { data, error } = await supabase
        .from("stations")
        .select("*")
        .lt("distance", radius)
        .order("distance", { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching nearby stations:", error);
      return [];
    }
  },

  async getStationCulture(stationId, language = "en") {
    try {
      const { data, error } = await supabase
        .from("station_culture")
        .select("short_description, full_description, history")
        .eq("station_id", stationId)
        .eq("language", language)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching station culture:", error);
      return null;
    }
  },
};

export default stationService;
