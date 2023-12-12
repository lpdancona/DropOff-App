//import 'core-js/full/symbol/async-iterator';
import { StatusBar } from "expo-status-bar";
import RootNavigator from "./src/navigation";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Auth } from "aws-amplify";
import {
  withAuthenticator,
  Authenticator,
  useTheme,
  ThemeProvider,
} from "@aws-amplify/ui-react-native";
import AuthContextProvider from "./src/contexts/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PushNotificationsContextProvider from "./src/contexts/PushNotificationsContext";
import { PaperProvider } from "react-native-paper";
import CustomHeader from "./src/layout/CustomHeader";
import CustomFooter from "./src/layout/CustomFooter";
import getTheme from "./src/layout/CustomTheme";

// Aws Amplify config
import { Amplify } from "aws-amplify";
import awsExports from "./src/aws-exports";
Amplify.configure(awsExports);
const Stack = createStackNavigator();

function App() {
  const {
    tokens: { colors },
  } = useTheme();
  const myTheme = getTheme();
  return (
    <ThemeProvider theme={myTheme}>
      <Authenticator.Provider>
        <Authenticator
          Header={CustomHeader}
          Footer={CustomFooter}
          //Container={(props) => <Authenticator.Container {...props} />}
        >
          <NavigationContainer>
            <PushNotificationsContextProvider>
              <AuthContextProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <PaperProvider>
                    <RootNavigator />
                  </PaperProvider>
                </GestureHandlerRootView>
                <StatusBar style="light" />
              </AuthContextProvider>
            </PushNotificationsContextProvider>
          </NavigationContainer>
        </Authenticator>
      </Authenticator.Provider>
    </ThemeProvider>
  );
}

export default App;
