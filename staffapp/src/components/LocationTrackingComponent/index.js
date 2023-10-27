import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useBackgroundTaskContext } from "../../contexts/BackgroundTaskContext";
import { useRouteContext } from "../../contexts/RouteContext";
import { View, Text, ActivityIndicator } from "react-native";
import { updateLocation } from "../../components/LocationUtils";

const LocationTrackingComponent = () => {
  const { registerBackgroundFetchAsync } = useBackgroundTaskContext();
  const { currentRouteData } = useRouteContext();
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    const startForegroundLocationTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      const foregroundLocationOptions = {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 5,
      };

      Location.watchPositionAsync(
        foregroundLocationOptions,
        (updatedLocation) => {
          // Handle foreground location updates
          const { latitude, longitude } = updatedLocation.coords;
          console.log("Foreground Location Update:", latitude, longitude);
          setIsTracking(true); // Location tracking is active
          updatedLocation();
        }
      );
    };

    startForegroundLocationTracking();
    registerBackgroundFetchAsync();
  }, [registerBackgroundFetchAsync]);

  return (
    <View>
      {isTracking ? (
        <Text>Location tracking is active</Text>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};

export default LocationTrackingComponent;
