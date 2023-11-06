import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
} from "react-native";
import styles from "./styles";
import { useRouteContext } from "../../../src/contexts/RouteContext";
import { useAuthContext } from "../../../src/contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { routesData } = useRouteContext();
  const { dbUser, currentUserData } = useAuthContext();
  const [images, setImages] = useState({});
  const defaultImageUrl = "https://i.imgur.com/R2PRpbV.jpg";

  const fetchImage = async (imageURL) => {
    try {
      const response = await fetch(imageURL);
      return response.url;
    } catch (error) {
      console.error("Error fetching image", error);
      return null;
    }
  };

  useEffect(() => {
    if (routesData) {
      // Fetch images for each route
      const imagePromises = routesData.map((route) => {
        const imageURL = route.Van.image;
        //console.log("imageUrl", imageURL);
        if (imageURL) {
          return fetchImage(imageURL);
        }
      });

      Promise.all(imagePromises)
        .then((fetchedImages) => {
          const imagesMap = {};
          fetchedImages.forEach((image, index) => {
            imagesMap[index] = image;
          });
          setImages(imagesMap);
        })
        .catch((error) => {
          console.error("Error fetching images", error);
        });
    }
  }, [routesData]);

  if (!routesData) {
    return <ActivityIndicator size="large" color="gray" />;
  }
  const isUserDriverOrHelper = (route) => {
    return route.driver === dbUser?.id || route.helper === dbUser?.id;
  };

  const handleBusPress = (item, index) => {
    navigation.navigate("Route", { id: item.id });
    // //console.log("route", routesData);
    // if (isUserDriverOrHelper(item)) {
    //   // Handle the action for the user being the driver or helper
    //   console.log("User is the driver or helper for this route.", dbUser.name);
    // } else {
    //   // Handle the action for the user not being the driver or helper
    //   console.log("User is not the driver or helper for this route.");
    // }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{`Hello, ${currentUserData.name}`}</Text>
      <Text style={styles.subTitle}>
        You assigned as{" "}
        <Text
          style={{
            color: isUserDriverOrHelper ? "red" : "yellow",
          }}
        >
          {isUserDriverOrHelper ? "Driver" : "Helper"}
        </Text>
      </Text>
      <Text style={styles.subTitleDropOff}>List of Drop-Off's</Text>
      <View style={styles.busContainer}>
        <FlatList
          data={routesData}
          style={{ padding: 2 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => {
                handleBusPress(item, index);
              }}
              //style={styles.busContainer}
            >
              <Image
                source={
                  images[index]
                    ? { uri: images[index] }
                    : { uri: defaultImageUrl }
                }
                style={styles.image}
              />
              <View style={styles.busTextContainer}>
                <View>
                  <Text style={styles.itemTitle}>
                    Vehicle: {item.Van.name} {item.Van.model}
                  </Text>
                  <View style={styles.driverHelperContainer}>
                    {item.driverUser && ( // Render "Driver" and "Helper" only if driverUser is not null
                      <Text style={{ marginRight: 10 }}>
                        Driver: {item.driverUser?.name}
                      </Text>
                    )}
                    {item.helperUser && ( // Render "Helper" only if helperUser is not null
                      <Text>Helper: {item.helperUser?.name}</Text>
                    )}
                  </View>
                </View>
                <Text style={styles.itemTitle}>
                  {item.status === "WAITING_TO_START" ? (
                    <Text style={{ color: "green" }}>Waiting to start</Text>
                  ) : (
                    <Text
                      style={{
                        color: "red",
                      }}
                    >
                      In progress
                    </Text>
                  )}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
