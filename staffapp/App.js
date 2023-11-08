//import 'core-js/full/symbol/async-iterator';
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Button, LogBox } from "react-native";
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
import BackgroundTasksProvider from "./src/contexts/BackgroundTaskContext";

// Aws Amplify config
import { Amplify } from "aws-amplify";
import awsExports from "./src/aws-exports";
Amplify.configure(awsExports);

function SignOutButton() {
  const { signOut } = useAuthenticator();
  return <Button title="Sign Out" onPress={signOut} />;
}

LogBox.ignoreLogs(["NSLocation*UsageDescription"]);

function App() {
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
