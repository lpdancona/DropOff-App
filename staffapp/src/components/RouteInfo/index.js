import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Auth } from "aws-amplify";
import styles from "./styles";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const RouteInfoComponent = ({ vans, addressList, driver, helper }) => {
  const navigation = useNavigation();

  const goBackToHome = () => {
    navigation.goBack();
  };
  const handleLogout = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
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
    </SafeAreaView>
  );
};

export default RouteInfoComponent;
