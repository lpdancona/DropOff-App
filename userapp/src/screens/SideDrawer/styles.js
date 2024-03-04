import { StyleSheet } from "react-native";

export default StyleSheet.create({
  containerMenu: {
    backgroundColor: "#FF7276",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    padding: 25,
  },
  overlay: {
    // flex: 1,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    // flexDirection: "row",
  },
  drawer: {
    backgroundColor: "#FF7276",
    height: "88%",
    width: "40%",
    padding: 20,
  },
  closeButton: {
    marginBottom: 10,
    marginTop: 20,
  },
  menuItem: {
    paddingVertical: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: "#fff",
  },
  ItemContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  menuIcon: {
    position: "absolute",
    alignItems: "center",
    left: 20,
    zIndex: 999, // Ensures it's above other elements
  },
  menuText: {
    color: "white",
    fontSize: 15,
  },
});
