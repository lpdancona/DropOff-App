import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { GetKidByParentEmail } from "../../graphql/queries";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker from Expo

import styles from "./styles";

const PickScreen = () => {
  const [kid, setKid] = useState(null);

  useEffect(() => {
    const fetchKidData = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        const userEmail = user.attributes.email;

        const kidData = await API.graphql(
          graphqlOperation(GetKidByParentEmail, {
            userEmail: userEmail,
          })
        );

        const kids = kidData.data.listKids.items;
        setKid(kids);
      } catch (error) {
        console.error("Error fetching Kid data:", error);
      }
    };

    fetchKidData();
  }, []);

  const openImageLibrary = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        console.log("Permission to access camera roll is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        console.log("Selected Image:", result.uri);
        // You can do something with the selected image, such as uploading it.
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  return (
    <View>
      {kid ? (
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Kid Details</Text>
          {kid.map((kidItem) => (
            <View key={kidItem.id}>
              <Text>Name: {kidItem.name}</Text>
              <Text>Drop-off Address: {kidItem.dropOffAddress}</Text>
              {/* Add more Kid details as needed */}
            </View>
          ))}
          <TouchableOpacity onPress={openImageLibrary}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Open Image Library</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default PickScreen;
