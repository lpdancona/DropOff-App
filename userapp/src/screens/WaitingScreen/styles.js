import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  waveImage: {
    position: "absolute",
  },
  centeredTextWrapper: {
    marginHorizontal: 20, // Adjust the margin as needed
    marginTop: 20,
  },
  centeredText: {
    textAlign: "center",
  },
  callBtn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgb(2 119 247)",
  },
});
