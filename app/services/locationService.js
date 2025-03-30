import * as Location from "expo-location";
import Constants from "expo-constants";

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
      const apiKey = Constants.expoConfig.extra.googleMapsApiKey;
      console.log("Google Maps API Key:", apiKey ? "Present" : "Missing");
      console.log("API Key length:", apiKey?.length);
      console.log("API Key first 10 chars:", apiKey?.substring(0, 10));
      console.log("Testing Places API access...");

      // Extract coordinates from the location object
      const { latitude, longitude } = location.coords;
      console.log("Searching for train stations near:", {
        latitude,
        longitude,
      });

      // Test Places API access first with the new endpoint format
      const testUrl = `https://places.googleapis.com/v1/places:searchNearby?key=${apiKey}`;
      console.log("Test URL:", testUrl);

      const requestBody = {
        locationRestriction: {
          circle: {
            center: {
              latitude: latitude,
              longitude: longitude,
            },
            radius: 500.0,
          },
        },
        includedTypes: ["transit_station"],
        maxResultCount: 1,
      };

      console.log("Request body:", JSON.stringify(requestBody, null, 2));

      const testResponse = await fetch(testUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.types,places.nationalPhoneNumber,places.websiteUri,places.regularOpeningHours",
        },
        body: JSON.stringify(requestBody),
      });

      const testData = await testResponse.json();
      console.log(
        "Places API test response:",
        JSON.stringify(testData, null, 2)
      );

      if (testData.error) {
        console.error("API Error Details:", testData.error);
        throw new Error(
          `Places API access denied: ${testData.error.message}. Please check your API key and enable the Places API in Google Cloud Console.`
        );
      }

      if (testData.places && testData.places.length > 0) {
        const nearestStation = testData.places[0];
        console.log("Nearest station found:", nearestStation.displayName);
        return nearestStation;
      }

      // If no results found within 500m, try a larger radius
      const largerRequestBody = {
        ...requestBody,
        locationRestriction: {
          circle: {
            center: {
              latitude: latitude,
              longitude: longitude,
            },
            radius: 1000.0,
          },
        },
      };

      console.log("Trying larger search radius...");
      const largerResponse = await fetch(testUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.types,places.nationalPhoneNumber,places.websiteUri,places.regularOpeningHours",
        },
        body: JSON.stringify(largerRequestBody),
      });

      const largerData = await largerResponse.json();
      console.log(
        "Larger radius search response:",
        JSON.stringify(largerData, null, 2)
      );

      if (largerData.places && largerData.places.length > 0) {
        const nearestStation = largerData.places[0];
        console.log(
          "Nearest station found (larger radius):",
          nearestStation.displayName
        );
        return nearestStation;
      }

      throw new Error("No train stations found nearby");
    } catch (error) {
      console.error("Error finding train station:", error);
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
