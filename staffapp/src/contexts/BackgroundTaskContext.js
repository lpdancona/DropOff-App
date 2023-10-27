// BackgroundTasksContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import * as BackgroundFetch from "expo-background-fetch";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useRouteContext } from "./RouteContext";
import { updateLocation } from "../../src/components/LocationUtils";

const BACKGROUND_FETCH_TASK = "background-location-task"; // Use the same task name
//const { routesData, currentRouteData } = useRouteContext();

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const location = await Location.getCurrentPositionAsync({});
    console.log("Location fetched in the background:", location);
    updateLocation(
      "43c0a7f5-3990-4ca9-985b-b873f0bffc22",
      location.coords.latitude,
      location.coords.longitude
    );
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Location fetch error:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});
const BackgroundTasksContext = createContext({});

export const BackgroundTasksProvider = ({ children }) => {
  useEffect(() => {
    registerBackgroundFetchAsync();
  }, []);

  const registerBackgroundFetchAsync = async () => {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 1 * 60, // 15 seconds
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("Background fetch task registered.");
    } catch (error) {
      console.error("Background fetch task registration error:", error);
    }
  };

  return (
    <BackgroundTasksContext.Provider value={{ registerBackgroundFetchAsync }}>
      {children}
    </BackgroundTasksContext.Provider>
  );
};

export default BackgroundTasksProvider;

export const useBackgroundTasksContext = () =>
  useContext(BackgroundTasksContext);
