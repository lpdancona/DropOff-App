import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useRouteContext } from "../../../src/contexts/RouteContext";
import { useAuthContext } from "../../../src/contexts/AuthContext";

const HomeScreen = () => {
  const { routesData } = useRouteContext();
  const { dbUser } = useAuthContext();
  //console.log(routesData);
  if (!routesData) {
    return <ActivityIndicator size="large" color="gray" />;
  }
  const isUserDriverOrHelper = (route) => {
    return route.driver === dbUser?.id || route.helper === dbUser?.id;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Drop Off </Text>
      <Text style={styles.title}>List of Today Routes</Text>
      <FlatList
        data={routesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              if (isUserDriverOrHelper(item)) {
                // Handle the action for the user being the driver or helper
                console.log(
                  "User is the driver or helper for this route.",
                  dbUser.name
                );
              } else {
                // Handle the action for the user not being the driver or helper
                console.log("User is not the driver or helper for this route.");
              }
            }}
          >
            <View style={styles.routeItem}>
              <Text>Driver: {item.driverUser?.name}</Text>
              <Text>Helper: {item.helperUser?.name}</Text>
              <Text>
                Vehicle: {item.Van.name} {item.Van.model}
              </Text>
              <Text>Status: {item.status}</Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginTop: 50,
    fontWeight: "bold",
    marginBottom: 20,
  },
  routeItem: {
    padding: 26,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
});

export default HomeScreen;
