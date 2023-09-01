import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation';
import { NavigationContainer } from '@react-navigation/native'
//import { withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
//import AuthContextProvider from './src/contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from "./src/screens/HomeScreen";


function App() {
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <HomeScreen />
        {/* <RootNavigator /> */}
      </GestureHandlerRootView>
      
      <StatusBar style="light"/>
    </NavigationContainer>
  );
};

export default App;

