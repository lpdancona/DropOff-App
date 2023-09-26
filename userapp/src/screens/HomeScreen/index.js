import { useRef, useMemo, useState, useEffect } from "react";
import { 
  View, 
  Text, 
  useWindowDimensions, 
  ActivityIndicator, 
  Image, 
  TouchableOpacity,
  Linking 
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import vans from '../../../assets/data/vans.json';
import orders from '../../../assets/data/orders.json';
import styles from './styles';
import MapView, { Marker , PROVIDER_GOOGLE} from "react-native-maps";
import * as Location from 'expo-location';
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { DataStore } from 'aws-amplify';


const van = vans[0];
// const order = orders[0];

// const ORDER_STATUSES = {
//   READY_FOR_PICKUP: "READY_FOR_PICKUP",
//   ACCEPTED: "ACCEPTED",
//   PICKED_UP: "PICKED_UP",
// }

const gbLocation = {latitude: 49.263527201707745, longitude: -123.10070015042552}; // gb location (we can import from the database in future)



//const deliveryLocation = {latitude: order.User.lat, longitude: order.User.lng}


const HomeScreen = ({route}) => {
  
  
  const { address } = {address: 1} // van.waypoint[0] // '' //route.params;
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);

  const {width, height} = useWindowDimensions();
  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  //const [deliveryStatus, setDeliveryStatus] = useState(ORDER_STATUSES.READY_FOR_PICKUP)
  
  const [isDriverClose, setIsDriverClose] = useState(false);

  const snapPoints = useMemo(() => ["12%", "95%"],[])
  const navigation = useNavigation();
  //const routeWaypoints = van.waypoints.slice(1);


  useEffect (() => {

  },[])

  useEffect (() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (!status === 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({accuracy: 3 });
      setDriverLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    })();

    const foregroundSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 100
      }, (updatedLocation) => {
        setDriverLocation({
          latitude: updatedLocation.coords.latitude,
          longitude: updatedLocation.coords.longitude
        })
      }
    )
    return () => foregroundSubscription;
  }, []);
  
  //console.warn(driverLocation);
  if (!driverLocation) {
    return <ActivityIndicator style={{padding: 50}} size={'large'}/>
  }
  
  return (
    <View style={styles.mapContainer}>
      <View style={styles.infoOverlay}>
        <Text style={styles.infoText}>
          Your kids are on their way! More information below.
        </Text>
        <Text style={styles.infoText}>
          Our routes are pre-made for safety and speed, and we prioritize
          your child's security.
        </Text>
      </View>
      <MapView 
        ref={mapRef}
        provider={MapView.PROVIDER_GOOGLE}
        style={{width, height}}
        //showsUserLocation={true} 
        //followsUserLocation={true}
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.007,
          longitudeDelta: 0.007
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
          origin={driverLocation} // Start from the first waypoint
          destination={van.waypoints[address]} //{van.waypoints[van.waypoints.length - 1]} // End at the last waypoint
          //waypoints={van.waypoints} // Exclude the start and end waypoints
          strokeWidth={7}
          strokeColor='black'
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
            latitude: driverLocation.latitude, 
            longitude: driverLocation.longitude
          }}
          title={"Gracie Barra Van"}
          description={van.name}
        >
          <View style={{padding: 5}}>
            <FontAwesome5 name='map-marker-alt' size={30} color='red' />
          </View>
        </Marker>
        <Marker
          coordinate={{
            latitude: van.waypoints[address].latitude, 
            longitude: van.waypoints[address].longitude
          }}
          title={van.kidsInRoute[address].first_name + " " +van.kidsInRoute[address].last_name + "  House's"} 
          //description={}
        >
           <View style={{padding: 5}}>
            <FontAwesome5 name='home' size={30} color='green' />
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
      >
        <View style = {styles.handleIndicatorContainer}>
          <Text style={styles.routeDetailsText}> ETA - {totalMinutes.toFixed(0)} min</Text>
            <FontAwesome5
              name="bus"
              size={30}
              color="#3fc060"
              style={{marginHorizontal: 10}}
            />
          <Text style={styles.routeDetailsText}>{totalKm.toFixed(2)} Km</Text>
          </View>
          <View style={{padding:5, marginBottom: 1}} >
            <Text>Kids on the Route ({van.name} - {van.model})</Text>
       <FlatList
          data={van.kidsInRoute} 
          renderItem={({ item }) => (
            <View>
              <View style={{ backgroundColor: 'white', padding: 10 }}>
                <Text style={{ fontSize: 20 }}> {item.first_name} {item.last_name}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()} 
          contentContainerStyle={{ paddingBottom: 20 }} 
          ListFooterComponent={() => (
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ paddingRight: 130, paddingLeft: 30 }}>Driver: Tais</Text>
                <Text>Helper: Elaine</Text>
              </View>
              <View style={styles.container}>
                <Image source={require('../../../assets/img/Tais.jpeg')} style={styles.image} />
                <Image source={require('../../../assets/img/Elaine.jpeg')} style={styles.image} />
              </View>
              <View style={{ alignItems: 'center', marginTop: 1 }}>
                <TouchableOpacity
                  onPress={() => {
                    const phoneNumber = '2368652297'; // Replace with the actual phone number of the helper
                    const phoneNumberWithPrefix = `tel:${phoneNumber}`;

                    Linking.canOpenURL(phoneNumberWithPrefix)
                      .then((supported) => {
                        if (!supported) {
                          console.error('Phone number not supported');
                        } else {
                          return Linking.openURL(phoneNumberWithPrefix);
                        }
                      })
                      .catch((error) => console.error(error));
                  }}
                  style={{ backgroundColor: 'green', padding: 10, borderRadius: 10 }}
                >
                  <Text style={{ color: 'white', fontSize: 20 }}>Call Us</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
           
        </View>
      </BottomSheet>
    </View>
  );
}

export default HomeScreen;