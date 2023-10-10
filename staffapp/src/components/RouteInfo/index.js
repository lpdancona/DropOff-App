import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Auth } from "aws-amplify";
import styles from "./styles";

const RouteInfoComponent = ({ vans, addressList, driver, helper }) => {
  // const waypoints = routeCoords.waypoints;
  // const splitIndex = 6; // Split after the 6th item
  // const firstColumn = routeCoords.slice(0, splitIndex);
  // const secondColumn = routeCoords.slice(splitIndex);

  const handleLogout = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.heading}>Route Information</Text>
        <View style={styles.row}>
          <View style={styles.driverInfo}>
            <Text style={styles.driverLabel}>Driver:</Text>
            <Text style={styles.driverName}>{driver.name}</Text>
          </View>

          <View style={styles.helperInfo}>
            <Text style={styles.helperLabel}>Helper:</Text>
            <Text style={styles.helperName}>{helper.name}</Text>
          </View>
        </View>
        {/* <View style={styles.addressList}>
          {addressList.map((waypoint, index) => (
            <View key={index} style={styles.addressItem}>
              <Text style={styles.addressItemText}>
                {index + 1} - {waypoint.kidName}
              </Text>
              <Text style={styles.addressText}>{waypoint.description}</Text>
            </View>
          ))}
        </View> */}
        <View style={styles.infoColumn}>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleLabel}>Vehicle:</Text>
            <Text style={styles.vehicleName}>
              {vans.name} - {vans.model}{" "}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RouteInfoComponent;
