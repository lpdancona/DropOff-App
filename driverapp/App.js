import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation';
import { NavigationContainer } from '@react-navigation/native'
//import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
//import AuthContextProvider from './src/contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from "./src/screens/HomeScreen";
import registerNNPushToken from 'native-notify';


function App() {
  registerNNPushToken(12494, 'S8t82EPJldbDxB0gR2fOyd');
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootNavigator />
      </GestureHandlerRootView>
      <StatusBar style="light"/>
    </NavigationContainer>
  );
};

export default App;

