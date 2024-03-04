import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
//import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import DropOffRouteScreen from "../screens/DropOffRouteScreen";
import ProfileScreen from "../screens/ProfileScreen";
import WaitingScreen from "../screens/WaitingScreen";
import ChatScreen from "../screens/ChatScreen";
import ChatUserScreen from "../screens/ChatUserScreen";
import PickScreen from "../screens/PickScreen";
import GalleryScreen from "../screens/GalleryScreen";
//import SideDrawer from "../screens/SideDrawer/SideDrawer";
import { useAuthContext } from "../contexts/AuthContext";
import { Auth } from "aws-amplify";
import {
  SimpleLineIcons,
  FontAwesome5,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

// import { useRouteContext } from "../contexts/RouteContext";
// import { usePushNotificationsContext } from "../contexts/PushNotificationsContext";

const RootNavigator = () => {
  const { dbUser, loading } = useAuthContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const StackNav = () => {
    const Stack = createNativeStackNavigator();
    const navigation = useNavigation();

    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {dbUser ? (
          // isRouteInProgress && !permissionMessage ? (
          // <Stack.Screen name="Chat" component={ChatScreen} />
          // <Stack.Screen name="Route" component={RouteScreen} />
          // ) : (
          <Stack.Screen name="HomeStack" component={HomeScreen} />
        ) : (
          // )
          <Stack.Screen name="ParentLogin" component={ProfileScreen} />
        )}
        <Stack.Screen name="ChatUser" component={ChatUserScreen} />
      </Stack.Navigator>
    );
  };

  const DrawerNav = () => {
    const Drawer = createDrawerNavigator();
    return (
      <Drawer.Navigator
        screenOptions={{
          // headerShown: false,
          drawerStyle: {
            backgroundColor: "#fff",
            width: 190,
          },
          headerStyle: {
            backgroundColor: "#FF7276",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          drawerActiveTintColor: "blue",
          drawerLabelStyle: {
            color: "#111",
          },
        }}
      >
        <Drawer.Screen
          name="Home"
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: () => (
              <SimpleLineIcons name="home" size={20} color="#808080" />
            ),
          }}
          component={StackNav}
        />
        <Drawer.Screen
          name="Chat"
          options={{
            drawerLabel: "Chat",
            title: "Chat",
            drawerIcon: () => (
              <SimpleLineIcons name="people" size={20} color="#808080" />
            ),
          }}
          component={ChatScreen}
        />
        <Drawer.Screen
          name="DropOffRoute"
          options={{
            drawerLabel: "DropOffRoute",
            title: "Drop Off",
            drawerIcon: () => (
              <FontAwesome5 name="bus" size={20} color="#808080" />
            ),
          }}
          component={DropOffRouteScreen}
        />
        <Drawer.Screen
          name="Pick"
          options={{
            drawerLabel: "Pick",
            title: "Kid Info",
            drawerIcon: () => (
              <AntDesign name="profile" size={20} color="#808080" />
            ),
          }}
          component={PickScreen}
        />
        <Drawer.Screen
          name="Gallery"
          options={{
            drawerLabel: "Gallery",
            title: "Kid Gallery",
            drawerIcon: () => (
              <MaterialCommunityIcons
                name="view-gallery"
                size={20}
                color="#808080"
              />
            ),
          }}
          component={GalleryScreen}
        />
      </Drawer.Navigator>
    );
  };

  // const { isRouteInProgress } = useRouteContext();
  // const { permissionMessage } = usePushNotificationsContext();

  if (loading) {
    return <ActivityIndicator size="large" color="gray" />;
  }

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = async () => {
    try {
      // Sign out the user using Amplify Auth
      await Auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setConfirmationModalVisible(false);
    }
  };

  return <DrawerNav />;
};

export default RootNavigator;

// <View style={{ flex: 1 }}>
//   <SideDrawer
//     isVisible={isDrawerOpen}
//     onClose={toggleDrawer}
//     onLogout={handleLogout}
//   />
//   <Stack.Navigator screenOptions={{ headerShown: false }}>
//     {dbUser ? (
//       // isRouteInProgress && !permissionMessage ? (
//       // <Stack.Screen name="Chat" component={ChatScreen} />
//       // <Stack.Screen name="Route" component={RouteScreen} />
//       // ) : (
//       <Stack.Screen name="Home" component={HomeScreen} />
//     ) : (
//       // )
//       <Stack.Screen name="ParentLogin" component={ProfileScreen} />
//     )}
//     <Stack.Screen name="Chat" component={ChatScreen} />
//     <Stack.Screen name="ChatUser" component={ChatUserScreen} />
//     <Stack.Screen name="Wait" component={WaitingScreen} />
//     <Stack.Screen name="Pick" component={PickScreen} />
//     <Stack.Screen name="Gallery" component={GalleryScreen} />
//     <Stack.Screen name="DropOffRoute" component={DropOffRouteScreen} />
//   </Stack.Navigator>
// </View>
