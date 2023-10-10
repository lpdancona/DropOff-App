import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LoginScreen from "../screens/LoginScreen";
//import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
// import { DataStore } from 'aws-amplify';
// import { Kid } from '../models';
//import { Foundation, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useAuthContext } from "../contexts/AuthContext";
//import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { dbUser, loading } = useAuthContext();
  //console.log(dbUser);

  if (loading) {
    return <ActivityIndicator size="large" color="gray" />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {dbUser ? (
        <Stack.Screen name="Home" component={HomeScreen} />
      ) : (
        <Stack.Screen name="ParentLogin" component={ProfileScreen} />
      )}

      {/* <Stack.Screen 
        name='Login' 
        component={LoginScreen}
      /> */}
    </Stack.Navigator>
  );
};

export default RootNavigator;
