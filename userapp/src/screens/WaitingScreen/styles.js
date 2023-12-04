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
    marginTop: 50,
    marginBottom: -20,
    position: "relative",
  },
  centeredText: {
    textAlign: "center",
    zIndex: 1,
  },
  parallelogramContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  parallelogram1: {
    backgroundColor: "rgb(2, 119, 247)",
    transform: [{ skewY: "7deg" }],
    width: "100%",
    height: 100,
    marginTop: -160,
  },
  parallelogram2: {
    width: "100%",
    height: 120,
    marginTop: -145,
  },
  callBtn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgb(2 119 247)",
  },
});
