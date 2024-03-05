import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, Linking, FlatList, Pressable } from "react-native";
import Swiper from "react-native-swiper";
import { API, graphqlOperation } from "aws-amplify";
import { listEvents } from "../../graphql/queries";
import styles from "./styles";
import { useAuthContext } from "../../contexts/AuthContext";
import { format, getDay } from "date-fns";
import { usePicturesContext } from "../../contexts/PicturesContext";

const HomeScreen = () => {
  const [events, setEvents] = useState([]);
  const { kids, dbUser } = useAuthContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { getPhotoInBucket } = usePicturesContext();
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.graphql(
          graphqlOperation(listEvents, {
            limit: 10,
          })
        );
        const eventsList = response.data.listEvents.items;

        const eventsWithPhotos = await Promise.all(
          eventsList.map(async (event) => {
            if (event.image) {
              const uriEventImage = await getPhotoInBucket(event.image);
              return { ...event, uriEventImage };
            } else {
              return event;
            }
          })
        );

        setEvents(eventsWithPhotos);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

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

  const handleIndexChanged = (index) => {
    console.log(currentIndex);
    setCurrentIndex(index);
  };

  const renderEvent = (item) => {
    //console.log("Event Image URL:", item.image);

    return (
      <Pressable key={item.id} onPress={() => handleEventPress(item.link)}>
        <View style={styles.eventContainer}>
          <Image
            source={{ uri: item.uriEventImage }}
            style={styles.eventImage}
          />
          <View style={styles.eventDetails}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  // const toggleSideDrawer = () => {
  //   setSideDrawerVisible(!isSideDrawerVisible);
  // };

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
      <View style={styles.swiper}>
        <Text style={styles.eventHeader}>Upcoming Events</Text>
        <Swiper
          ref={swiperRef}
          autoplay={true}
          autoplayTimeout={2}
          loop={true}
          index={currentIndex}
          onIndexChanged={handleIndexChanged}
        >
          {events.map(renderEvent)}
        </Swiper>
      </View>
    </View>
  );
};

export default HomeScreen;
