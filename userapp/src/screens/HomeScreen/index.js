import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Linking,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import Swiper from "react-native-swiper";
import { API, graphqlOperation } from "aws-amplify";
import { listEvents } from "../../graphql/queries";
import styles from "./styles";
import { useAuthContext } from "../../contexts/AuthContext";
import { format, getDay } from "date-fns";
import { usePicturesContext } from "../../contexts/PicturesContext";
import { useMessageContext } from "../../contexts/MessageContext";

const HomeScreen = () => {
  const { kids, dbUser } = useAuthContext();
  const { unreadMessages } = useMessageContext();
  const { getPhotoInBucket } = usePicturesContext();
  //
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [unreadCounts, setUnreadCounts] = useState({});
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

  useEffect(() => {
    // Function to calculate unread count for each kid
    const calculateUnreadCounts = () => {
      const counts = {};

      // Iterate over each kid
      kids.forEach((kid) => {
        // Filter unread messages for the current kid
        const unreadForKid = unreadMessages.filter(
          (message) =>
            !message.isRead &&
            message.receiverIDs.includes(kid.id) &&
            message.senderID !== kid.id
        );

        // Store the count of unread messages for the current kid
        counts[kid.id] = unreadForKid.length;
      });

      // Update state with the counts
      setUnreadCounts(counts);
    };

    // Call the function to calculate unread counts
    calculateUnreadCounts();
  }, [unreadMessages, kids]);

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
    //console.log(currentIndex);
    setCurrentIndex(index);
  };

  const handleKidPress = (kid) => {
    console.log(kid.name);
    //navigation.navigate('KidDetails', { kid });
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
    <ScrollView style={styles.welcomeContainer}>
      <Text style={styles.date}>{formattedDate}</Text>
      <Text style={styles.welcomeText}>Welcome, {dbUser.name} </Text>
      <View style={styles.kidsContainer}>
        <Text style={styles.sectionTitle}>Your Kids</Text>
        {kids.map((kid) => (
          <Pressable key={kid.id} onPress={() => handleKidPress(kid)}>
            <View style={styles.kidItem}>
              <View style={styles.kidImageContainer}>
                {kid.uriKid ? (
                  <Image source={{ uri: kid.uriKid }} style={styles.kidImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>
                      {getInitials(kid.name)}
                    </Text>
                  </View>
                )}
                {unreadCounts[kid.id] > 0 && (
                  <View style={styles.unreadCountContainer}>
                    <Text style={styles.unreadCountText}>
                      {unreadCounts[kid.id]}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.kidName}>{kid.name}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <View style={styles.swiper}>
        <Text style={styles.eventHeader}>Upcoming Events</Text>
        <Swiper
          ref={swiperRef}
          autoplay={true}
          autoplayTimeout={10}
          loop={true}
          index={currentIndex}
          onIndexChanged={handleIndexChanged}
          height={"100%"}
          showsPagination={false}
        >
          {events.map(renderEvent)}
        </Swiper>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
