import { useRef, useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Linking,
  Pressable,
  Modal,
} from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Appbar, Menu } from "react-native-paper";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
//import vans from "../../../assets/data/vans.json";
import styles from "./styles";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
//import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { useAuthContext } from "../../contexts/AuthContext";
import { Auth, Predicates } from "aws-amplify";
import { API, graphqlOperation } from "aws-amplify";
import {
  listRoutes,
  kidsByRouteID,
  getVan,
  getUser,
} from "../../graphql/queries";
import { onUpdateRoute } from "../../graphql/subscriptions";

// const van = vans[0];
// const gbLocation = {
//   latitude: 49.263527201707745,
//   longitude: -123.10070015042552,
// }; // gb location (we can import from the database in future)

const HomeScreen = () => {
  const { kids, dbUser, currentUserData } = useAuthContext();
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropOffLatLng, setDropLatLng] = useState(null);
  const [dropOffAddress, setDropOffAddress] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const [busLocation, setBusLocation] = useState(null);
  const [routesData, setRoutesData] = useState(null);
  const [currentRouteData, setCurrentRouteData] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [matchingKids, setMatchingKids] = useState(null);
  const [driver, setDriver] = useState(null);
  const [helper, setHelper] = useState(null);

  const snapPoints = useMemo(() => ["12%", "95%"], []);
  const navigation = useNavigation();

  const getRoutesData = async () => {
    try {
      const variables = {
        filter: {
          status: { eq: "IN_PROGRESS" },
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

  const checkKidsInRoutes = () => {
    if (kids && routesData) {
      // Find the first route that has at least one kid from the context
      const routeWithMatchingKids = routesData.find((item) => {
        if (item.Kid && Array.isArray(item.Kid)) {
          return item.Kid.some((routeKid) =>
            kids.some((contextKid) => routeKid.id === contextKid.id)
          );
        }
        return false;
      });

      if (routeWithMatchingKids) {
        //console.log("RoutewihmatchinKids", routeWithMatchingKids);
        // Update the state variable with the route that has matching kids
        setCurrentRouteData(routeWithMatchingKids);
        //
        const matchingKidsArray = kids.filter((contextKid) =>
          routeWithMatchingKids.Kid.some(
            (routeKid) => routeKid.id === contextKid.id
          )
        );
        if (matchingKidsArray.length > 0) {
          // Update the state variable with matching kids
          setMatchingKids(matchingKidsArray);

          // Loop through matching kids and extract dropOffAddress and dropOffLatLng
          matchingKidsArray.forEach((matchingKid) => {
            const { dropOffAddress, lat, lng } = matchingKid;
            // Do something with dropOffAddress and dropOffLatLng
            setDropLatLng({ latitude: lat, longitude: lng });
            setDropOffAddress(dropOffAddress);
          });
        }
        return true;
      }
      return false;
    }
    return false;
  };

  useEffect(() => {
    // Fetch initial data when the component mounts

    const fetchInitialData = async () => {
      await getRoutesData();
    };
    fetchInitialData();
  }, [kids]);

  useEffect(() => {
    if (routesData) {
      // Check kids in routes after fetching initial data
      if (!checkKidsInRoutes()) {
        setShowMessage(true);
        handleLogout();
      }
    }
  }, [routesData, kids]);

  const getStaffData = async () => {
    const responseGetDriver = await API.graphql({
      query: getUser,
      variables: { id: currentRouteData.driver },
    });
    const driverData = responseGetDriver.data.getUser;
    //
    const responseGetHelper = await API.graphql({
      query: getUser,
      variables: { id: currentRouteData.helper },
    });
    const helperData = responseGetHelper.data.getUser;
    // console.log("driver Data", driverData);
    // console.log("helper Data", helperData);
    setDriver(driverData);
    setHelper(helperData);
  };

  useEffect(() => {
    if (!currentRouteData) {
      return;
    }
    getStaffData();
  }, [currentRouteData]);

  useEffect(() => {
    // Update the bus location state when currentRouteData changes
    //console.log("current Route data", currentRouteData);
    //console.log(driver);
    if (currentRouteData) {
      const initialBusLocation = {
        latitude: currentRouteData.lat,
        longitude: currentRouteData.lng,
      };
      setBusLocation(initialBusLocation);
    }
  }, [currentRouteData]);

  useEffect(() => {
    if (!busLocation) {
      return;
    }
    const sub = API.graphql(graphqlOperation(onUpdateRoute)).subscribe({
      next: ({ value }) => {
        //console.log(value);
        const newBusLocation = {
          latitude: value.data.onUpdateRoute.lat,
          longitude: value.data.onUpdateRoute.lng,
        };
        if (
          newBusLocation.latitude !== busLocation.lat ||
          newBusLocation.longitude !== busLocation.lng
        ) {
          // Update your state or take any necessary action
          setBusLocation(newBusLocation);
        }
      },
      error: (error) => {
        console.error("Subscription Error:", error);
      },
    });

    return () => {
      // Cleanup subscription on component unmount
      sub.unsubscribe();
    };
  }, [busLocation]);

  const handleLogout = async () => {
    try {
      // Sign out the user using Amplify Auth
      await Auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleGoBack = () => {
    // Navigate back to the login screen
    navigation.goBack();
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  //console.log(driver);
  if (!busLocation || !dropOffLatLng) {
    return <ActivityIndicator style={{ padding: 50 }} size={"large"} />;
  }

  return (
    <View style={styles.mapContainer}>
      {showMessage && (
        <View>
          <Text>Your kids are not on any of your routes for the day!</Text>
        </View>
      )}

      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={openMenu} />
        {/* <Appbar.Content title="Parent Home Screen" /> */}
      </Appbar.Header>

      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={<Appbar.Action icon="menu" onPress={openMenu} />}
      >
        <Menu.Item onPress={handleLogout} title="Logout" />
        {/* <Menu.Item onPress={handleGoBack} title="Go Back to Login" /> */}
      </Menu>
      <MapView
        ref={mapRef}
        provider={MapView.PROVIDER_GOOGLE}
        style={{ width, height }}
        showsUserLocation={true}
        //followsUserLocation={true}
        initialRegion={{
          latitude: busLocation?.latitude,
          longitude: busLocation?.longitude,
          latitudeDelta: 0.007,
          longitudeDelta: 0.007,
        }}
      >
        <MapViewDirections
          origin={busLocation} // Start from the first waypoint
          destination={dropOffLatLng} //{van.waypoints[van.waypoints.length - 1]} // End at the last waypoint
          strokeWidth={1}
          strokeColor="rgba(0, 0, 0, 0)"
          apikey={GOOGLE_MAPS_APIKEY}
          onReady={(result) => {
            // Handle the route information here
            //setIsDriverClose(result.distance <= 0.1);
            setTotalMinutes(result.duration);
            setTotalKm(result.distance);
          }}
        />
        <Marker
          coordinate={{
            latitude: busLocation?.latitude,
            longitude: busLocation?.longitude,
          }}
          title={"Gracie Barra Bus"}
          description={currentRouteData?.Van?.name}
        >
          <View style={{ padding: 5 }}>
            <FontAwesome name="bus" size={30} color="green" />
          </View>
        </Marker>
        <Marker
          coordinate={{
            latitude: dropOffLatLng?.latitude,
            longitude: dropOffLatLng?.longitude, //van.waypoints[address].longitude
          }}
          title={matchingKids.map((kid) => `${kid.name} House's`).join(" - ")}
          // title={`${kids.map((kid) => `${kid.name}`).join(" - ")} House's`} //{kids[0].name} //van.kidsInRoute[address].first_name + " " +van.kidsInRoute[address].last_name + "  House's"}
          description={dropOffAddress}
        >
          <View style={{ padding: 5 }}>
            <FontAwesome5 name="home" size={30} color="red" />
          </View>
        </Marker>
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.handleIndicator}
        //topInset={100}
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
        <View style={{ padding: 5, marginBottom: 1, flex: 1 }}>
          <Text style={{ textAlign: "center" }}>
            Kids on the Route ({currentRouteData?.Van?.name} -{" "}
            {currentRouteData?.Van?.model})
          </Text>
          <View style={{ flex: 1, color: "red" }}>
            <BottomSheetFlatList
              data={currentRouteData.Kid}
              renderItem={({ item }) => (
                <View>
                  <View
                    style={{
                      backgroundColor: "white",
                      padding: 10,
                    }}
                  >
                    <Text style={{ fontSize: 20 }}> {item.name}</Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{
                paddingBottom: 20,
                backgroundColor: "white",
              }}
              ListFooterComponent={() => (
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      //alignItems: "center",
                      //textAlign: "center",
                      //justifyContent: "space-between",
                      marginLeft: 20,
                      position: "absolute",
                    }}
                  >
                    <Text style={{ marginRight: 20 }}>
                      Driver: {driver?.name}
                    </Text>
                    <Text>Helper: {helper?.name} </Text>
                  </View>
                  <View style={styles.container}>
                    <Pressable
                      onPress={(e) => {
                        setSelectedItem(driver);
                        //setClickPositionY(e.nativeEvent.pageY);
                      }}
                    >
                      <Image
                        source={{ uri: driver?.photo }}
                        style={styles.image}
                      />
                    </Pressable>
                    <Pressable
                      onPress={(e) => {
                        setSelectedItem(helper);
                        //setClickPositionY(e.nativeEvent.pageY);
                      }}
                    >
                      <Image
                        source={{ uri: helper?.photo }}
                        style={styles.image}
                      />
                    </Pressable>
                  </View>
                  <View style={{ alignItems: "center", marginTop: 1 }}>
                    <TouchableOpacity
                      onPress={() => {
                        const phoneNumber = "2368652297"; // Replace with the actual phone number of the helper
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
                      style={{
                        backgroundColor: "green",
                        padding: 10,
                        borderRadius: 10,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 20 }}>
                        Call Us
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            <Modal
              visible={selectedItem !== null}
              animationType="slide"
              transparent={true}
              onRequestClose={() => {
                setSelectedItem(null);
              }}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  {selectedItem && (
                    <View>
                      <Text>{selectedItem.name}</Text>
                      <Text>{selectedItem.phoneNumber}</Text>
                      <Text>{selectedItem.email}</Text>
                      <Text>{selectedItem.userType}</Text>
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
        </View>
      </BottomSheet>
    </View>
  );
};

export default HomeScreen;
