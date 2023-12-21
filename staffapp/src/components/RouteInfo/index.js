import React from "react";
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
  currentWaypoint,
}) => {
  const navigation = useNavigation();

  const goBackToHome = () => {
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
            onPress: () => {
              // User confirmed, navigate back
              navigation.goBack();
            },
          },
        ]
      );
    }
  };
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
          </View>

          <View style={styles.helperInfo}>
            <Text style={styles.helperLabel}>Helper:</Text>
            <Text style={styles.helperName}>{helper?.name}</Text>
          </View>
        </View>
        <View style={styles.infoColumn}>
          <View style={{ flexDirection: "row" }}>
            <Text> Route Status: </Text>
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
            <Text style={styles.waypointLabel}>Driving to home of: </Text>
            <Text style={styles.waypointName}>
              {addressList[currentWaypoint].Kid[0].name}
            </Text>
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
