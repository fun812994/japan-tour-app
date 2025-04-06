import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const supabaseService = {
  // Location operations
  async createLocation(location) {
    const { data, error } = await supabase
      .from("locations")
      .insert([location])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getLocations() {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getLocationsByLanguage(language) {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("language", language)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getLocationsByCategory(category) {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateLocation(id, updates) {
    const { data, error } = await supabase
      .from("locations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteLocation(id) {
    const { error } = await supabase.from("locations").delete().eq("id", id);

    if (error) throw error;
  },

  // User operations
  async createUser(user) {
    const { data, error } = await supabase
      .from("users")
      .insert([user])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUser(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Storage operations for images
  async uploadImage(file, path) {
    const { data, error } = await supabase.storage
      .from("location-images")
      .upload(path, file);

    if (error) throw error;
    return data;
  },

  async getImageUrl(path) {
    const { data } = supabase.storage
      .from("location-images")
      .getPublicUrl(path);

    return data.publicUrl;
  },

  async getStationCulture(stationId, language = "en") {
    try {
      const { data, error } = await supabase
        .from("station_culture")
        .select("*")
        .eq("station_id", stationId)
        .eq("language", language)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching station culture:", error);
      throw error;
    }
  },

  async getStationById(stationId) {
    try {
      const { data, error } = await supabase
        .from("stations")
        .select("*")
        .eq("id", stationId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching station:", error);
      throw error;
    }
  },

  async getStationByGooglePlacesId(googlePlacesId) {
    try {
      const { data, error } = await supabase
        .from("stations")
        .select("*")
        .eq("google_places_id", googlePlacesId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching station:", error);
      throw error;
    }
  },

  async getAllStations() {
    try {
      const { data, error } = await supabase.from("stations").select("*");

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching all stations:", error);
      throw error;
    }
  },
};

export default supabaseService;
