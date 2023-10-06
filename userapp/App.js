//import 'core-js/full/symbol/async-iterator';
import { StatusBar } from "expo-status-bar";
import RootNavigator from "./src/navigation";
import { NavigationContainer } from "@react-navigation/native";
import { Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react-native";
import AuthContextProvider from "./src/contexts/AuthContext";
//import UserContextProvider from "./src/contexts/UserContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
//import HomeScreen from "./src/screens/HomeScreen";
import registerNNPushToken from "native-notify";
import { PaperProvider } from "react-native-paper";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

// Aws Amplify config
import { Amplify } from "aws-amplify";
import awsExports from "./src/aws-exports";
Amplify.configure(awsExports);

function App() {
  const [hasSignedOut, setHasSignedOut] = useState(false);
  useEffect(() => {
    const signOutOnStart = async () => {
      try {
        // Check if the user has already been signed out
        const hasSignedOutFlag = await SecureStore.getItemAsync("hasSignedOut");
        if (!hasSignedOutFlag) {
          await Auth.signOut();
          // Set the flag to indicate that the user has been signed out
          await SecureStore.setItemAsync("hasSignedOut", "true");
          setHasSignedOut(true);
        }
      } catch (error) {
        console.error("Sign out error:", error);
      }
    };

    signOutOnStart();
  }, []);

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        // User is authenticated, navigate to the main app screen
        // You can use navigation to the appropriate screen here
        console.log("User is already authenticated:", user);
      } catch (error) {
        // No user is authenticated, show authentication screens
        console.log("No user is authenticated:", error);
      }
    };

    checkCurrentUser();
  }, []);

  registerNNPushToken(12497, "wDb6oKTWDGkDZd1Rv468rP");
  return (
    <NavigationContainer>
      <AuthContextProvider>
        {/* <UserContextProvider> */}
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider>
            <RootNavigator />
          </PaperProvider>
        </GestureHandlerRootView>
        {/* </UserContextProvider> */}
        <StatusBar style="light" />
      </AuthContextProvider>
    </NavigationContainer>
  );
}

export default withAuthenticator(App);
