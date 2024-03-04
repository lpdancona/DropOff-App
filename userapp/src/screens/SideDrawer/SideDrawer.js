import React, { useState } from "react";
import { Auth } from "aws-amplify";
import styles from "./styles";
import {
  View,
  Text,
  TouchableHighlight,
  Modal,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const SideDrawer = () => {
  const navigation = useNavigation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleSideDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleOverlayPress = () => {
    setIsDrawerOpen(false);
  };

  const navigateToComponent = (screenName) => {
    navigation.navigate(screenName);
    setIsDrawerOpen(false);
  };

  const handleLogout = async () => {
    try {
      // Sign out the user using Amplify Auth
      await Auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsDrawerOpen(false);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.containerMenu}>
        <TouchableOpacity onPress={toggleSideDrawer} style={styles.menuIcon}>
          <MaterialIcons name="menu" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <Modal visible={isDrawerOpen} transparent={true} animationType="slide">
        <TouchableOpacity
          onPress={handleOverlayPress}
          style={styles.overlay}
        ></TouchableOpacity>

        <View style={styles.drawer}>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={toggleSideDrawer}
            style={styles.closeButton}
          >
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => navigateToComponent("Home")}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Home</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => navigateToComponent("DropOffRoute")}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Drop Off</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => navigateToComponent("Chat")}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Chat</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => navigateToComponent("Pick")}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Kid Info</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => navigateToComponent("Gallery")}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>Gallery</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={handleLogout}
            style={[styles.menuItem, { backgroundColor: "#FF7276" }]}
          >
            <MaterialIcons name="logout" size={30} color="white" />
          </TouchableHighlight>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SideDrawer;
