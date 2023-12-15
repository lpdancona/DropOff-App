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
  SafeAreaView,
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
import gbIcon from "../../docs/gb-logo.svg";
import houseIcon from "../../docs/icon-house.png";
import vanIcon from "../../docs/van.png";

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
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const snapPoints = useMemo(() => ["12%", "95%"], []);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true); // Add a new state variable for loading
  const [noKidsAvailable, setNoKidsAvailable] = useState(false);

  const LoadingScreen = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
      <Text>Loading...</Text>
    </View>
  );

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
        // alert(
        //   "Hi there, there is no route in progress now! come back later or contact us for more information!"
        // );
        await navigation.navigate("Wait");
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
    setNoKidsAvailable(true);
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
    } finally {
      setDropdownVisible(false);
      setLogoutModalVisible(false);
    }
  };
  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
    setLogoutModalVisible(false);
  };
  const toggleLogoutModal = () => {
    setLogoutModalVisible(!isLogoutModalVisible);
    setDropdownVisible(false);
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
        setIsLoading(false); // Set loading to false after data is fetched
      };
      fetchInitialData();
    }
  }, [kids]);

  useEffect(() => {
    if (routesData) {
      // Check kids in routes after fetching initial data
      if (!checkKidsInRoutes()) {
        setIsLoading(false);
        setNoKidsAvailable(true);
        // alert(
        //   `We sorry but, your child ${kids[0].name} is not on any route today!`
        // );
        navigation.navigate("Wait");
        // handleLogout();
      }
    }
  }, [routesData, kids]);

  const getStaffData = async () => {
    if (currentRouteData.driver) {
      const responseGetDriver = await API.graphql({
        query: getUser,
        variables: { id: currentRouteData.driver },
      });
      const driverData = responseGetDriver.data.getUser;
      setDriver(driverData);
    }
    if (currentRouteData.helper) {
      //
      const responseGetHelper = await API.graphql({
        query: getUser,
        variables: { id: currentRouteData.helper },
      });
      const helperData = responseGetHelper.data.getUser;
      setHelper(helperData);
    }
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
  if (isLoading) {
    // Render the loading screen while data is being fetched
    return <LoadingScreen />;
  }
  if (noKidsAvailable) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No kids available for today.</Text>
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <View style={styles.containerMenu}>
        <View style={styles.logoutMenu}>
          <Pressable onPress={toggleDropdown}>
            <MaterialIcons name="menu" size={30} color="white" />
          </Pressable>
        </View>

        {isDropdownVisible && (
          <View style={styles.modalContainer}>
            <Pressable onPress={handleLogout}>
              <MaterialIcons name="logout" size={30} color="white" />
            </Pressable>
          </View>
        )}
      </View>
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
          icon={vanIcon}
        >
          <View style={{ padding: 5 }}>
            <Image source={vanIcon} style={{ width: 40, height: 40 }} />
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
            <Image source={houseIcon} style={{ width: 40, height: 40 }} />
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
          <Image source={vanIcon} style={{ width: 40, height: 40 }} />
          <Text style={styles.routeDetailsText}>{totalKm.toFixed(2)} Km</Text>
        </View>
        <View style={{ padding: 5, marginBottom: 1, flex: 1 }}>
          <Text style={{ textAlign: "center", fontSize: 15 }}>
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
                    <Text style={{ fontSize: 20, textAlign: "center" }}>
                      {" "}
                      {item.name}
                    </Text>
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
                  <View style={styles.container}>
                    <Pressable
                      onPress={(e) => {
                        setSelectedItem(driver);
                      }}
                    >
                      <View style={styles.driverContainer}>
                        <View style={styles.profile}>
                          <Image
                            source={{ uri: driver?.photo }}
                            resizeMethod="scale"
                            resizeMode="contain"
                            style={styles.profileAvatar}
                          />
                          <View style={styles.profileBody}>
                            <Text style={styles.profileName}>
                              {driver?.name}
                            </Text>

                            <Text style={styles.profileHandle}>Driver</Text>
                          </View>
                        </View>
                      </View>
                      {helper && (
                        <View style={styles.driverContainer}>
                          <View style={styles.profile}>
                            <Image
                              source={{ uri: helper?.photo }}
                              resizeMethod="scale"
                              resizeMode="contain"
                              style={styles.profileAvatar}
                            />
                            <View style={styles.profileBody}>
                              <Text style={styles.profileName}>
                                {helper?.name}
                              </Text>

                              <Text style={styles.profileHandle}>Helper</Text>
                            </View>
                          </View>
                        </View>
                      )}
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
                        backgroundColor: "#FF7276",
                        padding: 10,
                        borderRadius: 10,
                      }}
                    >
                      <View style={styles.callBtn}>
                        <Text style={{ color: "white", fontSize: 20 }}>
                          Call Us{" "}
                        </Text>
                        <MaterialIcons name="call" size={24} color="white" />
                      </View>
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
              <SafeAreaView style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    {selectedItem && (
                      <View>
                        <Image
                          source={
                            driver?.photo
                              ? { uri: driver.photo }
                              : { uri: "https://i.imgur.com/5gc6290.jpg" }
                          }
                          style={styles.profileAvatar}
                        />
                        <Text style={styles.profileName}>
                          {selectedItem.name}
                        </Text>
                        <Text>{selectedItem.userType}</Text>
                        <Text style={styles.staffNumber}>
                          {selectedItem.phoneNumber}
                        </Text>
                        <Text style={styles.profileEmail}>
                          {selectedItem.email}
                        </Text>
                        {helper && (
                          <View style={styles.helperDsc}>
                            <Image
                              source={
                                helper?.photo
                                  ? { uri: helper.photo }
                                  : { uri: "https://i.imgur.com/5gc6290.jpg" }
                              }
                              style={styles.profileAvatar}
                            />
                            <Text style={styles.profileName}>
                              {helper.name}
                            </Text>
                            <Text>{helper.userType}</Text>
                            <Text style={styles.staffNumber}>
                              {helper.phoneNumber}
                            </Text>
                            <Text style={styles.profileEmail}>
                              {helper.email}
                            </Text>
                          </View>
                        )}
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
              </SafeAreaView>
            </Modal>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default HomeScreen;
