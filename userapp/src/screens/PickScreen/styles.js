import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    zIndex: 1,
  },
  containerMenu: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#FF7276",
    padding: 20,
    maxHeight: "25%",
    paddingTop: 40,
    gap: "100%",
  },
  initialsContainer: {
    width: 100,
    height: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  initialsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    marginTop: 10,
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  kidContainer: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    margin: 10,
    backgroundColor: "#fff", // Background color for the card
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  kidInfoContainer: {
    flex: 1,
    marginBottom: 10,
  },
  kidName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  kidAddress: {
    fontSize: 16,
    color: "#555",
  },
  photoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  kidPhoto: {
    width: 100,
    height: 100,
    borderRadius: 30,
    marginRight: 10,
  },
  cardSeparator: {
    borderBottomColor: "#ccc",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 10,
  },

  checkInStatus: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  statusText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
});
