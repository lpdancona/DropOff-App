//import 'core-js/full/symbol/async-iterator';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as TaskManager from "expo-task-manager";
import React, { useEffect } from "react";
import { LogBox, AppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { withAuthenticator } from "@aws-amplify/ui-react-native";
import AuthContextProvider from "./src/contexts/AuthContext";
import RouteContextProvider from "./src/contexts/RouteContext";
import RootNavigator from "./src/navigation";
import PushNotificationsContextProvider from "./src/contexts/PushNotificationsContext";
import BackgroundTasksProvider from "./src/contexts/BackgroundTaskContext";

// Aws Amplify config
import { Amplify } from "aws-amplify";
import awsExports from "./src/aws-exports";
Amplify.configure(awsExports);

// function SignOutButton() {
//   const { signOut } = useAuthenticator();
//   return <Button title="Sign Out" onPress={signOut} />;
// }

LogBox.ignoreLogs(["NSLocation*UsageDescription"]);

function App() {
  // useEffect(() => {
  //   const handleAppStateChange = (nextAppState) => {
  //     if (nextAppState === "background") {
  //       console.log("App is in the background. Perform cleanup.");
  //       console.log("STOPPING ALL REGISTERED TASKS");
  //       TaskManager.unregisterAllTasksAsync();
  //     }
  //   };

  //   AppState.addEventListener("change", handleAppStateChange);

  //   return () => {
  //     AppState.removeEventListener("change", handleAppStateChange);
  //     console.log("Component will unmount");
  //   };
  // }, []);

  useEffect(() => {
    return () => {
      TaskManager.unregisterAllTasksAsync();
    };
  }, []);

  return (
    <NavigationContainer>
      <PushNotificationsContextProvider>
        <AuthContextProvider>
          <RouteContextProvider>
            <BackgroundTasksProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <RootNavigator />
              </GestureHandlerRootView>
            </BackgroundTasksProvider>
          </RouteContextProvider>
        </AuthContextProvider>
      </PushNotificationsContextProvider>
      {/* <StatusBar style="light" /> */}
    </NavigationContainer>
  );
}

export default withAuthenticator(App);
