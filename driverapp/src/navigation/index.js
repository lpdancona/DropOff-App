import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
//import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Foundation, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
//import { useAuthContext } from "../contexts/AuthContext";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  //const { dbUser } = useAuthContext();
  //console.log(dbUser);
  return (
    //<Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen 
        name="LoginScreen" 
        component={LoginScreen} 
        options={{ headerShown: false }} // Hide the header for the login screen if needed
      />
      <Stack.Screen 
        name='Home' 
        component={HomeScreen}
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};




export default RootNavigator;