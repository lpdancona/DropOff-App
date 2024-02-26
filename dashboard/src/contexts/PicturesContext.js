import { createContext, useContext } from "react";
//import * as ImagePicker from "expo-image-picker";
//import * as FileSystem from "expo-file-system";
import { Storage } from "aws-amplify";

const PicturesContext = createContext({});

const PicturesContextProvider = ({ children }) => {
  // const uploadImage = async (uri, filename) => {
  //   try {
  //     if (!uri) {
  //       throw new Error("Image URI is undefined");
  //     }

  //     const response = await fetch(uri);
  //     const blob = await response.blob();
  //     if (!blob) {
  //       throw new Error("Failed to create blob.");
  //     }

  //     console.log("Uploading image to S3...");
  //     await Storage.put(filename, blob, {
  //       contentType: "image/jpeg",
  //     });

  //     console.log("Image uploaded successfully.");
  //     const imageURL = await Storage.get(filename);
  //     console.log("Image URL:", imageURL);

  //     return imageURL;
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     throw error;
  //   }
  // };

  const savePhotoInBucket = async (filename, file) => {
    try {
      console.log("Uploading image to S3...");
      await Storage.put(filename, file, {
        contentType: "image/jpeg", // Adjust content type if needed
      });

      console.log("Image uploaded successfully.");
      const imageURL = await Storage.get(filename);
      console.log("Image URL:", imageURL);

      return filename; // Return the filename upon successful upload
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const getPhotoInBucket = async (filename) => {
    try {
      const imageURL = await Storage.get(filename, { expires: 1800 });
      //console.log("Image URL:", imageURL);
      return imageURL;
    } catch (error) {
      console.error("Error getting image:", error);
      throw error;
    }
  };

  return (
    <PicturesContext.Provider value={{ getPhotoInBucket, savePhotoInBucket }}>
      {children}
    </PicturesContext.Provider>
  );
};

export default PicturesContextProvider;

export const usePicturesContext = () => useContext(PicturesContext);
