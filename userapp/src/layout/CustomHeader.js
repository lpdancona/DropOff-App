import { Text, SafeAreaView, View, Image } from "react-native";
import { useTheme } from "@aws-amplify/ui-react-native";

const MyAppHeader = () => {
  const {
    tokens: { space, fontSizes },
  } = useTheme();
  return (
    <SafeAreaView>
      <Image
        source={require("../../assets/icon.png")}
        style={{
          width: "100%",
          height: "30%",
          resizeMode: "contain",
          alignSelf: "center",
        }}
      />
      <Text
        style={{
          fontSize: 20, //fontSizes.xxl,
          //paddingBottom: space.xxl,
          textAlign: "center",
        }}
      >
        AfterSchool Program Drop Off
      </Text>
    </SafeAreaView>
  );
};
export default MyAppHeader;
