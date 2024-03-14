import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  swiper: {
    //height: "10%",
    marginTop: "15%",
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    backgroundColor: "#ccc",
  },
  activeDot: {
    backgroundColor: "blue",
  },
  welcomeContainer: {
    //flex: 1,
    //flexGrow: 1,
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
    marginBottom: 6,
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
    marginTop: 8,
    //width: "100%",
    marginLeft: "1%",
    marginRight: "3%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  kidItem: {
    //backgroundColor: "lightgray",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginLeft: 2,
  },
  kidImageContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  updatesContainer: {
    flexDirection: "row",
    //position: "relative",
    marginLeft: 20,
    //top: -10,
    //right: -10,
    //backgroundColor: "red",
    //borderRadius: 12,
    //width: 24,
    //height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadCountText: {
    color: "red",
    fontWeight: "bold",
    padding: 5,
  },
});
