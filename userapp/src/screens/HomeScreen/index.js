import { useRef, useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { Appbar, Menu } from "react-native-paper";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import vans from "../../../assets/data/vans.json";
import styles from "./styles";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
//import { DataStore } from 'aws-amplify';
import { useAuthContext } from "../../contexts/AuthContext";
import { Auth } from "aws-amplify";
//import { Route } from "../../models";
import { API, graphqlOperation } from "aws-amplify";
import { listRoutes, kidsByRouteID, getVan } from "../../graphql/queries";

const van = vans[0];
const gbLocation = {
  latitude: 49.263527201707745,
  longitude: -123.10070015042552,
}; // gb location (we can import from the database in future)

const HomeScreen = () => {
  const { kids, dbUser } = useAuthContext();
  const [dropOffAddress, setDropOffAddress] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
  const { width, height } = useWindowDimensions();
  //const [driverLocation, setDriverLocation] = useState(null);
  const [busLocation, setBusLocation] = useState(null);
  //const busLocation = null;
  const [routesData, setRoutesData] = useState(null);
  const [currentRouteData, setCurrentRouteData] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  //const [deliveryStatus, setDeliveryStatus] = useState(ORDER_STATUSES.READY_FOR_PICKUP)

  const [isDriverClose, setIsDriverClose] = useState(false);

  const snapPoints = useMemo(() => ["12%", "95%"], []);
  const navigation = useNavigation();
  //const routeWaypoints = van.waypoints.slice(1);

  // const getUserBySub = await API.graphql({query: listUsers, variables: { filter: {  sub: {eq: sub} } } })
  // //graphqlOperation(listUsers))
  // const response = getUserBySub.data.listUsers.items[0]

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
          //console.log(responseGetVan);
          const vansData = responseGetVan.data.getVan;

          return { ...route, Kid: kidsData, Van: vansData };
        })
      );

      //console.log('mergedData', mergedData);

      setRoutesData(mergedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // if (kids){
    getRoutesData();
    // if (currentRouteData.map( m => {

    // }))
    return () => {};
    // }
  }, [kids]);

  useEffect(() => {
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
          setCurrentRouteData([routeWithMatchingKids]);
        } else {
          // Set an empty array if no matching route is found
          //setCurrentRouteData([]);
        }
      }
    };

    checkKidsInRoutes();
    console.log("currentRoute ", currentRouteData);
    console.log("all routes", routesData);

    return () => {
      // Cleanup code if needed
    };
  }, [kids, routesData]);

  useEffect(() => {
    if (!currentRouteData) {
      return;
    }
    //console.log(currentRouteData);
    setBusLocation({
      latitude: currentRouteData.lat,
      longitude: currentRouteData.lng,
    });
    //console.log(busLocation);

    return () => {};
  }, []);

  useEffect(() => {
    //console.log(busLocation)
    // if (!busLocation) {
    //   return;
    // }
    // const subscription = DataStore.observe(Route).subscribe(msg => {
    // if (msg.opType ==='UPDATE') {r
    //   setDriver(msg.element);
    // }
    // });
    // return () => subscription.unsubscribe();
  }, [busLocation]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (!status === "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: 3 });
      setBusLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();

    const foregroundSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
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
  //console.log(address)
  //console.warn(driverLocation);
  //console.log(dropOffAddress);

  useEffect(() => {
    console.log(kids);
    if (kids) {
      setDropOffAddress({ latitude: kids[0]?.lat, longitude: kids[0]?.lng });
    }
    return () => {};
  }, []);
  //   //console.log(busLocation);

  //   //console.log('driver location ',driverLocation);
  //   //console.log('dropOffAddress ',dropOffAddress);

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

  if (!busLocation || !dropOffAddress) {
    return <ActivityIndicator style={{ padding: 50 }} size={"large"} />;
  }

  return (
    <View style={styles.mapContainer}>
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

      {/* <View style={styles.infoOverlay}>
        <View style={styles.infoBoard}>
          <Text style={styles.infoText}>
            Your kids are on their way! More information below.
          </Text>
          <Text style={styles.infoText}>
            Our routes are pre-made for safety and speed, and we prioritize
            your child's security.
          </Text>
       </View>
      </View> */}
      <MapView
        ref={mapRef}
        provider={MapView.PROVIDER_GOOGLE}
        style={{ width, height }}
        showsUserLocation={true}
        //followsUserLocation={true}
        initialRegion={{
          latitude: busLocation.latitude,
          longitude: busLocation.longitude,
          latitudeDelta: 0.007,
          longitudeDelta: 0.007,
        }}
      >
        {/* <MapViewDirections 
          origin={driverLocation}
          destination={van.waypoints[3]}
          
          strokeWidth={7}
          //waypoints={}
          strokeColor='black'
          apikey={GOOGLE_MAPS_APIKEY}
          onReady={(result) => {
            //if (result.distance <= 0.1 ) {
            setIsDriverClose(result.distance <= 0.1);
            setTotalMinutes(result.duration);
            setTotalKm(result.distance);
            //console.warn('Driver is Close')
            //}
          }}
        /> */}
        <MapViewDirections
          origin={busLocation} // Start from the first waypoint
          destination={dropOffAddress} //{van.waypoints[van.waypoints.length - 1]} // End at the last waypoint
          //waypoints={van.waypoints} // Exclude the start and end waypoints
          strokeWidth={7}
          strokeColor="#3fc060"
          apikey={GOOGLE_MAPS_APIKEY}
          onReady={(result) => {
            // Handle the route information here
            setIsDriverClose(result.distance <= 0.1);
            setTotalMinutes(result.duration);
            setTotalKm(result.distance);
          }}
        />

        {/* {van.waypoints.map((waypoint, index) => (
          <Marker
            key={index} // Use the index as the key, assuming each waypoint is unique
            coordinate={{
              latitude: waypoint.latitude,
              longitude: waypoint.longitude,
            }}
            title={`Waypoint ${index + 1}`} // Add a title to identify the waypoint
            description={"Driver Van"}
          >
            <View style={{ padding: 5 }}>
              <FontAwesome5 name='map-marker-alt' size={30} color='red' />
            </View>
          </Marker>
        ))} */}
        <Marker
          coordinate={{
            latitude: busLocation.latitude,
            longitude: busLocation.longitude,
          }}
          title={"Gracie Barra Van"}
          description={currentRouteData?.Van?.name}
        >
          <View style={{ padding: 5 }}>
            <FontAwesome5 name="map-marker-alt" size={30} color="red" />
          </View>
        </Marker>
        <Marker
          coordinate={{
            latitude: dropOffAddress.latitude,
            longitude: dropOffAddress.longitude, //van.waypoints[address].longitude
          }}
          title={`${kids
            .map((kid, index) => `${kid.name}`)
            .join(" - ")} House's`} //{kids[0].name} //van.kidsInRoute[address].first_name + " " +van.kidsInRoute[address].last_name + "  House's"}
          description={kids[0].dropOffAddress}
        >
          <View style={{ padding: 5 }}>
            <FontAwesome5 name="home" size={30} color="green" />
          </View>
        </Marker>
      </MapView>
      {/* {deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP && (
        <Ionicons 
          onPress={() => navigation.goBack()}
          name='arrow-back-circle'
          size={45}
          color='black'
          style={{top: 40, left: 15, position: 'absolute'}}
        />
      )} */}
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
        <View style={{ padding: 5, marginBottom: 1 }}>
          <Text>
            Kids on the Route ({van.name} - {van.model})
          </Text>
          <FlatList
            data={van.kidsInRoute}
            renderItem={({ item }) => (
              <View>
                <View style={{ backgroundColor: "white", padding: 10 }}>
                  <Text style={{ fontSize: 20 }}>
                    {" "}
                    {item.first_name} {item.last_name}
                  </Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListFooterComponent={() => (
              <View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ paddingRight: 130, paddingLeft: 30 }}>
                    Driver: Tais
                  </Text>
                  <Text>Helper: Elaine</Text>
                </View>
                <View style={styles.container}>
                  <Image
                    source={require("../../../assets/img/Tais.jpeg")}
                    style={styles.image}
                  />
                  <Image
                    source={require("../../../assets/img/Elaine.jpeg")}
                    style={styles.image}
                  />
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
        </View>
      </BottomSheet>
    </View>
  );
};

export default HomeScreen;
