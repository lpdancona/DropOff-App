import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import Swiper from "react-native-swiper";
import { API, graphqlOperation } from "aws-amplify";
import { listEvents } from "../../graphql/queries";
import styles from "./styles";
import SideDrawer from "../SideDrawer/SideDrawer";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const LoadingScreen = () => {
  const [events, setEvents] = useState([]);
  const [isSideDrawerVisible, setSideDrawerVisible] = useState(false);

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
      // Sign out the user using Amplify Auth
      await Auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setSideDrawerVisible(false); // Fix: Close the side drawer after logout
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
        <View>
          <Image
            source={{
              uri: "https://dropoffbuckettest154044-test.s3.ca-central-1.amazonaws.com/public/Slime%20party.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJIMEYCIQC5NBv0xL8U%2Fsab2fWpQqeMcxQyme13J38F5OSxOH3ZUgIhAPIXmsPMU2L6uKfBKuAhdOSd2kDmnEvr5ksmxSyNkfQVKoQDCMX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMzUyNzAwNjI1MzE3IgxPZOyafgSEV3iOcMMq2AL6YdpBYidvK0jsJdzHSOc%2F1xRj6b31k28r1fU5ZdNfQY%2BW62UCKnDF2rHLpn%2B%2BL8775FywfEDfnMwx0vdyof1G3E8xcPIL%2Fq8g8%2B4WCvrfF8gxznTZiyqTNlqrcVVVXtEkz3IBljReaw1ZRFMq3WMoKJWZ%2BgglZBmCwswCkoAxKSyHLtDEHXpGFr3d8RNE27mgmSrYsFeLG6DykCINelsGOGO%2FfMeJSb%2FiRoqtLnU3NLfFwBwB9BaaQsZANedFhlJ708JIjF4BYxu4poEHtL0TwaXsKYJkd8Q55oEBtdzt%2BsKSZyDS3MA3nTrUaaVRMSi0KElgucZ%2FeJWQIHm4WxcmwvYrrS0%2FzJbyrUfMUH6IQV8aklTaizWeNJQhSonwz0cXwF8T0%2B%2B48%2BxZ9ep%2F2TsiS91knJ44GxDJ8ovb8X8ZC22jn%2FYCnGFDqnekskR2JrhmTAuD3tBnATCT1aCtBjqyAo6W5VKdomlfdIb%2FA%2F%2BSFBvE5owStnnOhDDveqa4jvWP3AOwJHpVu3nIMVm4fE4cPw1ud%2BsOVe68iFvUpYixWoBEuvcenjb88vt90OxNvsBHKGcpiI4Ld7hP7OO3JIp1ORyp9aZjZ3fSeHADkT6aW9C6%2BzTNSYQdxeZ71lwdhk%2FwUhm2UErYYKW2%2BczxF2oP%2Brsp8Oby6ZUu6dADJrmpZx8hM7bzGMIPjQ8zwSZkbO2CMzs1PL73xD5KGRzmIRBr05n2PjFCFrFe%2FsQwGd%2FwPjEdvcz4CGpd7F4Ksx6b%2FjxI0%2FRgyow67uLEITBLIIUx%2BsBJC4O%2B0%2Bq6HWO3CQGS4gJF1yQpqEvpOWsrskC7MYzIZt6eup2SSpmKSCPcckNGPzGtyspCopJyHF%2BDtYacKzJtVg%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240117T194339Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAVEHUYOGS462IVXOV%2F20240117%2Fca-central-1%2Fs3%2Faws4_request&X-Amz-Signature=97fae541799ede79f26e737cc7380b41e083bc6c1a8dd91c8928f07486017966",
            }}
            style={{ width: "100%", height: 200 }}
          />
          <Text>{item.name}</Text>
          <Text>{item.date}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const toggleSideDrawer = () => {
    setSideDrawerVisible(!isSideDrawerVisible);
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
      <Swiper
        loop={true}
        autoplay={true}
        onIndexChanged={(index) => console.log(`Swiped to item ${index}`)}
      >
        {events.map(renderEvent)}
      </Swiper>
    </View>
  );
};

export default LoadingScreen;
