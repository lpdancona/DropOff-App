import React from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
//import { Auth } from "aws-amplify";
import styles from "./styles";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const RouteInfoComponent = ({ currentRoute, addressList, driver, helper }) => {
  const navigation = useNavigation();

  const goBackToHome = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={goBackToHome}>
        <AntDesign name="arrowleft" size={30} color="black" />
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
          <View>
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
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleLabel}>Vehicle:</Text>
            <Text style={styles.vehicleName}>
              {currentRoute.Van.name} - {currentRoute.Van.model}{" "}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RouteInfoComponent;
