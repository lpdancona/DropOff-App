import React, { useEffect, useState } from "react";
import styles from "./styles";
import { Entypo } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuthContext } from "../../contexts/AuthContext";
import { usePicturesContext } from "../../contexts/PicturesContext";

const eventsData = [
  // Sample data for events
  {
    id: 1,
    type: "text",
    date: "2024-03-24",
    content: "Your child checked in at 3:00 PM",
  },
  {
    id: 2,
    type: "image",
    date: "2024-03-24",
    imageUrl: "https://example.com/image.jpg",
  },
  // Add more events as needed
];

const FeedScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const kidID = route.params?.id;
  const { kids } = useAuthContext();
  //const { getPhotoInBucket } = usePicturesContext();
  const [selectedKid, setSelectedKid] = useState(null);

  const goBack = () => {
    navigation.goBack();
  };

  // get the data from choosen kid on route "KidID"
  useEffect(() => {
    if (kidID) {
      const foundKid = kids.find((kid) => kid.id === kidID);
      if (foundKid) {
        console.log(foundKid);
        setSelectedKid(foundKid);
      }
    }
  }, [kidID, kids]);

  const renderFeedItem = ({ item }) => {
    return (
      <View style={styles.eventContainer}>
        {item.type === "image" ? (
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => handleImagePress(item.imageUrl)}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            </TouchableOpacity>
            <FontAwesome
              name="camera"
              size={24}
              color="black"
              style={styles.icon}
            />
          </View>
        ) : (
          <Text>{item.content}</Text>
        )}
        <Text style={styles.date}>{item.date}</Text>
      </View>
    );
  };

  const handleImagePress = (imageUrl) => {
    // Handle image press (e.g., navigate to a larger view of the image)
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.containerMenu}>
          <TouchableOpacity style={styles.goBackIcon} onPress={() => goBack()}>
            <Entypo name="chevron-left" size={30} color="white" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.kidNameText}>{kidID}</Text>
          </View>
        </View>
      </View>
      <SafeAreaView>
        <View style={styles.kidImageContainer}>
          <Text>{selectedKid?.name}</Text>
          <Image
            source={{ uri: selectedKid?.uriKid }}
            style={styles.eventImage}
          />
        </View>
        <View style={styles.iconsContainer}>
          {/* Icons go here */}
          <FontAwesome
            name="comments"
            size={24}
            color="black"
            style={styles.icon}
          />
          <FontAwesome
            name="photo"
            size={24}
            color="black"
            style={styles.icon}
          />
          {/* Add more icons as needed */}
        </View>
        <FlatList
          data={eventsData}
          renderItem={renderFeedItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </SafeAreaView>
    </View>
  );
};

export default FeedScreen;
