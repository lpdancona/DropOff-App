import { StyleSheet } from "react-native";

export default StyleSheet.create({
  mapContainer: {
    //top:50,
    backgroundColor: "lightblue",
    flex: 1,
    position: "relative",
  },
  handleIndicator: {
    backgroundColor: "grey",
    width: 100,
  },
  handleIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
  },
  routeDetailsText: {
    fontSize: 25,
    letterSpacing: 1,
  },
  deliveryDetailsContainer: {
    paddingHorizontal: 20,
  },
  infoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    //zIndex: 2, // Higher zIndex to be on top of the map
    padding: 10,
    zIndex: 1,
  },
  infoBoard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 25,
    letterSpacing: 1,
    paddingVertical: 20,
  },
  addressContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  addressText: {
    fontSize: 20,
    color: "grey",
    fontWeight: "500",
    letterSpacing: 0.5,
    marginLeft: 15,
    textAlign: "center",
  },
  orderDetailsContainer: {
    borderTopWidth: 1,
    borderColor: "lightgrey",
    paddingTop: 20,
  },
  orderItemText: {
    fontSize: 18,
    color: "grey",
    fontWeight: "500",
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  buttonContainer: {
    backgroundColor: "#3fc060",
    marginTop: "auto",
    marginVertical: 30,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    paddingVertical: 15,
    fontSize: 25,
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  imageDriver: {
    // flex: 1,
    width: 170,
    aspectRatio: 2 / 3,
    marginBottom: 5,
  },
  imageHelper: {
    // flex: 1,
    width: 180,
    //height: 271,
    aspectRatio: 3 / 3,
    marginTop: 13,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    //position: "absolute",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    //position: "absolute",
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "red",
    padding: 10,
    borderRadius: 30, // Adjust the border radius as needed
  },
  closeButtonText: {
    color: "white", // Text color
    fontSize: 16,
    fontWeight: "bold",
  },
});
