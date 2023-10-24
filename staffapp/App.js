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
import RootNavigator from "./src/navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PushNotificationsContextProvider from "./src/contexts/PushNotificationsContext";
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

function App() {
  return (
    <NavigationContainer>
      <PushNotificationsContextProvider>
        <AuthContextProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootNavigator />
          </GestureHandlerRootView>
        </AuthContextProvider>
      </PushNotificationsContextProvider>
      {/* <StatusBar style="light" /> */}
    </NavigationContainer>
  );
}

export default withAuthenticator(App);
