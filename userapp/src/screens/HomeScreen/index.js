import { useRef, useMemo, useState, useEffect } from "react";
import { View, Text, useWindowDimensions, ActivityIndicator, Pressable, Button, TextInput } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { FontAwesome5, Fontisto, Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
import vans from '../../../assets/data/vans.json';
import orders from '../../../assets/data/orders.json';
import styles from './styles';
import MapView, { Marker , PROVIDER_GOOGLE} from "react-native-maps";
import * as Location from 'expo-location';
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";

const van = vans[0];
const order = orders[0];

const ORDER_STATUSES = {
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  ACCEPTED: "ACCEPTED",
  PICKED_UP: "PICKED_UP",
}

const gbLocation = {latitude: 49.263527201707745, longitude: -123.10070015042552}; // gb location (we can import from the database in future)



//const deliveryLocation = {latitude: order.User.lat, longitude: order.User.lng}


const HomeScreen = () => {
  
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);

  const {width, height} = useWindowDimensions();
  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [deliveryStatus, setDeliveryStatus] = useState(ORDER_STATUSES.READY_FOR_PICKUP)
  
  const [isDriverClose, setIsDriverClose] = useState(false);

  const snapPoints = useMemo(() => ["12%", "95%"],[])
  const navigation = useNavigation();
  //const routeWaypoints = van.waypoints.slice(1);



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
    <View style={styles.container}>
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
          destination={van.waypoints[3]} //{van.waypoints[van.waypoints.length - 1]} // End at the last waypoint
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
          title={"Driver"}
          description={"Driver Van"}
        >
          <View style={{padding: 5}}>
            <FontAwesome5 name='map-marker-alt' size={30} color='red' />
          </View>
        </Marker>
        <Marker
          coordinate={{
            latitude: van.waypoints[3].latitude, 
            longitude: van.waypoints[3].longitude
          }}
          title={order.User.name}
          description={order.User.address}
        >
           <View style={{padding: 5}}>
            <FontAwesome5 name='map-marker-alt' size={30} color='green' />
          </View>
        </Marker>
      </MapView>
      {deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP && (
        <Ionicons 
          onPress={() => navigation.goBack()}
          name='arrow-back-circle'
          size={45}
          color='black'
          style={{top: 40, left: 15, position: 'absolute'}}
        />
      )}
     
      <BottomSheet 
        ref={bottomSheetRef} 
        snapPoints={snapPoints} 
        handleIndicatorStyle={styles.handleIndicator}
      >
        <View style = {styles.handleIndicatorContainer}>
          <Text style={styles.routeDetailsText}>{totalMinutes.toFixed(0)} min</Text>
            <FontAwesome5
              name="shopping-bag"
              size={30}
              color="#3fc060"
              style={{marginHorizontal: 10}}
            />
          <Text style={styles.routeDetailsText}>{totalKm.toFixed(2)} Km</Text>
          </View>
          <View style={styles.deliveryDetailsContainer}>
            <FlatList
              data={van.kidsInRoute}
              renderItem={({ item }) => <Text>{item}</Text>} // Render each string directly
              keyExtractor={(item, index) => index.toString()} // Use the index as the key
            />
            {/* <View style={styles.addressContainer}> 
              <Fontisto 
                name='shopping-store' 
                size={22} 
                color='grey'
              />
              <Text 
                style={styles.addressText}>
                {order.Restaurant.address}
              </Text>
            </View>
            <View style={styles.addressContainer}> 
              <FontAwesome5
                name="map-marker-alt"
                size={30}
                color='grey'
              />
              <Text 
                style={styles.addressText}>
                {order.User.address}
              </Text>
           </View>
            <View style={styles.orderDetailsContainer}>
              <Text style={styles.orderItemText}>Onion Rings x1</Text>
              <Text style={styles.orderItemText}>Big Mac x3</Text>
              <Text style={styles.orderItemText}>Big Tasty x2</Text>
              <Text style={styles.orderItemText}>Coca-Cola x1</Text>
            </View> */}
          </View>
      </BottomSheet>
      
    </View>
  );
}

export default HomeScreen;