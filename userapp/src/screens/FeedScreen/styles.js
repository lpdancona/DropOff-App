import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerMenu: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#FF7276",
    padding: 20,
    maxHeight: "25%",
    paddingTop: 40,
    //gap: "100%",
  },
  headerContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#FF7276",
    padding: 20,
    //paddingTop: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  goBackIcon: {
    position: "absolute",
    alignItems: "center",
    top: 45,
    left: -15,
    zIndex: 1,
  },
  kidImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  kidImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  icon: {
    marginRight: 20,
  },
  eventContainer: {
    marginBottom: 10,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  date: {
    marginTop: 5,
    fontStyle: "italic",
    color: "gray",
  },
});
