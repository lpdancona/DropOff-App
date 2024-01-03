import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 12,
    backgroundColor: "white",
    width: 400,
    marginLeft: "auto",
    marginRight: "auto",
    margin: "auto",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardTop: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardImg: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardBody: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#2d2d2d",
  },
  cardFooter: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: "#e9e9e9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
  cardFooterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    marginTop: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 15,
    marginTop: 10,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitleDropOff: {
    fontSize: 25,
    marginTop: 10,
    fontWeight: "bold",
    marginBottom: 10,
  },
  busContainer: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 8,
  },
  noRoutesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noRoutesText: {
    fontSize: 28,
    color: "gray",
    textAlign: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 5 / 3,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 5,
  },
  busTextContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 5,
  },
  itemSubTitle: {
    color: "grey",
  },
  driverHelperContainer: {
    flexDirection: "row",
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    marginLeft: "20%",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 0,
  },
  headerGreetings: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
