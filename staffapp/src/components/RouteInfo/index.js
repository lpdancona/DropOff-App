import React, { useEffect } from "react";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
//import { Auth } from "aws-amplify";
import styles from "./styles";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const RouteInfoComponent = ({
  currentRoute,
  addressList,
  driver,
  helper,
  driverAction,
  setDriverAction,
  currentWaypoint,
}) => {
  const navigation = useNavigation();

  const goBackToHome = async () => {
    if (driverAction !== "Drive") {
      navigation.goBack();
    } else {
      // Display a confirmation prompt
      Alert.alert(
        "Confirm Go Back",
        "You are in the middle of the route. Are you sure you want to go back?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: async () => {
              // User confirmed, navigate back
              setDriverAction("Waiting");
              navigation.goBack();
            },
          },
        ]
      );
    }
  };

  // useEffect(() => {
  //   if (driverAction === "Drive") {
  //   }
  // }, [driverAction]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={goBackToHome}>
        <AntDesign name="arrowleft" size={30} color="white" />
      </TouchableOpacity>
      <View>
        <Text style={styles.heading}>Route Information</Text>
        <View style={styles.row}>
          <View style={styles.driverInfo}>
            <Text style={styles.driverLabel}>Driver:</Text>
            <Text style={styles.driverName}>{driver?.name}</Text>
            <Text style={styles.driverAction}>
              {driverAction === "Drive" ? "(Driving)" : "(Waiting)"}
            </Text>
          </View>

          <View style={styles.helperInfo}>
            <Text style={styles.helperLabel}>Helper:</Text>
            <Text style={styles.helperName}>{helper?.name}</Text>
          </View>
        </View>
        <View style={styles.infoColumn}>
          <View style={{ flexDirection: "row" }}>
            <Text> Route status: </Text>
            {currentRoute.status === "WAITING_TO_START" ? (
              <Text style={{ color: "green", fontSize: 15 }}>
                Waiting to start
              </Text>
            ) : (
              <Text
                style={{
                  color: "red",
                  fontSize: 15,
                }}
              >
                In progress - Departed Time {currentRoute.departTime}
              </Text>
            )}
            {/* <Text>
              {" "}
              Route Status{" - "}
              {currentRoute.status === "IN_PROGRESS"
                ? `In progress  Time started: ${currentRoute.departTime}`
                : "Waiting to start"}
            </Text> */}
          </View>
          <View style={styles.waypointInfo}>
            <Text style={styles.waypointLabel}>Driving to </Text>
            <Text style={styles.waypointName}>
              {addressList[currentWaypoint].Kid[0].name}
            </Text>
            <Text style={styles.waypointLabel}> home</Text>
          </View>
          <View>
            <Text style={styles.waypointAddress}>
              {addressList[currentWaypoint].Kid[0].dropOffAddress}
            </Text>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleLabel}>Vehicle:</Text>
              <Text style={styles.vehicleName}>
                {currentRoute.Van.name} - {currentRoute.Van.model}{" "}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RouteInfoComponent;
