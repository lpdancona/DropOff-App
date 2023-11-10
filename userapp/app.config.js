import "dotenv/config";

export default {
  name: "GB DropOff",
  slug: "DropoffUser",
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
      GMSApiKey: process.env.GOOGLE_MAPS_APIKEY,
    },
    supportsTablet: true,
    bundleIdentifier: "com.geodarth.DropoffUser",
    buildNumber: "4",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.geodarth.DropoffUser",
    versionCode: 1,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    eas: {
      projectId: "7c8a0c2e-12a3-4b4c-b54b-6db24b05ed92",
    },
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  updates: {
    url: "https://u.expo.dev/7c8a0c2e-12a3-4b4c-b54b-6db24b05ed92",
  },
};
