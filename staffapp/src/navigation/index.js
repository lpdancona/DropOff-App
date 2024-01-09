import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthContext } from "../contexts/AuthContext";
import { ActivityIndicator } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RouteScreen from "../screens/RouteScreen";

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
        <Stack.Screen name="StaffLogin" component={ProfileScreen} />
      )}
      <Stack.Screen name="Route" component={RouteScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
