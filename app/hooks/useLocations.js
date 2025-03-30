import { useState, useEffect } from "react";
import { supabaseService } from "../services/supabaseService";

const useLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getLocations();
      setLocations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationsByLanguage = async (language) => {
    try {
      setLoading(true);
      const data = await supabaseService.getLocationsByLanguage(language);
      setLocations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationsByCategory = async (category) => {
    try {
      setLoading(true);
      const data = await supabaseService.getLocationsByCategory(category);
      setLocations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addLocation = async (location) => {
    try {
      setLoading(true);
      const newLocation = await supabaseService.createLocation(location);
      setLocations((prev) => [newLocation, ...prev]);
      return newLocation;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async (id, updates) => {
    try {
      setLoading(true);
      const updatedLocation = await supabaseService.updateLocation(id, updates);
      setLocations((prev) =>
        prev.map((loc) => (loc.id === id ? updatedLocation : loc))
      );
      return updatedLocation;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLocation = async (id) => {
    try {
      setLoading(true);
      await supabaseService.deleteLocation(id);
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return {
    locations,
    loading,
    error,
    fetchLocations,
    fetchLocationsByLanguage,
    fetchLocationsByCategory,
    addLocation,
    updateLocation,
    deleteLocation,
  };
};

export { useLocations };
export default useLocations;
