import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import WaitingScreen from "../screens/WaitingScreen";
import ChatScreen from "../screens/ChatScreen";
import ChatUserScreen from "../screens/ChatUserScreen";
import PickScreen from "../screens/PickScreen/PickScreen";
import LoadingScreen from "../screens/LoadingScreen/LoadingScreen";
import Gallery from "../screens/Gallery/Gallery";
import { useAuthContext } from "../contexts/AuthContext";
import { useRouteContext } from "../contexts/RouteContext";
import { usePushNotificationsContext } from "../contexts/PushNotificationsContext";
const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { dbUser, loading } = useAuthContext();
  const { isRouteInProgress } = useRouteContext();
  const { permissionMessage } = usePushNotificationsContext();

  if (loading) {
    return <ActivityIndicator size="large" color="gray" />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {dbUser ? (
        isRouteInProgress && !permissionMessage ? (
          // <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Wait" component={WaitingScreen} />
        )
      ) : (
        <Stack.Screen name="ParentLogin" component={ProfileScreen} />
      )}
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="ChatUser" component={ChatUserScreen} />

      <Stack.Screen name="Pick" component={PickScreen} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Gallery" component={Gallery} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
