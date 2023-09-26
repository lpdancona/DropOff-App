import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from '../screens/HomeScreen';
import ParentProfileScreen from "../screens/ParentProfileScreen";
import LoginScreen from '../screens/LoginScreen';
//import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { DataStore } from 'aws-amplify';
import { Kid } from '../models';
import { Foundation, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useAuthContext } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { dbUser, userEmail } = useAuthContext();
  const [isParent,setIsParent] = useState(false)
  
  useEffect(() => {
    const fetchData = async () => {
      if (userEmail) {
        //console.log(userEmail.toString())
        const queryResult = await DataStore.query(Kid, (s) =>
          s.or(s => [
            s.parent1Email.eq(userEmail),
            s.parent2Email.eq(userEmail)
          ])
        );
        
        // Assuming queryResult is an array, you can check if it contains any items
        if (queryResult.length > 0) {
          setIsParent(true);
        }
        
        // You can also log the queryResult if needed
        //console.log(queryResult);
      }
    };

    fetchData();
  }, [userEmail]);

  // The value of isParent will be logged when it changes
  //console.log(isParent);

  return (
    //</Stack.Navigator><Stack.Navigator initialRouteName="LoginScreen">
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {dbUser ? (
        <Stack.Screen 
          name='Home' 
          component={HomeScreen}
          //options={{ headerShown: false }} 
        />
      ) : isParent ? (
          <Stack.Screen 
            name="ParentLogin" 
            component={ParentProfileScreen} 
            //options={{ headerShown: false }} // Hide the header for the login screen if needed
          />

        ) : (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            //options={{ headerShown: false }} // Hide the header for the login screen if needed
          />
      )}
    </Stack.Navigator>
  );
};




export default RootNavigator;