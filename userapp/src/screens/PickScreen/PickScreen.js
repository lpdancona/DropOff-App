import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Auth, API, graphqlOperation, Storage } from "aws-amplify";
import { GetKidByParentEmail } from "../../graphql/queries";
import { UpdateKid } from "../../graphql/mutations";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Blob } from "expo-blob";

import styles from "./styles";

const PickScreen = () => {
  const [kid, setKid] = useState([]);

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

  const uploadImage = async (uri, kidID) => {
    try {
      if (!uri) {
        throw new Error("Image URI is undefined");
      }

      console.log("Fetching image from:", uri);
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer]);

      console.log("Uploading image to S3...");
      const filename = `kid-photo-${kidID}-${Date.now()}`;
      await Storage.put(filename, blob, {
        contentType: "image/jpeg",
      });

      console.log("Image uploaded successfully.");

      const imageURL = await Storage.get(filename);
      console.log("Image URL:", imageURL);

      return imageURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

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
      console.log("ImagePicker Result:", result);

      if (!result.cancelled) {
        if (result.assets && result.assets.length > 0) {
          const imageURL = await uploadImage(result.assets[0].uri, kid[0].id);

          console.log("Selected Image:", imageURL);

          // Update the kid's photo in the state
          setKid((prevKids) => {
            const updatedKids = prevKids.map((kidItem) => {
              if (kidItem.id === kid[0].id) {
                return {
                  ...kidItem,
                  photo: imageURL,
                };
              } else {
                return kidItem;
              }
            });

            return updatedKids;
          });

          // Update the kid's photo in the GraphQL API
          await API.graphql(
            graphqlOperation(UpdateKid, {
              input: {
                id: kid[0].id,
                photo: imageURL,
              },
            })
          );
        } else {
          console.error("Image assets not found in the result.");
        }
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
              {kidItem.photo && (
                <Image
                  style={{ width: 100, height: 100 }}
                  source={{ uri: kidItem.photo }}
                />
              )}
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
