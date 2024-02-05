import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  FlatList,
} from "react-native";
import Swiper from "react-native-swiper";
import { API, graphqlOperation } from "aws-amplify";
import { listEvents } from "../../graphql/queries";
import styles from "./styles";
import SideDrawer from "../SideDrawer/SideDrawer";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import panelImage from "../../../assets/slimeParty.png";
import { useAuthContext } from "../../contexts/AuthContext";
import { format, getDay } from "date-fns";
const LoadingScreen = () => {
  const [events, setEvents] = useState([]);
  const [isSideDrawerVisible, setSideDrawerVisible] = useState(false);
  const { dbUser } = useAuthContext();
  const { kids } = useAuthContext();
  console.log(kids);
  console.log(dbUser);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.graphql(
          graphqlOperation(listEvents, {
            limit: 10,
          })
        );

        setEvents(response.data.listEvents.items);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);
  const handleLogout = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setSideDrawerVisible(false);
    }
  };
  const handleEventPress = (link) => {
    if (link) {
      const urlWithoutParams = link.split("?")[0];

      Linking.openURL(urlWithoutParams)
        .then((result) => {
          console.log("Link opened successfully:", result);
        })
        .catch((error) => {
          console.error("Error opening link:", error);
        });
    }
  };

  const renderEvent = (item) => {
    console.log("Event Image URL:", item.image);

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleEventPress(item.link)}
      >
        <View style={styles.eventContainer}>
          <Image source={panelImage} style={styles.eventImage} />
          <View style={styles.eventDetails}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const toggleSideDrawer = () => {
    setSideDrawerVisible(!isSideDrawerVisible);
  };
  const today = new Date();
  const dayOfWeekNumber = getDay(today) + 1;
  const formattedDate = format(today, "EEEE, MMMM d");
  const getInitials = (name) => {
    const nameArray = name.split(" ");
    return nameArray
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerMenu}>
        <TouchableOpacity onPress={toggleSideDrawer}>
          <MaterialIcons name="menu" size={30} color="white" />
        </TouchableOpacity>

        <SideDrawer
          isVisible={isSideDrawerVisible}
          onClose={toggleSideDrawer}
          onLogout={handleLogout}
        />
      </View>
      <View style={styles.welcomeContainer}>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.welcomeText}>Welcome, {dbUser.name} </Text>
        <View style={styles.kidsContainer}>
          <Text style={styles.sectionTitle}>Your Kids</Text>
          <FlatList
            data={kids}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.kidItem}>
                <View style={styles.kidImageContainer}>
                  {item.uriKid ? (
                    <Image
                      source={{ uri: item.uriKid }}
                      style={styles.kidImage}
                    />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Text style={styles.placeholderText}>
                        {getInitials(item.name)}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.kidName}>{item.name}</Text>
              </View>
            )}
          />
        </View>
      </View>
      <View style={styles.swiper}>
        <Text style={styles.eventHeader}>Upcoming Events</Text>
        <Swiper loop={true} autoplay={true}>
          {events.map(renderEvent)}
        </Swiper>
      </View>
    </View>
  );
};

export default LoadingScreen;
