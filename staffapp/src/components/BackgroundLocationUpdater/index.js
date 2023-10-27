// BackgroundLocationUpdater.js
import React, { useEffect } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { updateLocation } from "../LocationUtils";

const LOCATION_TASK_NAME = "background-location-task";

const BackgroundLocationUpdater = ({ currentRouteData, busLocation }) => {
  useEffect(() => {
    console.log("busLocation", busLocation);
    const requestLocationPermissions = async () => {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus === "granted") {
        const { status: backgroundStatus } =
          await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus === "granted") {
          TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
            if (error) {
              console.error("Location task error:", error.message);
              return;
            }

            if (data) {
              const { locations } = data;
              const newLocation = locations[0].coords;
              if (currentRouteData && newLocation) {
                updateLocation(
                  currentRouteData.id,
                  newLocation.latitude,
                  newLocation.longitude
                );
              }
            }
          });

          TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME).then(
            (registered) => {
              if (!registered) {
                Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                  accuracy: Location.Accuracy.Balanced,
                  distanceInterval: 5,
                });
              }
            }
          );
        }
      }
    };

    requestLocationPermissions();
  }, [currentRouteData]);

  return null; // This component doesn't render anything
};

export default BackgroundLocationUpdater;
