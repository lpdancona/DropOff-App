import { useRef, useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Pressable,
  Modal,
  SafeAreaView,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
//import vans from '../../../assets/data/vans.json';
import styles from "./styles";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useNavigation } from "@react-navigation/native";
import RouteInfoComponent from "../../components/RouteInfo";
//import { DataStore } from "aws-amplify";
//import { Route, Van, Kid, User } from "../../models";
import { useAuthContext } from "../../contexts/AuthContext";
import { API, graphqlOperation } from "aws-amplify";
import { listRoutes, kidsByRouteID, getVan } from "../../graphql/queries";
import vans from "../../../assets/data/vans.json";

// import * as Notifications from 'expo-notifications'
// import * as Permissions from 'expo-permissions'
// import * as Device from 'expo-device';
import axios from "axios";

const sendNotification = async (notificationTitle, notificationBody) => {
  const apiUrl = "https://app.nativenotify.com/api/notification";
  const currentDate = new Date();
  const notificationDate = `${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}-${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}${
    currentDate.getHours() >= 12 ? "PM" : "AM"
  }`;
  //console.log(notificationDate);
  try {
    const response = await axios.post(apiUrl, {
      appId: 12497,
      appToken: "wDb6oKTWDGkDZd1Rv468rP",
      title: notificationTitle,
      body: notificationBody,
      dateSent: notificationDate,
      //pushData: { yourProperty: 'yourPropertyValue' },
      //bigPictureURL: 'Big picture URL as a string',
    });

    if (response.status === 200) {
      console.log("Notification sent successfully");
    } else {
      console.error("Failed to send notification");
      console.error(response.data);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const HomeScreen = () => {
  const { dbUser, isDriver, currentUserData } = useAuthContext();
  const van = vans[0];
  const gbLocation = {
    latitude: 49.263527201707745,
    longitude: -123.10070015042552,
  }; // gb location (we can import from the database in future)

  //const { address } = van.waypoints;
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const { width, height } = useWindowDimensions();
  //const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);

  const [isDriverClose, setIsDriverClose] = useState(false);

  const snapPoints = useMemo(() => ["12%", "95%"], []);
  const navigation = useNavigation();

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  //const [dbRoute, setDbRoute] = useState(null);
  //const [vans, setVans] = useState([]);
  //const [kids, setKids] = useState([]);
  //const [helper, setHelper] = useState([]);
  //const [driver, setDriver] = useState([]);
  //const [routeCoords, setRouteCoords] = useState([]);
  const [busLocation, setBusLocation] = useState(null);
  const [routesData, setRoutesData] = useState(null);
  const [currentRouteData, setCurrentRouteData] = useState(null);
  const [addressList, setAddressList] = useState(null);

  const renderItem = ({ item, index }) => {
    if (!dbRoute) {
      return <ActivityIndicator size="large" color="gray" />;
    }
    //console.log(routeCoords)
    return (
      <Pressable
        onPress={(e) => {
          setSelectedItem(item);
          //setClickPositionY(e.nativeEvent.pageY);
        }}
      >
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>
            {/* {item.first_name} {item.last_name} */}
            {item.name}
          </Text>
        </View>
      </Pressable>
    );
  };

  const getRoutesData = async () => {
    try {
      //console.log("isDriver? ", isDriver);
      const variables = {
        filter: {
          status: { eq: "WAITING_TO_START" },
        },
      };

      // Fetch route data
      const responseListRoutes = await API.graphql({
        query: listRoutes,
        variables: variables,
      });
      const routeData = responseListRoutes.data.listRoutes.items;

      // Fetch kids data for each route
      const mergedData = await Promise.all(
        routeData.map(async (route) => {
          const responseKidsByRouteID = await API.graphql({
            query: kidsByRouteID,
            variables: { routeID: route.id },
          });
          const kidsData = responseKidsByRouteID.data.kidsByRouteID.items;
          // fetch the van
          const responseGetVan = await API.graphql({
            query: getVan,
            variables: { id: route.routeVanId },
          });
          const vansData = responseGetVan.data.getVan;

          return { ...route, Kid: kidsData, Van: vansData };
        })
      );

      setRoutesData(mergedData);
    } catch (error) {
      console.error("Error fetching data getROutesData: ", error);
    }
  };

  const checkStaffInRoutes = () => {
    //console.log("current user ", currentUserData);

    if (routesData && (isDriver || isHelper)) {
      const roleToCheck = isDriver ? "driver" : "helper";

      const routeWithMatchingRole = routesData.find((item) => {
        if (item[roleToCheck] && item[roleToCheck] === dbUser.id) {
          return true;
        }
        return false;
      });

      if (routeWithMatchingRole) {
        // Update the state variable with the route that has matching role
        setCurrentRouteData(routeWithMatchingRole);
      } else {
        // Handle case when no matching route is found
        console.log(
          `No route found for ${roleToCheck} with user ID ${dbUser.id}`
        );
      }
    }
  };

  useEffect(() => {
    // Fetch initial data when the component mounts
    const fetchInitialData = async () => {
      await getRoutesData();
    };
    fetchInitialData();
  }, [dbUser]);

  useEffect(() => {
    if (routesData) {
      checkStaffInRoutes();
      //console.log("current route ", currentRouteData);
    }
  }, [routesData]);

  useEffect(() => {
    if (currentRouteData) {
      const waypoints = JSON.parse(currentRouteData.route);
      setAddressList(waypoints.routeData);
      //console.log(addressList);
    }
  }, [currentRouteData]);

  // const updatedLocation = async () => {
  //   console.log("driver location", driverLocation);
  //   try {
  //     const response = await API.graphql(
  //       graphqlOperation(updateRoute, {
  //         input: {
  //           id: dbRoute.id,
  //           lat: driverLocation.latitude,
  //           lng: driverLocation.longitude,
  //           departTime: 10,
  //         },
  //       })
  //     );

  //     console.log("Route updated successfully", response);
  //   } catch (error) {
  //     console.error("Error updating route", error);
  //   }
  // };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (!status === "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: 5 });
      setBusLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      // setDbRoute({...dbRoute,
      //   lat : location.coords.latitude,
      //   lng : location.coords.longitude
      // })
    })();

    const foregroundSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 10,
      },
      (updatedLocation) => {
        setBusLocation({
          latitude: updatedLocation.coords.latitude,
          longitude: updatedLocation.coords.longitude,
        });
      }
    );
    return () => foregroundSubscription;
  }, []);

  const zoomInOnDriver = () => {
    mapRef.current.animateToRegion({
      latitude: busLocation.latitude,
      longitude: busLocation.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    });
  };

  //console.log(JSON.parse(currentRouteData.route));
  //console.log(addressList);
  if (!busLocation || !currentRouteData) {
    return <ActivityIndicator style={{ padding: 50 }} size={"large"} />;
  }

  if (addressList === null) {
    return <ActivityIndicator style={{ padding: 50 }} size={"large"} />;
  }

  return (
    <SafeAreaView style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        provider={MapView.PROVIDER_GOOGLE}
        style={{ width, height }}
        showsUserLocation={true}
        followsUserLocation={true}
        initialRegion={{
          latitude: busLocation.latitude,
          longitude: busLocation.longitude,
          latitudeDelta: 0.007,
          longitudeDelta: 0.007,
        }}
      >
        <MapViewDirections
          origin={busLocation} // Start from the first waypoint
          destination={addressList[addressList?.length - 1]} // End at the last waypoint
          waypoints={addressList} // Exclude the start and end waypoints
          strokeWidth={7}
          strokeColor="#3fc060"
          apikey={GOOGLE_MAPS_APIKEY}
          onReady={(result) => {
            // Handle the route information here
            setIsDriverClose(result.getMinutes <= 5);
            setTotalMinutes(result.duration);
            setTotalKm(result.distance);
          }}
        />
        <Marker
          coordinate={{
            latitude: busLocation.latitude,
            longitude: busLocation.longitude,
          }}
          title={"Gracie Barra Van"}
          description={vans?.name}
        >
          <View style={{ padding: 5 }}>
            <FontAwesome5 name="map-marker-alt" size={30} color="red" />
          </View>
        </Marker>
        {/* <Marker
          coordinate={{
            latitude: van.waypoints.latitude, 
            longitude: van.waypoints.longitude
          }}
          title={van.kidsInRoute[address].first_name + " " +van.kidsInRoute[address].last_name + "  House's"} 
          //description={}
        >
           <View style={{padding: 5}}>
            <FontAwesome5 name='home' size={30} color='green' />
          </View>
        </Marker> */}
        {addressList.map((waypoint, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: waypoint.latitude,
              longitude: waypoint.longitude,
            }}
            //title={`${waypoint.kidName} House's`}
            //description={`${waypoint.latitude}, ${waypoint.longitude}`}
          >
            <View style={{ padding: 5 }}>
              <FontAwesome5 name="map-marker-alt" size={25} color="red" />
            </View>
          </Marker>
        ))}
      </MapView>
      {/* <View style={styles.addressList}>
        {routeCoords.map((waypoint, index) => (
          <View key={index} style={styles.addressItem}>
            <Text style={styles.addressItemText}>
              Waypoint {index + 1}: {waypoint.latitude}, {waypoint.longitude}
            </Text>
          </View>
        ))}
      </View> */}
      {/* <RouteInfoComponent
        vans={vans}
        routeCoords={routeCoords}
        driver={driver}
        helper={helper}
      /> */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style={styles.handleIndicatorContainer}>
          <Text style={styles.routeDetailsText}>
            {" "}
            ETA - {totalMinutes.toFixed(0)} min
          </Text>
          <FontAwesome5
            name="bus"
            size={30}
            color="#3fc060"
            style={{ marginHorizontal: 10 }}
          />
          <Text style={styles.routeDetailsText}>{totalKm.toFixed(2)} Km</Text>
        </View>
        <Text style={{ textAlign: "center", padding: 5 }}>
          Kids on the Route ({vans?.name} - {vans?.model})
        </Text>

        <View style={{ flex: 1, paddingBottom: 10, marginBottom: 65 }}>
          {/* <BottomSheetFlatList
            data={kids} //data={van.kidsInRoute}
            renderItem={renderItem}
            keyExtractor={(item) => item.name.toString()}
            contentContainerStyle={{ backgroundColor: "white" }}

            // ListFooterComponent={() => (
            //   <View>

            //   </View>
            // )}
          /> */}

          <Modal
            visible={selectedItem !== null}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              setSelectedItem(null);
            }}
            //presentationStyle="overFullScreen"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Render the popup content here with information about selectedItem */}
                {selectedItem && (
                  <View>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>Name:</Text>{" "}
                      {selectedItem.name}
                    </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>Parent name:</Text>{" "}
                      {selectedItem.parentName}
                    </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>Unit Number:</Text>{" "}
                      {selectedItem.unitNumber}
                    </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>
                        Street Address:
                      </Text>{" "}
                      {selectedItem.streetAddress}
                    </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>Comments:</Text>{" "}
                      {selectedItem.commentsAddress}
                    </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>Phone number:</Text>{" "}
                      {selectedItem.parentPhoneNumber}
                    </Text>
                    <Pressable
                      onPress={() => {
                        // Handle the action to call the parent here
                        const phoneNumber = selectedItem.parentPhoneNumber;
                        const phoneNumberWithPrefix = `tel:${phoneNumber}`;

                        Linking.canOpenURL(phoneNumberWithPrefix)
                          .then((supported) => {
                            if (!supported) {
                              console.error("Phone number not supported");
                            } else {
                              return Linking.openURL(phoneNumberWithPrefix);
                            }
                          })
                          .catch((error) => console.error(error));
                      }}
                      style={styles.callParentButton}
                    >
                      <Text style={styles.callParentButtonText}>
                        Call Parent
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setSelectedItem(null); // Close the popup when pressed
                      }}
                      style={styles.closeButton}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          </Modal>
        </View>
        <View style={styles.buttonDriveContainer}>
          <TouchableOpacity
            onPress={() => {
              zoomInOnDriver();
              // send push notification to user app
              sendNotification(
                "Drop-off starting",
                "Dear parents, The children are leaving for drop off. Remember that we care about the maximum safety of the children, so there may be delays in the estimated time depending on traffic. Thank you"
              );
              // Create an array of waypoint coordinates
              // const waypointsWithoutLast = dbRoute?.route.slice(0, -1);
              // const waypoints = waypointsWithoutLast.map((waypoint) => {
              //   return `${waypoint.latitude},${waypoint.longitude}`;
              // });

              //   // Join the waypoints into a single string separated by "|" (pipe)
              //   const waypointsString = waypoints.join("|");

              //   // Get the driver's current location (origin)
              //   const origin = `${driverLocation.latitude},${driverLocation.longitude}`;
              //   const lastWaypoint = dbRoute?.route[dbRoute?.route.length - 1];
              //   const destination = `${lastWaypoint.latitude},${lastWaypoint.longitude}`;
              //   // Construct the Google Maps URL with the origin and waypoints
              //   const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=${origin}&destination=${destination}&waypoints=${waypointsString}`;

              //   // Open Google Maps with the origin and waypoints pre-set
              //   Linking.openURL(googleMapsUrl);
              //console.log(googleMapsUrl)
              // Send location data to MongoDB database
              // You will need to implement this part using a backend server
              // Use Axios or a similar library to make a POST request to your server
              // Include the driver's current location, route details, and any other necessary data
              // Example:
              // axios.post('your_server_url', {
              //   driverLocation: {
              //     latitude: driverLocation.latitude,
              //     longitude: driverLocation.longitude,
              //   },
              //   routeDetails: {
              //     // Include route details here
              //   },
              //   // Other data as needed
              // });
            }}
            style={{ backgroundColor: "green", padding: 10, borderRadius: 10 }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>Drive</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default HomeScreen;
