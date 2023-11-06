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
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import styles from "./styles";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useRoute, useNavigation } from "@react-navigation/native";
import RouteInfoComponent from "../../components/RouteInfo";
import { API, graphqlOperation } from "aws-amplify";
import { getUser, listAddressLists, getKid } from "../../graphql/queries";
import { updateRoute } from "../../graphql/mutations";
import { usePushNotificationsContext } from "../../contexts/PushNotificationsContext";
import * as Location from "expo-location";
import { updateLocation } from "../../components/LocationUtils";
import { useRouteContext } from "../../contexts/RouteContext";
import LocationTrackingComponent from "../../components/LocationTrackingComponent";
import { useBackgroundTaskContext } from "../../contexts/BackgroundTaskContext";

//const BACKGROUND_FETCH_TASK = "background-location-task";

//

const RouteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const id = route.params?.id;

  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const { width, height } = useWindowDimensions();
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const snapPoints = useMemo(() => ["12%", "95%"], []);
  const [helper, setHelper] = useState([]);
  const [driver, setDriver] = useState([]);
  const [busLocation, setBusLocation] = useState(null);
  const [addressList, setAddressList] = useState(null);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [nextWaypoints, setNextWaypoints] = useState(null);
  const [notificationSent, setNotificationSent] = useState(false);
  const [currentRouteData, setCurrentRouteData] = useState(null);
  // const [parent1, setParent1] = useState(null);
  // const [parent2, setParent2] = useState(null);
  // const [previousLocation, setPreviousLocation] = useState(null);

  // data from contexts
  const { schedulePushNotification, sendPushNotification, expoPushToken } =
    usePushNotificationsContext();
  //const { routesData, currentRouteData } = useRouteContext();
  const { routesData } = useRouteContext();
  const { locationEmitter } = useBackgroundTaskContext();
  //const { registerBackgroundFetchAsync } = useBackgroundTaskContext();

  const requestLocationPermissions = async () => {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === "granted") {
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === "granted") {
        // await Location.startLocationUpdatesAsync(
        //   registerBackgroundFetchAsync(),
        //   {
        //     accuracy: Location.Accuracy.Balanced,
        //   }
        // );
      }
    }
  };

  const sendNotificationToAllParents = async () => {
    if (currentRouteData?.Kid) {
      // Initialize an array to store all the tokens of parents
      const parentTokens = [];

      // Loop through each kid in currentRouteData
      for (const kid of currentRouteData.Kid) {
        if (kid.Parent1ID !== null && kid.Parent1 && kid.Parent1.pushToken) {
          const childName = kid.name;
          const parentToken = kid.Parent1.pushToken;
          const message = `Dear parent of ${childName}, your child is leaving for drop off. Remember that we care about the maximum safety of the children. Thank you`;

          parentTokens.push({ token: parentToken, message });
        }

        if (kid.Parent2ID !== null && kid.Parent2 && kid.Parent2.pushToken) {
          const childName = kid.name;
          const parentToken = kid.Parent2.pushToken;
          const message = `Dear parent of ${childName}, your child is leaving for drop off. Remember that we care about the maximum safety of the children. Thank you`;

          parentTokens.push({ token: parentToken, message });
        }
      }

      // Send notifications to all parent tokens
      for (const { token, message } of parentTokens) {
        await sendPushNotification(token, "Drop-off starting", message);
      }
    }
  };

  const sendNotificationToNextParents = async () => {
    // Check if the currentWaypointIndex is within valid bounds
    if (currentWaypointIndex < addressList.length) {
      // Get the current waypoint
      const currentWaypoint = addressList[currentWaypointIndex];

      // Check if the current waypoint has a Kid property
      if (currentWaypoint.Kid) {
        for (const currentKid of currentWaypoint.Kid) {
          // Find the corresponding kid in currentRouteData.Kid
          const matchedKid = currentRouteData.Kid.find(
            (kid) => kid.id === currentKid.id
          );

          if (matchedKid) {
            // Check if the kid has Parent1 or Parent2
            const parent1 = matchedKid.Parent1;
            const parent2 = matchedKid.Parent2;

            if (parent1 && parent1.pushToken) {
              const childName = currentKid.name;
              const parentToken = parent1.pushToken;
              const message01 = `Dear parent of ${childName}, The driver is approximately 5 minutes away from your location.`;

              //console.log(message01);
              // Send a push notification to Parent1
              await sendPushNotification(
                parentToken,
                "Current Stop Alert",
                message01
              );
            }

            if (parent2 && parent2.pushToken) {
              const childName = currentKid.name;
              const parentToken = parent2.pushToken;
              const message02 = `Dear parent of ${childName}, The driver is approximately 5 minutes away from your location.`;

              //console.log(message02);
              // Send a push notification to Parent2
              await sendPushNotification(
                parentToken,
                "Current Stop Alert",
                message02
              );
            }
          }
        }
      } else {
        // Handle the case when currentWaypoint.Kid is undefined
        console.log("No Kid found for the current waypoint");
      }
    }
  };

  const renderKidsItem = ({ item, index }) => {
    if (!currentRouteData) {
      return <ActivityIndicator size="large" color="gray" />;
    }
    //console.log("addressList", addressList);
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
      //console.log(GOOGLE_MAPS_APIKEY);
      const variables = {
        filter: {
          routeID: { eq: currentRouteData.id },
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
      const groupedAddressList = new Map();

      addressListWithKids.forEach((address) => {
        const { latitude, longitude } = address;
        const locationKey = `${latitude}_${longitude}`;
        //console.log("address", address);

        if (!groupedAddressList.has(locationKey)) {
          groupedAddressList.set(locationKey, {
            ...address,
            Kid: [],
            latitude,
            longitude,
          });
        }

        const groupedAddress = groupedAddressList.get(locationKey);
        // groupedAddress.AddressList.push(address);
        groupedAddress.Kid.push(address.Kid);
      });

      const uniqueAddressList = Array.from(groupedAddressList.values());

      setAddressList(uniqueAddressList);
    } catch (error) {
      console.error("Error fetching getOrderAddress: ", error);
    }
  };

  const handleNextWaypoint = () => {
    setCurrentWaypointIndex((prevIndex) => prevIndex + 1);
    setNotificationSent(false);
  };

  const getParentsInfo = async () => {
    if (currentRouteData?.Kid) {
      // Loop through each kid in currentRouteData
      for (const kid of currentRouteData.Kid) {
        if (kid.Parent1ID !== null) {
          const parent1Data = await API.graphql({
            query: getUser,
            variables: { id: kid.Parent1ID },
          });

          // Store the parent1Data in the kid object
          kid.Parent1 = parent1Data.data.getUser;
        }

        if (kid.Parent2ID !== null) {
          const parent2Data = await API.graphql({
            query: getUser,
            variables: { id: kid.Parent2ID },
          });

          // Store the parent2Data in the kid object
          kid.Parent2 = parent2Data.data.getUser;
        }
      }
      //console.log(currentRouteData.Kid);
    }
  };

  const getStaffInfo = async () => {
    const driverData = await API.graphql({
      query: getUser,
      variables: { id: currentRouteData.driver },
    });
    setDriver(driverData.data.getUser);
    if (currentRouteData.helper !== null) {
      const helperData = await API.graphql({
        query: getUser,
        variables: { id: currentRouteData.helper },
      });
      setHelper(helperData.data.getUser);
    }
  };

  /////
  /////   starting the useEffects ///
  /////
  useEffect(() => {
    requestLocationPermissions();
  }, []);

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

  useEffect(() => {
    if (routesData) {
      const routeWithId = routesData.find((route) => route.id === id);
      setCurrentRouteData(routeWithId);
    }
  }, [routesData, id]);

  useEffect(() => {
    if (currentRouteData) {
      //console.log("current Route Data ID", currentRouteData.id);
      getStaffInfo();
    }
    //console.log(currentRouteData);
  }, [currentRouteData]);

  useEffect(() => {
    if (currentRouteData) {
      getOrderAddress();
    }
  }, [currentRouteData]);

  useEffect(() => {
    if (currentRouteData) {
      getParentsInfo();
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

  const zoomInOnDriver = () => {
    mapRef.current.animateToRegion({
      latitude: busLocation.latitude,
      longitude: busLocation.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    });
  };

  useEffect(() => {
    //console.log(busLocation);
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
  //console.log(currentRouteData);
  if (!busLocation || !currentRouteData) {
    return <ActivityIndicator style={{ padding: 50 }} size={"large"} />;
  }

  if (addressList === null || origin === null || destination === null) {
    return <ActivityIndicator style={{ padding: 50 }} size={"large"} />;
  }

  function generateMarkerTitle(kids) {
    return kids.map((kid) => kid.name).join(" and ") + " Houses";
  }

  function generateMarkerDescription(kids) {
    return kids.map((kid) => kid.dropOffAddress).join("\n");
  }
  /// jsx return

  return (
    <SafeAreaView style={styles.mapContainer}>
      <LocationTrackingComponent
        locationEmitter={locationEmitter}
        routeID={currentRouteData.id}
      />
      <MapView
        ref={mapRef}
        //provider={PROVIDER_GOOGLE}
        style={{ width, height }}
        showsUserLocation={true}
        followsUserLocation={true}
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
            apikey={GOOGLE_MAPS_APIKEY}
            origin={{ latitude: origin.latitude, longitude: origin.longitude }}
            destination={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            mode={"DRIVING"}
            precision="high"
            strokeWidth={5}
            strokeColor="blue"
            timePrecision="now"
            onReady={(result) => {
              const isClose = result.duration <= 5;
              if (isClose && !notificationSent) {
                setNotificationSent(true);
                sendNotificationToNextParents();
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
            title={generateMarkerTitle(waypoint.Kid)}
            description={generateMarkerDescription(waypoint.Kid)}
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
            renderItem={renderKidsItem}
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
                      {selectedItem.Parent1?.name}
                    </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>Unit Number:</Text>{" "}
                      {selectedItem.Parent1?.unitNumber}
                    </Text>
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>
                        Street Address:
                      </Text>{" "}
                      {selectedItem.Parent1?.address}
                    </Text>
                    {/* <Text>
                      <Text style={{ fontWeight: "bold" }}>Comments:</Text>{" "}
                      {selectedItem.commentsAddress}
                    </Text> */}
                    <Text>
                      <Text style={{ fontWeight: "bold" }}>Phone number:</Text>{" "}
                      {selectedItem.Parent1?.phoneNumber}
                    </Text>
                    <Pressable
                      onPress={() => {
                        // Handle the action to call the parent here
                        const phoneNumber = selectedItem.Parent1?.phoneNumber;
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
              //console.log("address list object ", addressList);
              //console.log("bus location", busLocation);
              // send push notification to user app
              sendNotificationToAllParents();
              setNotificationSent(false);
              // update the route status
              updateRouteStatus("IN_PROGRESS");
              zoomInOnDriver();

              // Create an array of waypoint coordinates
              const waypoints = addressList.map((address) => {
                return `${address.latitude},${address.longitude}`;
              });

              // Separate the first address as the origin
              const origin = `${busLocation.latitude},${busLocation.longitude}`;

              // Separate the last address as the destination
              const destination = waypoints.pop();

              // Join the remaining waypoints into a single string separated by "|"
              const waypointsString = waypoints.join("|");
              // console.log(origin);
              // console.log(waypointsString);
              // console.log(destination);

              // Construct the Google Maps URL with the origin and waypoints
              const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=${origin}&destination=${destination}&waypoints=${waypointsString}`;

              // Open Google Maps with the origin and waypoints pre-set
              Linking.openURL(googleMapsUrl);
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

export default RouteScreen;
