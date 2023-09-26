import 'core-js/full/symbol/async-iterator';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation';
import { NavigationContainer } from '@react-navigation/native'
import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import AuthContextProvider from './src/contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
//import HomeScreen from "./src/screens/HomeScreen";
import registerNNPushToken from 'native-notify';

// Aws Amplify config 
import { Amplify } from 'aws-amplify';
import awsExports from './src/aws-exports';
Amplify.configure(awsExports);


function App() {
  registerNNPushToken(12497, 'wDb6oKTWDGkDZd1Rv468rP');
  return (
    <NavigationContainer>
      <AuthContextProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootNavigator />
        </GestureHandlerRootView>
        <StatusBar style="light"/>
      </AuthContextProvider>
    </NavigationContainer>
  );
};

export default withAuthenticator(App);

