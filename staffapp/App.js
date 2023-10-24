//import 'core-js/full/symbol/async-iterator';
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
  Authenticator,
  useAuthenticator,
  withAuthenticator,
} from "@aws-amplify/ui-react-native";
import AuthContextProvider from "./src/contexts/AuthContext";
import RouteContextProvider from "./src/contexts/RouteContext";
import RootNavigator from "./src/navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PushNotificationsContextProvider from "./src/contexts/PushNotificationsContext";
//import * as TaskManager from "expo-task-manager";
//import registerNNPushToken from "native-notify";
//import { API, graphqlOperation } from "aws-amplify";

// Aws Amplify config
import { Amplify } from "aws-amplify";
import awsExports from "./src/aws-exports";
Amplify.configure(awsExports);

function SignOutButton() {
  const { signOut } = useAuthenticator();
  return <Button title="Sign Out" onPress={signOut} />;
} //registerNNPushToken(12494, "S8t82EPJldbDxB0gR2fOyd");

// const LOCATION_TASK_NAME = "background-location-task";

// TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
//   if (error) {
//     // Handle errors
//     return;
//   }
//   if (data) {
//     const { locations } = data;
//     // Handle the background location updates
//   }
// });

function App() {
  return (
    <NavigationContainer>
      <PushNotificationsContextProvider>
        <AuthContextProvider>
          <RouteContextProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <RootNavigator />
            </GestureHandlerRootView>
          </RouteContextProvider>
        </AuthContextProvider>
      </PushNotificationsContextProvider>
      {/* <StatusBar style="light" /> */}
    </NavigationContainer>
  );
}

export default withAuthenticator(App);
