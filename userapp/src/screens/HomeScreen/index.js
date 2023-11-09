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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import styles from "./styles";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useNavigation } from "@react-navigation/native";
import { useAuthContext } from "../../contexts/AuthContext";
import { Auth } from "aws-amplify";
import { API, graphqlOperation } from "aws-amplify";
import {
  listRoutes,
  kidsByRouteID,
  getVan,
  getUser,
} from "../../graphql/queries";
import { onUpdateRoute } from "../../graphql/subscriptions";

const HomeScreen = () => {
  const { kids, dbUser, currentUserData, userEmail } = useAuthContext();
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
  const [matchingKids, setMatchingKids] = useState(null);
  const [driver, setDriver] = useState(null);
  const [helper, setHelper] = useState(null);
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [strokeColor, setStrokeColor] = useState("rgba(0, 0, 0, 0)");

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
      if (routeData.length === 0) {
        alert(
          "Hi there, there is no route in progress now! come back later or contact us for more information!"
        );
        await handleLogout();
      }

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

  const currentDateTime = new Date(); // Get the current date and time
  currentDateTime.setMinutes(currentDateTime.getMinutes() + totalMinutes); // Add the totalMinutes to the current time

  const timeArrival = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const zoomInOnDriver = () => {
    mapRef.current.animateToRegion({
      latitude: busLocation.latitude,
      longitude: busLocation.longitude,
      latitudeDelta: 0.0007,
      longitudeDelta: 0.0007,
    });
  };
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
  ///
  /// Start UseEffect
  ///
  useEffect(() => {
    // Fetch initial data when the component mounts
    if (dbUser && userEmail) {
      const fetchInitialData = async () => {
        await getRoutesData();
      };
      fetchInitialData();
    }
  }, [kids]);

  useEffect(() => {
    if (routesData) {
      // Check kids in routes after fetching initial data
      if (!checkKidsInRoutes()) {
        alert(
          `We sorry but, your child ${kids[0].name} is not on any route today!`
        );
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
        const newBusLocation = {
          latitude: value.data.onUpdateRoute.lat,
          longitude: value.data.onUpdateRoute.lng,
        };
        if (
          newBusLocation.latitude !== busLocation.lat ||
          newBusLocation.longitude !== busLocation.lng
        ) {
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

  if (!busLocation || !dropOffLatLng) {
    return <ActivityIndicator style={{ padding: 50 }} size={"large"} />;
  }

  return (
    <View style={styles.mapContainer}>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action
            icon="menu"
            onPress={openMenu}
            style={{ marginTop: 30 }}
          />
        }
      >
        <Menu.Item onPress={handleLogout} title="Logout" />
        {/* <Menu.Item onPress={handleGoBack} title="Go Back to Login" /> */}
      </Menu>

      <MapView
        ref={mapRef}
        //provider={MapView.PROVIDER_GOOGLE}
        style={{ width, height }}
        //showsUserLocation={true}
        //followsUserLocation={true}
        initialRegion={{
          latitude: busLocation?.latitude,
          longitude: busLocation?.longitude,
          latitudeDelta: 0.007,
          longitudeDelta: 0.007,
        }}
      >
        <TouchableOpacity style={styles.zoomButton} onPress={zoomInOnDriver}>
          <MaterialIcons name="place" size={24} color="white" />
        </TouchableOpacity>
        <MapViewDirections
          apikey={GOOGLE_MAPS_APIKEY}
          origin={busLocation} // Start from the first waypoint
          destination={dropOffLatLng} //{van.waypoints[van.waypoints.length - 1]} // End at the last waypoint
          mode={"DRIVING"}
          precision="high"
          timePrecision="now"
          strokeWidth={strokeWidth}
          strokeColor={strokeColor}
          onReady={(result) => {
            const isClose = result.distance <= 2;
            if (isClose) {
              setStrokeWidth(5);
              setStrokeColor("blue");
            } else {
              setStrokeWidth(1);
              setStrokeColor("rgba(0, 0, 0, 0)");
            }
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
            ETA {timeArrival} - {totalMinutes.toFixed(0)} min
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
                      }}
                    >
                      <Image
                        source={{ uri: driver?.photo }}
                        resizeMethod="scale"
                        resizeMode="contain"
                        style={styles.imageDriver}
                      />
                    </Pressable>
                    <Pressable
                      onPress={(e) => {
                        setSelectedItem(helper);
                      }}
                    >
                      <Image
                        //source={{ uri: helper?.photo }}
                        source={
                          helper?.photo
                            ? { uri: helper.photo }
                            : { uri: "https://i.imgur.com/5gc6290.jpg" }
                        }
                        style={styles.imageHelper}
                        resizeMethod="scale"
                        resizeMode="contain"
                      />
                    </Pressable>
                  </View>
                  <View style={{ alignItems: "center", marginTop: 1 }}>
                    <TouchableOpacity
                      onPress={() => {
                        const phoneNumber = "2368652297";
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
