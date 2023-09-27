import { StyleSheet } from "react-native";

export default StyleSheet.create({
  mapContainer: {
    backgroundColor: "lightblue", 
    flex: 1,
  },
  handleIndicator: {
    backgroundColor: "grey", 
    width: 100
  },
  handleIndicatorContainer:{
    flexDirection: "row", 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingBottom: 50,
  },
  routeDetailsText: {
    fontSize: 25, 
    letterSpacing: 1
  },
  deliveryDetailsContainer: {
    paddingHorizontal: 20,
  },
  infoOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 2, // Higher zIndex to be on top of the map
      padding: 10,
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
  restaurantName:{
    fontSize: 25, 
    letterSpacing: 1, 
    paddingVertical: 20
  },
  addressContainer: {
    flexDirection:'row', 
    marginBottom: 20,
    alignItems: 'center',
  },
  addressText: {
    fontSize: 20, 
    color: 'grey', 
    fontWeight: '500', 
    letterSpacing: 0.5,
    marginLeft: 15,
    textAlign: 'center',
  },
  orderDetailsContainer: {
    borderTopWidth: 1, 
    borderColor: 'lightgrey', 
    paddingTop: 20,
  },
  orderItemText: {
    fontSize: 18, 
    color: 'grey', 
    fontWeight: '500', 
    letterSpacing: 0.5, 
    marginBottom: 5,
  },
  buttonContainer: {
    backgroundColor:'#3fc060', 
    marginTop:'auto', 
    marginVertical: 30, 
    marginHorizontal:10, 
    borderRadius: 10,
  },
  buttonText:{
    color:'white', 
    paddingVertical: 15, 
    fontSize: 25, 
    fontWeight: '500', 
    textAlign: 'center', 
    letterSpacing: 0.5
  },
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 16,
  },
  image: {
    width: 180,
    height: 200,
    flex: 1,
    resizeMode: 'cover',
    borderRadius: 2,
    marginRight: 16, 
  },
})