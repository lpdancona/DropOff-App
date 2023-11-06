import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});
