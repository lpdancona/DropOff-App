import { StyleSheet } from "react-native";

export default StyleSheet.create({
  mapContainer: {
    paddingTop: 15,
    backgroundColor: "#FF7276",
    flex: 1,
    position: "relative",
  },
  containerMenu: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#FF7276",
    padding: 20,
    maxHeight: "25%",
    gap: "100%",
  },
  logoutMenu: {
    marginLeft: 15,
    marginTop: 20,
    marginRight: "50%",
  },
  modalContainer: {
    marginTop: 40,
  },

  handleIndicator: {
    backgroundColor: "grey",
    width: 100,
    color: "#FF7276",
  },
  handleIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
  },
  routeDetailsText: {
    fontSize: 20,
    letterSpacing: 2,
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
  zoomButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#FF7276",
    borderRadius: 50,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    paddingVertical: 48,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  modalContent: {
    padding: 16,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e3e3e3",
  },
  profileName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "600",
    color: "#090909",
  },
  profileEmail: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "400",
    color: "#848484",
  },
  staffNumber: {
    marginTop: 6,
    fontSize: 16,
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
  driverContainer: {
    paddingVertical: 5,
    paddingHorizontal: 50,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  profile: {
    padding: 12,
    gap: 0,
    backgroundColor: "#f6f6f6",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 9999,
    marginRight: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#292929",
  },
  profileHandle: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "400",
    color: "#858585",
  },
  helperDsc: {
    marginTop: 20,
  },
  callBtn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
