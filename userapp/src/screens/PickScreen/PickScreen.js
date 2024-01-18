import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { API, Storage, graphqlOperation } from "aws-amplify";
// import { GetKidByParentEmail } from "../../graphql/queries";
import { updateKid } from "../../graphql/mutations";
import { useAuthContext } from "../../contexts/AuthContext";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import styles from "./styles";

const PickScreen = () => {
  const [kid, setKid] = useState([]);
  const { userEmail, kids } = useAuthContext();

  useEffect(() => {
    const fetchKidData = async () => {
      try {
        //console.log(kids);
        // const kidData = await API.graphql(
        //   graphqlOperation(GetKidByParentEmail, {
        //     userEmail: userEmail,
        //   })
        // );

        // const kids = kidData.data.listKids.items;
        setKid(kids);
      } catch (error) {
        console.error("Error fetching Kid data:", error);
      }
    };

    fetchKidData();
  }, []);

  const updateKidImage = async (newPic) => {
    try {
      const kidId = newPic.id;
      const kidPhoto = newPic.photo;
      // const kidName = kid[0].name;
      const kidDetails = {
        id: kidId,
        photo: kidPhoto,
      };

      //console.log("variables", kidDetails);

      const updatedKid = await API.graphql(
        graphqlOperation(updateKid, { input: kidDetails })
      );

      //console.log("Updated Kid Picture:", updatedKid);
      // console.log("Kid ID", kid[0].id);
      // console.log(kid.photo);
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  const uploadImage = async (uri, kidID) => {
    try {
      if (!uri) {
        throw new Error("Image URI is undefined");
      }

      //console.log("Fetching image from:", uri);
      const response = await fetch(uri);
      const blob = await response.blob();
      if (!blob) {
        throw new Error("Failed to create blob.");
      }

      console.log("Uploading image to S3...");
      const filename = `kid-photo-${kidID}-${Date.now()}`;
      await Storage.put(filename, blob, {
        contentType: "image/jpeg",
      });

      console.log("Image uploaded successfully.");

      const imageURL = await Storage.get(filename);
      //console.log("Image URL:", imageURL);

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
      //console.log("ImagePicker Result:", result);

      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          const imageURL = await uploadImage(result.assets[0].uri, kid[0].id);
          const imageUrlString = imageURL.toString();

          // console.log("Selected Image:", imageURL);
          // console.log("Selected Image String:", imageUrlString);

          setKid((prevKids) => {
            const updatedKids = prevKids.map((kidItem) => {
              if (kidItem.id === kid[0].id) {
                return {
                  ...kidItem,
                  photo: imageUrlString,
                };
              } else {
                return kidItem;
              }
            });

            return updatedKids;
          });

          const newKidPicture = {
            id: kid[0].id,
            photo: imageUrlString,
          };

          await updateKidImage(newKidPicture);

          // await API.graphql(
          //   graphqlOperation(UpdateKid, {
          //     input: {
          //       id: kid[0].id,
          //       photo: imageURL,
          //     },
          //   })
          // );
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
        <SafeAreaView style={{ marginTop: 20, marginLeft: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Kid Details</Text>
          {kid.map((kidItem) => (
            <View key={kidItem.id}>
              <Text>Name: {kidItem.name}</Text>
              <Text>Drop-off Address: {kidItem.dropOffAddress}</Text>
              {kidItem.photo && (
                <Image
                  style={{ width: 100, height: 100 }}
                  source={{ uri: kidItem?.photo }}
                />
              )}
            </View>
          ))}
          {/* <TouchableOpacity onPress={updateKidImage}> */}
          <TouchableOpacity onPress={openImageLibrary}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Open Image Library</Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default PickScreen;
