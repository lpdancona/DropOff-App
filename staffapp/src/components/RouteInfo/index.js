import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Auth } from "aws-amplify";


const RouteInfoComponent = ({ vans, routeCoords, driver, helper }) => {
  // const waypoints = routeCoords.waypoints;
  // const splitIndex = 6; // Split after the 6th item
  // const firstColumn = routeCoords.slice(0, splitIndex);
  // const secondColumn = routeCoords.slice(splitIndex);

  const handleLogout = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.heading}>Route Information</Text>
        
         <View style={styles.row}>
            <View style={styles.driverInfo}>
              <Text style={styles.driverLabel}>Driver:</Text>
              <Text style={styles.driverName}>{driver[0]?.name}</Text>
            </View>

            <View style={styles.helperInfo}>
              <Text style={styles.helperLabel}>Helper:</Text>
              <Text style={styles.helperName}>{helper[0]?.name}</Text>
            </View>
        </View>
        <View style={styles.infoColumn}>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleLabel}>Vehicle:</Text>
            <Text style={styles.vehicleName}>{vans.name} - {vans.model} </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 10,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    elevation: 5,
  },
    logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: "row",
    justifyContent: 'space-around',
  },
  heading: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  infoColumn: {
    flex: 1,
    alignItems: 'center',
    marginTop: 2
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 0,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  driverLabel: {
    fontWeight: "bold",
    marginRight: 5,
  },
  helperName: {
    fontSize: 12,
  },
  vehicleName: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  vehicleLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 5,
  },
  helperInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  helperLabel: {
    fontWeight: "bold",
    marginRight: 5,
  },
  driverName: {
    fontSize: 12,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'center',
    marginTop: 0,
  },
  addressText: {
    marginLeft: 20,
    fontSize: 12,
    marginBottom: 5,
  },
  kidName: {
    marginLeft: 20,
    fontSize: 16,
    color: "#007BFF", // Custom color for kid names
    marginBottom: 5,
  },
  columns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    //marginLeft: 0,
  },
});
export default RouteInfoComponent;
