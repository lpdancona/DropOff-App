import "dotenv/config";

export default {
  name: "DropoffStaff",
  slug: "drop-off-gb",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#0a43fc",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    infoPlist: {
      UIBackgroundModes: ["location", "fetch"],
      GMSApiKey: process.env.GOOGLE_MAPS_APIKEY,
    },
    supportsTablet: true,
    bundleIdentifier: "com.geodarth.dropoffgb",
    buildNumber: "2",
  },
  android: {
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_APIKEY,
      },
    },
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "ACCESS_BACKGROUND_LOCATION",
    ],
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.geodarth.dropoffgb",
    googleServicesFile: "./google-services.json",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    eas: {
      projectId: "86aaefd7-300b-4ba0-9f96-ede028a516c4",
    },
  },
  owner: "geodarth",
  runtimeVersion: {
    policy: "appVersion",
  },
  updates: {
    url: "https://u.expo.dev/86aaefd7-300b-4ba0-9f96-ede028a516c4",
  },
};
