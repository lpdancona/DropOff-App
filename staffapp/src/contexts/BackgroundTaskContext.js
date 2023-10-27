// BackgroundTasksContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import * as BackgroundFetch from "expo-background-fetch";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useRouteContext } from "./RouteContext";
import { updateLocation } from "../../src/components/LocationUtils";

const BACKGROUND_FETCH_TASK = "background-location-task"; // Use the same task name

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async (currentRouteData) => {
  try {
    const location = await Location.getCurrentPositionAsync({});
    console.log("Location fetched in the background:", location);
    //console.log(currentRouteData);
    // updateLocation(
    //   RouteContextProvider.useRouteContext.currentRouteData,
    //   location.coords.latitude,
    //   location.coords.longitude
    // );
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Location fetch error:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const BackgroundTaskContext = createContext({});

export const BackgroundTaskProvider = ({ children }) => {
  //const { currentRouteData } = useRouteContext();

  // useEffect(() => {
  //   registerBackgroundFetchAsync();
  // }, []);

  const registerBackgroundFetchAsync = async () => {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 15 * 1, // 15 seconds
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("Background fetch task registered.");
    } catch (error) {
      console.error("Background fetch task registration error:", error);
    }
  };

  return (
    <BackgroundTaskContext.Provider value={{ registerBackgroundFetchAsync }}>
      {children}
    </BackgroundTaskContext.Provider>
  );
};

export default BackgroundTaskProvider;

export const useBackgroundTaskContext = () => useContext(BackgroundTaskContext);
