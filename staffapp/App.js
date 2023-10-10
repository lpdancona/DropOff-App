//import 'core-js/full/symbol/async-iterator';
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react-native";
import AuthContextProvider from "./src/contexts/AuthContext";
import RootNavigator from "./src/navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
//import registerNNPushToken from "native-notify";
//import { API, graphqlOperation } from "aws-amplify";

// Aws Amplify config
import { Amplify } from "aws-amplify";
import awsExports from "./src/aws-exports";
Amplify.configure(awsExports);

function App() {
  //registerNNPushToken(12494, "S8t82EPJldbDxB0gR2fOyd");

  return (
    <NavigationContainer>
      <AuthContextProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootNavigator />
        </GestureHandlerRootView>
      </AuthContextProvider>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

export default withAuthenticator(App);
