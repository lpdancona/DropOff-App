import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Linking,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Swiper from "react-native-swiper";
import { API, graphqlOperation } from "aws-amplify";
import { listEvents } from "../../graphql/queries";
import styles from "./styles";
import { format, getDay } from "date-fns";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import InfoModal from "../../components/InfoModal";
import { useAuthContext } from "../../contexts/AuthContext";
import { usePicturesContext } from "../../contexts/PicturesContext";
import { useMessageContext } from "../../contexts/MessageContext";
import { useStaffContext } from "../../contexts/StaffContext";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { kids, dbUser } = useAuthContext();
  const { unreadMessages } = useMessageContext();
  const { getPhotoInBucket } = usePicturesContext();
  const { staff } = useStaffContext();
  //
  const [events, setEvents] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [unreadCounts, setUnreadCounts] = useState({});
  const swiperRef = useRef(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedKidCheckIn, setSelectedKidCheckIn] = useState(null);
  const [lastCheckInData, setLastCheckInData] = useState(null);

  useEffect(() => {
    if (kids && staff) {
      const lastCheckInDataArray = [];

      kids.forEach((kid) => {
        //console.log(kid);
        if (kid.CurrentState.state === "CHECK_IN") {
          const associatedStaff = staff.find(
            (member) => member.id === kid.CurrentState.userIdState
          );
          //console.log("associatedStaff", associatedStaff);
          // if (associatedStaff) {
          const checkInInfo = {
            kidId: kid.id,
            userId: kid.CurrentState.userIdState,
            userName: associatedStaff?.name,
            kidName: kid.name,
            checkInTime: kid.CurrentState.TimeState,
            checkInDate: kid.CurrentState.dateState,
          };
          //console.log(checkInInfo);
          lastCheckInDataArray.push(checkInInfo);
          // }
        }
        setLastCheckInData(lastCheckInDataArray);
      });
    }
  }, []);

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
    //console.log("lastCheckInData", lastCheckInData);
    if (!events) {
      //console.log("fetching events....");
      fetchEvents();
    }
  }, [events]);

  useEffect(() => {
    // Function to calculate unread count for each kid
    const calculateUnreadCounts = () => {
      const counts = {};

      // Iterate over each kid
      kids.forEach((kid) => {
        // Filter unread messages for the current kid
        const unreadForKid = unreadMessages?.filter(
          (message) =>
            !message.isRead &&
            message.receiverIDs.includes(kid.id) &&
            message.senderID !== kid.id
        );

        // Store the count of unread messages for the current kid
        counts[kid.id] = unreadForKid?.length;
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
          //console.log("Link opened successfully:", result);
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

  const handleMsgPress = (kid) => {
    const idUserChat = kid.id;
    navigation.navigate("ChatUser", { id: idUserChat });
  };

  useEffect(() => {
    if (showCheckInModal && selectedKidCheckIn) {
      setShowCheckInModal(true);
    }
  }, [showCheckInModal, selectedKidCheckIn]);

  const handleCheckInPress = async (kid) => {
    const checkInSelectedKid = lastCheckInData.filter(
      (checkIn) => checkIn.kidId === kid.id
    );
    setSelectedKidCheckIn(checkInSelectedKid[checkInSelectedKid.length - 1]);
    setShowCheckInModal(true);
  };

  const handleKidPress = (kid) => {
    console.log(kid.name);
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

  if (!events) {
    return <ActivityIndicator style={{ padding: 50 }} size={"large"} />;
  }
  if (!lastCheckInData) {
    return <ActivityIndicator style={{ padding: 50 }} size={"large"} />;
  }

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
                <Text style={styles.kidName}>{kid.name}</Text>
                {unreadCounts[kid.id] > 0 && (
                  <Pressable
                    style={styles.updatesContainer}
                    onPress={() => handleMsgPress(kid)}
                  >
                    <AntDesign name="message1" size={30} color="gray" />
                    <View style={styles.unreadCountContainer}>
                      <Text style={styles.unreadCountText}>
                        {unreadCounts[kid.id]}
                      </Text>
                    </View>
                  </Pressable>
                )}
              </View>
              {kid.CurrentState?.state === "CHECK_IN" && (
                <Pressable
                  style={{ padding: 12 }}
                  onPress={() => handleCheckInPress(kid)}
                >
                  <AntDesign name="checksquare" size={30} color="green" />
                </Pressable>
                // <Text style={{ backgroundColor: "green" }}>
                //   {kid.CurrentState.state}
                // </Text>
              )}
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
      {showCheckInModal && (
        <InfoModal
          isVisible={true}
          onClose={() => setShowCheckInModal(false)}
          infoItems={[
            { label: "Time", value: selectedKidCheckIn.checkInTime },
            { label: "Date", value: selectedKidCheckIn.checkInDate },
            { label: "Checked By", value: selectedKidCheckIn.userName },
          ]}
        />
      )}
    </ScrollView>
  );
};

export default HomeScreen;
