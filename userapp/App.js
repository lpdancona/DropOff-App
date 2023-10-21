//import 'core-js/full/symbol/async-iterator';
import { StatusBar } from "expo-status-bar";
import RootNavigator from "./src/navigation";
import { NavigationContainer } from "@react-navigation/native";
import { Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react-native";
import AuthContextProvider from "./src/contexts/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PushNotificationsContextProvider from "./src/contexts/PushNotificationsContext";
import { PaperProvider } from "react-native-paper";
//import registerNNPushToken from "native-notify";

// Aws Amplify config
import { Amplify } from "aws-amplify";
import awsExports from "./src/aws-exports";
Amplify.configure(awsExports);

function App() {
  //registerNNPushToken(12497, "wDb6oKTWDGkDZd1Rv468rP");

  return (
    <NavigationContainer>
      <PushNotificationsContextProvider>
        <AuthContextProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider>
              <RootNavigator />
            </PaperProvider>
          </GestureHandlerRootView>
          {/* <StatusBar style="light" /> */}
        </AuthContextProvider>
      </PushNotificationsContextProvider>
    </NavigationContainer>
  );
}

export default withAuthenticator(App);
