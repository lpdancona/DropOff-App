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
  FlatList,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
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
import {
  listRoutes,
  kidsByRouteID,
  getVan,
  getUser,
  listAddressLists,
  getKid,
} from "../../graphql/queries";
import { updateRoute } from "../../graphql/mutations";
import { usePushNotificationsContext } from "../../contexts/PushNotificationsContext";

// import vans from "../../../assets/data/vans.json";

// import * as Notifications from 'expo-notifications'
// import * as Permissions from 'expo-permissions'
// import * as Device from 'expo-device';

// const sendNotification = async (notificationTitle, notificationBody) => {
//   const apiUrl = "https://app.nativenotify.com/api/notification";
//   const currentDate = new Date();
//   const notificationDate = `${
//     currentDate.getMonth() + 1
//   }-${currentDate.getDate()}-${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}${
//     currentDate.getHours() >= 12 ? "PM" : "AM"
//   }`;
//   //console.log(notificationDate);
//   try {
//     const response = await axios.post(apiUrl, {
//       appId: 12497,
//       appToken: "wDb6oKTWDGkDZd1Rv468rP",
//       title: notificationTitle,
//       body: notificationBody,
//       dateSent: notificationDate,
//       //pushData: { yourProperty: 'yourPropertyValue' },
//       //bigPictureURL: 'Big picture URL as a string',
//     });

//     if (response.status === 200) {
//       console.log("Notification sent successfully");
//     } else {
//       console.error("Failed to send notification");
//       console.error(response.data);
//     }
//   } catch (error) {
//     console.error("Error sending notification:", error);
//   }
// };

const HomeScreen = () => {
  const { schedulePushNotification, sendPushNotification, expoPushToken } =
    usePushNotificationsContext();
  const { dbUser, isDriver, currentUserData } = useAuthContext();
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const { width, height } = useWindowDimensions();
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [isDriverClose, setIsDriverClose] = useState(false);
  const snapPoints = useMemo(() => ["12%", "95%"], []);
  const navigation = useNavigation();
  const [helper, setHelper] = useState([]);
  const [driver, setDriver] = useState([]);
  const [busLocation, setBusLocation] = useState(null);
  const [routesData, setRoutesData] = useState(null);
  const [currentRouteData, setCurrentRouteData] = useState(null);
  const [addressList, setAddressList] = useState(null);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [nextWaypoints, setNextWaypoints] = useState(null);
  const [notificationSent, setNotificationSent] = useState(false);

  const renderItem = ({ item, index }) => {
    if (!currentRouteData) {
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

  const getOrderAddress = async () => {
    try {
      const variables = {
        filter: {
          routeID: { eq: currentRouteData.routeID },
        },
      };
      const responseListAddress = await API.graphql({
        query: listAddressLists,
        variables: variables,
      });
      const AddressListsData = responseListAddress.data.listAddressLists.items;
      const sortedAddressList = AddressListsData.sort(
        (a, b) => a.order - b.order
      );

      const addressListWithKids = await Promise.all(
        sortedAddressList.map(async (addressListItem) => {
          try {
            const responseGetKid = await API.graphql({
              query: getKid,
              variables: { id: addressListItem.addressListKidId },
            });
            const kidData = responseGetKid.data.getKid;
            //console.log("kid Data", kidData);
            return {
              ...addressListItem,
              Kid: kidData,
            };
          } catch (kidError) {
            console.error("Error fetching Kid data", kidError);
            return addressListItem;
          }
        })
      );
      // Filter out addresses with the same latitude and longitude
      const uniqueAddressList = addressListWithKids.filter(
        (address, index, self) =>
          index ===
          self.findIndex(
            (a) => a.Kid.dropOffAddress === address.Kid.dropOffAddress
          )
      );
      setAddressList(uniqueAddressList);
    } catch (error) {
      console.error("Error fetching getOrderAddress: ", error);
    }
  };

  const getRoutesData = async () => {
    try {
      //console.log("isDriver? ", isDriver);
      const variables = {
        filter: {
          or: [
            { status: { eq: "WAITING_TO_START" } },
            { status: { eq: "IN_PROGRESS" } }, //status: { eq: "IN_PROGRESS" }, //
          ],
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

    if (routesData && isDriver) {
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

  const getStaffInfo = async () => {
    const driverData = await API.graphql({
      query: getUser,
      variables: { id: currentRouteData.driver },
    });
    setDriver(driverData.data.getUser);
    const helperData = await API.graphql({
      query: getUser,
      variables: { id: currentRouteData.helper },
    });
    setHelper(helperData.data.getUser);
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
      getOrderAddress();
      // const waypoints = currentRouteData.Kid.map((kid, index) => ({
      //   latitude: kid.lat,
      //   longitude: kid.lng,
      //   kidName: kid.name,
      //   description: `${kid.dropOffAddress}`,
      // })); //JSON.parse(currentRouteData.route);
      // console.log(waypoints);
      // setAddressList(waypoints);
      //console.log(addressList);
    }
  }, [currentRouteData]);

  const handleNextWaypoint = () => {
    setCurrentWaypointIndex((prevIndex) => prevIndex + 1);
  };

  useEffect(() => {
    if (currentRouteData) {
      getStaffInfo();
    }
  }, [currentRouteData]);

  const updateRouteStatus = async (status) => {
    //console.log(status);
    try {
      const response = await API.graphql(
        graphqlOperation(updateRoute, {
          input: {
            id: currentRouteData.id,
            status: status,
            //departTime: 10,
          },
        })
      );

      //console.log("Route updated successfully", response);
    } catch (error) {
      console.error("Error updating route", error);
    }
  };

  const updateLocation = async () => {
    //console.log("driver location", busLocation);
    try {
      const response = await API.graphql(
        graphqlOperation(updateRoute, {
          input: {
            id: currentRouteData.id,
            lat: busLocation.latitude,
            lng: busLocation.longitude,
            //departTime: 10,
          },
        })
      );

      //console.log("Route updated successfully", response);
    } catch (error) {
      console.error("Error updating route", error);
    }
  };

  useEffect(() => {
    if (currentRouteData) {
      updateLocation();
    }
  }, [busLocation]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (!status === "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: 6 });
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
        distanceInterval: 5,
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

  useEffect(() => {
    if (
      !busLocation ||
      !addressList ||
      currentWaypointIndex >= addressList.length
    ) {
      return;
    }

    const origin =
      currentWaypointIndex === 0
        ? busLocation
        : {
            latitude: addressList[currentWaypointIndex - 1].latitude,
            longitude: addressList[currentWaypointIndex - 1].longitude,
          };
    setOrigin(origin);

    const destination = {
      latitude: addressList[currentWaypointIndex].latitude,
      longitude: addressList[currentWaypointIndex].longitude,
    };

    setDestination(destination);

    if (!origin || !destination) {
      console.error("Origin or destination is undefined.");
      return;
    }

    const nextWaypoints =
      currentWaypointIndex < addressList.length - 1
        ? [
            {
              latitude: addressList[currentWaypointIndex + 1].latitude,
              longitude: addressList[currentWaypointIndex + 1].longitude,
            },
          ]
        : [];

    setNextWaypoints(nextWaypoints);
  }, [addressList, currentWaypointIndex, busLocation]);

  if (!busLocation || !currentRouteData) {
    return <ActivityIndicator style={{ padding: 50 }} size={"large"} />;
  }

  if (addressList === null || origin === null || destination === null) {
    return <ActivityIndicator style={{ padding: 50 }} size={"large"} />;
  }

  // console.log("origin", origin);
  // console.log("destination", destination);
  // console.log("next waypoint", nextWaypoints);
  return (
    <SafeAreaView style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        provider={MapView.PROVIDER_GOOGLE}
        style={{ width, height }}
        // showsUserLocation={true}
        //followsUserLocation={true}
        initialRegion={{
          latitude: busLocation.latitude,
          longitude: busLocation.longitude,
          latitudeDelta: 0.07,
          longitudeDelta: 0.07,
        }}
      >
        {origin && destination && (
          <MapViewDirections
            //key={index}
            origin={{ latitude: origin.latitude, longitude: origin.longitude }}
            destination={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            mode={"DRIVING"}
            //waypoints={nextWaypoints}
            // waypoints={
            //   index < addressList.length - 1 ? [addressList[index + 1]] : []
            // }
            precision="high"
            strokeWidth={5}
            strokeColor="blue"
            apikey={GOOGLE_MAPS_APIKEY}
            onReady={(result) => {
              //console.log(result);
              const isClose = result.duration <= 5;
              if (isClose && !notificationSent) {
                sendNotification("driver is close 5 minutes away");
                setIsDriverClose(true);
                setNotificationSent(true);
              }
              setTotalMinutes(result.duration);
              setTotalKm(result.distance);

              if (result.distance <= 1) {
                handleNextWaypoint();
              }
            }}
          />
        )}
        <Marker
          coordinate={{
            latitude: busLocation.latitude,
            longitude: busLocation.longitude,
          }}
          title={"Gracie Barra Bus"}
          description={`${currentRouteData.Van.name} - ${currentRouteData.Van.model}`}
        >
          <View style={{ padding: 5 }}>
            <FontAwesome name="bus" size={30} color="green" />
          </View>
        </Marker>
        {addressList.map((waypoint, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: waypoint.latitude,
              longitude: waypoint.longitude,
            }}
            title={`${waypoint.Kid.name} House's`}
            description={`${waypoint.Kid.dropOffAddress}`}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 3,
                borderRadius: 10,
                borderColor: "black",
                borderWidth: 1, // Add border width
              }}
            >
              <Text style={{ color: "black" }}>{index + 1}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      <RouteInfoComponent
        vans={currentRouteData.Van}
        addressList={addressList}
        driver={driver}
        helper={helper}
      />

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
        <Text style={{ textAlign: "center", padding: 5, marginBottom: 5 }}>
          Kids on the Route
        </Text>

        <View
          style={{
            flex: 1,
            color: "red",
          }}
        >
          <BottomSheetFlatList
            data={currentRouteData.Kid} //data={van.kidsInRoute}
            renderItem={renderItem}
            keyExtractor={(item) => item.name.toString()}
            contentContainerStyle={{ backgroundColor: "white" }}
            //ListFooterComponent={() => <View></View>}
          />

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
            onPress={async () => {
              // schedulePushNotification(
              //   "Drop-off starting",
              //   "Dear parents, The children are leaving for drop off. Remember that we care about the maximum safety of the children, so there may be delays in the estimated time depending on traffic. Thank you"
              // );
              console.log("expo token ", expoPushToken.data);
              await sendPushNotification(
                "ExponentPushToken[sj2WvlIU0ORVR6B5lDvKXD]",
                "drop off start",
                "dear parents"
              );
              //updateRouteStatus("IN_PROGRESS");
              zoomInOnDriver();
              //console.warn("Initialing the Route");
              // send push notification to user app

              // sendNotification(
              //   "Drop-off starting",
              //   "Dear parents, The children are leaving for drop off. Remember that we care about the maximum safety of the children, so there may be delays in the estimated time depending on traffic. Thank you"
              // );
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
