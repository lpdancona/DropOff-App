import React from "react";
import {
  View,
  Text,
  useWindowDimensions,
  Image,
  TextStyle,
  TouchableOpacity,
  Linking,
} from "react-native";
import styles from "./styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const WaitingScreen = () => {
  const windowWidth = useWindowDimensions().width;

  const funTextStyle: TextStyle = {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    textTransform: "uppercase",
    letterSpacing: 2,
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../docs/ondacima.png")}
        style={[styles.waveImage, { top: 0, height: 115, width: 480 }]}
      />
      <Image
        source={require("../../docs/afterlogo.png")}
        style={{ height: 200, width: 400, marginTop: -30 }}
      />
      <View style={styles.centeredTextWrapper}>
        <Text style={[funTextStyle, styles.centeredText]}>
          Hello Family, We don't have a route for your little champ yet. please
          check back in a moment
        </Text>
      </View>
      <Text style={[funTextStyle, { marginTop: "90%", marginBottom: 10 }]}>
        Have Questions? Give us a call
      </Text>
      <View style={{ alignItems: "center", marginTop: 1 }}>
        <TouchableOpacity
          onPress={() => {
            const phoneNumber = "2368652297";
            const phoneNumberWithPrefix = `tel:${phoneNumber}`;

            Linking.canOpenURL(phoneNumberWithPrefix)
              .then((supported) => {
                if (!supported) {
                  console.error("Phone number not supported");
                } else {
                  return Linking.openURL(phoneNumberWithPrefix);
                }
              })
              .catch((error) => console.error(error));
          }}
          style={{
            backgroundColor: "rgb(2 119 247)",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <View style={styles.callBtn}>
            <Text style={{ color: "white", fontSize: 20 }}>Call Us </Text>
            <MaterialIcons name="call" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>
      <Image
        source={require("../../docs/ondabaixo.png")}
        style={[styles.waveImage, { bottom: 0, height: 102, width: 500 }]}
      />
    </View>
  );
};

export default WaitingScreen;
