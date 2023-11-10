import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "../../contexts/AuthContext";
import { usePushNotificationsContext } from "../../contexts/PushNotificationsContext";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import PhoneInput from "react-native-phone-number-input";
import { API, graphqlOperation } from "aws-amplify";
import { createUser, updateUser, updateKid } from "../../graphql/mutations";
import { getKid } from "../../graphql/queries";
import { Auth } from "aws-amplify";

const ProfileScreen = () => {
  const { setDbUser, dbUser, userEmail, kids, sub } = useAuthContext();
  const { expoPushToken } = usePushNotificationsContext();
  //const [firstLogin, setFirstLogin] = useState(true);

  const [name, setName] = useState(dbUser?.name || "");
  // const [setKids] = useState(kids);
  const [unitNumber, setUnitNumber] = useState(dbUser?.unitNumber || "");
  const [address, setAddress] = useState(dbUser?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(dbUser?.phoneNumber || "");
  const phoneInputRef = useRef(null);

  const [lat, setLat] = useState(dbUser?.lat || null);
  const [lng, setLng] = useState(dbUser?.lng || null);
  const [confirmations, setConfirmations] = useState(kids.map(() => false));

  //const { sub, setDbUser } = useAuthContext();
  const navigation = useNavigation();

  const handleConfirm = () => {
    //console.log(phoneInputRef.current)

    if (phoneInputRef.current.isValidNumber(phoneNumber)) {
      // The phone number is valid, proceed to another control or screen
      //Alert.alert('Valid Phone Number', 'You can proceed to the next step.');
      Keyboard.dismiss();
    } else {
      Alert.alert("Invalid Phone Number", "Please enter a valid phone number.");
    }
  };

  //const allKidsConfirmed = kids.every((kid) => kid.confirmed);

  const isSaveButtonVisible =
    name.trim() !== "" &&
    address.trim() !== "" &&
    phoneNumber.trim() !== "" &&
    confirmations.every((confirmed) => confirmed);

  // const toggleKidsConfirmation = (index) => {
  //   const updatedKids = kids.map(([...kids];
  //   updatedKids[index].confirmed = !updatedKids[index].confirmed;
  // };

  const toggleKidConfirmation = (index) => {
    const updatedConfirmations = [...confirmations];
    updatedConfirmations[index] = !updatedConfirmations[index];
    setConfirmations(updatedConfirmations);
  };

  const onSave = async () => {
    try {
      // if (dbUser) {
      //   await onUpdateUser();
      // } else {
      await onCreateUser();
      //await onUpdateKid();
      // }
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const updateKidUserID = async (newUser) => {
    try {
      //console.log(newUser);
      //console.log(kids);
      for (const kid of kids) {
        //console.log("kid id", kid.id);
        // Query your GraphQL API to find the kid by some unique identifier (e.g., name or ID).
        const queryResult = await API.graphql({
          query: getKid,
          variables: { id: kid.id },
        });

        // Check if the query found a matching kid.
        const foundKid = queryResult.data.getKid;
        //console.log("found??", foundKid);
        if (foundKid) {
          // If a matching kid was found, update their userID.
          // if (kidparent1Email !== null) {

          const parentField =
            kid.parent1Email !== null ? "Parent1ID" : "Parent2ID";

          // console.log("parent 1 Email ", kid.parent1Email);
          // console.log("parent Field ", parentField);
          //console.log(dbUser);
          const variables = {
            input: {
              id: foundKid.id,
            },
          };

          variables.input[parentField] = newUser.id;

          const updateResult = await API.graphql({
            query: updateKid,
            variables: variables,
          });
        }
      }
    } catch (e) {
      Alert.alert("Error updating kid", e.message);
    }
  };

  const onCreateUser = async () => {
    try {
      const userDetails = {
        sub,
        name,
        email: userEmail,
        userType: "PARENT",
        unitNumber,
        address,
        lng,
        lat,
        phoneNumber,
        pushToken: expoPushToken.data,
      };

      const response = await API.graphql(
        graphqlOperation(createUser, { input: userDetails })
      );

      const newUser = response.data.createUser; // Access the user data from the response
      const userId = newUser.id; // Access the ID of the newly created user

      await updateKidUserID(newUser);
      setDbUser(newUser);
    } catch (e) {
      Alert.alert("Error saving new user", e.message);
    }
  };
  //console.log(GOOGLE_MAPS_APIKEY);
  return (
    <SafeAreaView>
      <Text style={styles.title}>Complete your Profile</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />
      <GooglePlacesAutocomplete
        nearbyPlacesAPI="GooglePlacesSearch"
        placeholder="Address"
        listViewDisplayed="auto"
        //textInputProps={}
        debounce={400}
        minLength={2}
        onFail={(error) => console.log(error)}
        onNotFound={() => console.log("no results")}
        enablePoweredByContainer={false}
        fetchDetails={true}
        autoFocus={true}
        styles={autoComplete}
        onPress={(data, details = null) => {
          setAddress(details.formatted_address);
          setLat(details.geometry.location.lat);
          setLng(details.geometry.location.lng);
        }}
        query={{
          key: GOOGLE_MAPS_APIKEY,
          Language: "en",
          components: "country:ca",
        }}
      />
      <TextInput
        value={unitNumber}
        onChangeText={setUnitNumber}
        placeholder="Unit Number"
        style={styles.input}
      />
      <View style={styles.phoneInputContainer}>
        <PhoneInput
          ref={phoneInputRef}
          value={phoneNumber}
          //onChangeText={setPhoneNumber}
          onChangeText={(text) => {
            setPhoneNumber(text);
          }}
          defaultCode="CA"
          layout="first"
          placeholder="Phone Number"
          style={styles.phoneInputField}
          //style={styles.phoneInput}
        />
        <TouchableOpacity
          style={styles.okButton}
          onPress={() => {
            handleConfirm();
          }}
        >
          <Text style={styles.okButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.subTitle}>
          Please confirm your child{kids.length > 1 ? "s" : ""} name
          {kids.length > 1 ? "s" : ""}
        </Text>
        {kids.map((kid, index) => (
          <View key={index} style={styles.kidContainer}>
            <Text style={styles.kidName}>{kid.name}</Text>
            <TouchableOpacity
              style={
                confirmations[index]
                  ? styles.confirmedButton
                  : styles.confirmButton
              }
              onPress={() => toggleKidConfirmation(index)}
            >
              <Text style={styles.confirmButtonText}>
                {confirmations[index] ? "Confirmed" : "Confirm"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
        {isSaveButtonVisible && (
          <View style={styles.saveContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => Auth.signOut()}
        >
          <Text style={styles.signOutButtonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
    marginTop: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },

  googleAutoComp: {
    padding: 20,
  },
  kidContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  kidName: {
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "gray",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    elevation: 2,
  },
  confirmedButton: {
    backgroundColor: "green",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    elevation: 2,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  confirmedButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "blue",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 15,
  },
  saveContainer: {
    padding: 10,
    alignItems: "center",
    //width: '30%'
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  signOutButton: {
    backgroundColor: "red",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  signOutButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    //borderWidth: 1,
    //borderColor: '#ccc',
    //borderRadius: 5,
    paddingHorizontal: 10,
  },
  phoneInputField: {
    flex: 1,
    paddingVertical: 8, // Adjust the padding as needed
  },
  okButton: {
    backgroundColor: "green",
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5, // Adjust the margin as needed
  },
  okButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

const autoComplete = {
  container: {
    margin: 10,
    flex: 0,
  },
  TextInput: {
    fontSize: 18,
  },
};
export default ProfileScreen;
