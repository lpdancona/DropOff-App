import React from "react";
import {
  View,
  Text,
  TouchableHighlight,
  Modal,
  StyleSheet,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Auth } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
const SideDrawer = ({ isVisible, onClose, onLogout }) => {
  const navigation = useNavigation();
  const handleOverlayPress = () => {
    if (isVisible) {
      onClose();
    }
  };
  const navigateToComponent = () => {
    navigation.navigate("Chat");
    onClose();
  };
  const navigateHome = () => {
    navigation.navigate("Home");
    onClose();
  };
  const navigatePick = () => {
    navigation.navigate("Pick");
    onClose();
  };
  const navigateLoading = () => {
    navigation.navigate("Loading");
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <TouchableHighlight
        underlayColor="transparent"
        onPress={handleOverlayPress}
        style={styles.container}
      >
        <View style={styles.drawer}>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={onClose}
            style={styles.closeButton}
          >
            <MaterialIcons name="close" size={30} color="white" />
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={navigateLoading}
            style={[styles.menuItem]}
          >
            <Text style={{ color: "white" }}>Home</Text>
          </TouchableHighlight>

          <TouchableHighlight
            underlayColor="transparent"
            onPress={navigateHome}
            style={[styles.menuItem]}
          >
            <View style={[styles.ItemContainer]}>
              <Text style={{ color: "white" }}>Drop Off</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={navigateToComponent}
            style={[styles.menuItem]}
          >
            <Text style={{ color: "white" }}>Chat</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={navigatePick}
            style={[styles.menuItem]}
          >
            <Text style={{ color: "white" }}>Kid Info</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="transparent"
            onPress={onLogout}
            style={[styles.menuItem, { backgroundColor: "#FF7276" }]}
          >
            <MaterialIcons name="logout" size={30} color="white" />
          </TouchableHighlight>
        </View>
      </TouchableHighlight>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  drawer: {
    backgroundColor: "#FF7276",
    height: "88%",
    width: "40%",
    padding: 20,
  },
  closeButton: {
    marginBottom: 20,
    marginTop: 40,
  },
  menuItem: {
    paddingVertical: 30,
  },
  ItemContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});

export default SideDrawer;
