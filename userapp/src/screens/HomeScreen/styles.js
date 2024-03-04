import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  // containerMenu: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   backgroundColor: "#FF7276",
  //   padding: 10,
  // },
  // containerMenu: {
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   flexDirection: "row",
  //   backgroundColor: "#FF7276",
  //   padding: 20,
  //   maxHeight: "25%",
  //   paddingTop: 40,
  //   gap: "100%",
  // },
  swiper: {
    height: "50%",
    marginTop: "15%",
  },
  welcomeContainer: {
    marginTop: 20,
    marginLeft: 10,
  },
  date: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF7276",
    marginBottom: 20,
  },
  eventHeader: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  eventContainer: {
    borderRadius: 15,
    overflow: "hidden",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  eventImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  eventDetails: {
    padding: 15,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  eventDate: {
    fontSize: 16,
    color: "#555",
  },
  kidsContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 20,
    width: "70%",
    marginLeft: "15%",
    marginRight: "15%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  kidItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  kidImageContainer: {
    position: "relative",
  },
  kidImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  placeholderText: {
    color: "white",
  },
  kidName: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
