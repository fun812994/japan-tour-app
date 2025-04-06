import * as Location from "expo-location";
import Constants from "expo-constants";
import { GOOGLE_MAPS_API_KEY } from "@env";

const locationService = {
  async getCurrentLocation() {
    try {
      console.log("Requesting location permissions...");
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Location permission not granted");
      }

      console.log("Getting current position...");
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      console.log("Current location:", location);
      return location;
    } catch (error) {
      console.error("Error getting location:", error);
      throw error;
    }
  },

  async findNearestTrainStation(location) {
    try {
      console.log(
        "Test URL:",
        `https://places.googleapis.com/v1/places:searchNearby?key=${GOOGLE_MAPS_API_KEY}`
      );
      const requestBody = {
        locationRestriction: {
          circle: {
            center: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            radius: 500,
          },
        },
        includedTypes: ["transit_station"],
        maxResultCount: 1,
      };

      console.log("Request body:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(
        `https://places.googleapis.com/v1/places:searchNearby?key=${GOOGLE_MAPS_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask":
              "places.id,places.displayName,places.formattedAddress,places.location,places.types",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      console.log("Places API test response:", data);
      return data;
    } catch (error) {
      console.error("Error finding nearest train station:", error);
      throw error;
    }
  },

  async getStationInfo(stationId) {
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${stationId}?key=${GOOGLE_MAPS_API_KEY}`,
        {
          headers: {
            "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask": "*",
          },
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error getting station info:", error);
      throw error;
    }
  },

  async getStationDetails(station) {
    return {
      name: station.displayName.text,
      category: "train_station",
      description: `Train station located at ${station.formattedAddress}`,
      latitude: station.location.latitude,
      longitude: station.location.longitude,
      culturalInfo: {
        openingHours: station.regularOpeningHours,
        rating: station.rating,
        phoneNumber: station.nationalPhoneNumber,
        website: station.websiteUri,
      },
    };
  },
};

export { locationService };
export default locationService;
