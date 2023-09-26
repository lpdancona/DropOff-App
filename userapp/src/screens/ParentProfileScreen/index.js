import { View, Text, TextInput, StyleSheet, Button, Alert, Keyboard,TouchableOpacity } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth, DataStore } from "aws-amplify";
import { User, Kid } from '../../models'
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from "@env";
import PhoneInput from "react-native-phone-number-input";

const Profile = () => {
  const { dbUser, userEmail } = useAuthContext();
  
  const [name, setName] = useState(dbUser?.name || "");
  const [kids, setKids] = useState([]);
  const [unitNumber, setUnitNumber] = useState(dbUser?.streetAddress || "");
  const [address, setAddress] = useState(dbUser?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(dbUser?.phoneNumber || "");
  const phoneInputRef = useRef(null);

  const [lat, setLat] = useState(dbUser?.lat || null);
  const [lng, setLng] = useState(dbUser?.lng || null);

  const { sub, setDbUser } = useAuthContext();
  const navigation = useNavigation();

  const handleConfirm = () => {
    //console.log(phoneInputRef.current)
    
    if (phoneInputRef.current.isValidNumber(phoneNumber)) {
      // The phone number is valid, proceed to another control or screen
      //Alert.alert('Valid Phone Number', 'You can proceed to the next step.');
      Keyboard.dismiss();
    } else {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const kidsData = await DataStore.query(Kid, (k) =>
        k.or(k => 
        [
          k.parent1Email.eq(userEmail),
          k.parent2Email.eq(userEmail)
        ])
      );

      const kidsNames = kidsData.map(kid => ({ ...kid, confirmed: false }));
      setKids(kidsNames);
    } catch (error) {
      console.error("Error fetching kids' names:", error);
    }
  };

  const toggleConfirmation = (index) => {
    const updatedKids = [...kids];
    updatedKids[index].confirmed = !updatedKids[index].confirmed;
    setKids(updatedKids);
  };

  const onSave = async () => {
    if (dbUser) {
      await updateUser();
    } else {
      await createUser();
    }
    navigation.navigate('Home');
  };

  const updateUser = async () => {
    const user = await DataStore.save(
      User.copyOf(dbUser, (updated) => {
        updated.name = name;
        updated.unitNumber = unitNumber;
        updated.address = address;
        updated.phoneNumber = phoneNumber;
        updated.lat = parseFloat(lat);
        updated.lng = parseFloat(lng);
      })
    );
    setDbUser(user);
  };

  const createUser = async () => {
    try {
      const user = await DataStore.save(
        new User({
          sub,
          name,
          userType: 'PARENT',
          unitNumber,
          address,
          lng,
          lat,
          phoneNumber,
          //lat: parseFloat(lat),
          //lng: parseFloat(lng),
          
        })
      );
      setDbUser(user);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

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
        nearbyPlacesAPI='GooglePlacesSearch'
        placeholder="Address"
        listViewDisplayed="auto"
        //textInputProps={}
        debounce={400}
        minLength={2}
        onFail={error => console.log(error)}
        onNotFound={() => console.log('no results')}
        enablePoweredByContainer={false}
        fetchDetails={true}
        autoFocus={true}
        styles={autoComplete}
        onPress={(data, details = null) => {
          setAddress(details.formatted_address)
          setLat(details.geometry.location.lat)
          setLng(details.geometry.location.lng)
        }}
        query={{
          key: GOOGLE_MAPS_APIKEY,
          Language: 'en',
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
          onChangeText={(text) => {setPhoneNumber(text)}}
          defaultCode='CA'
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
          Please confirm your child{kids.length > 1 ? 's' : ''} name{kids.length > 1 ? 's' : ''}
        </Text>
        {kids.map((kid, index) => (
          <View key={index} style={styles.kidContainer}>
            <Text style={styles.kidName}>{kid.name}</Text>
            <TouchableOpacity
              style={styles.confirmButton}
              //title={kid.confirmed ? "Confirmed" : "Confirm"}
              onPress={() => toggleConfirmation(index)}
              >
              <Text style={styles.confirmButtonText}>
                {kid.confirmed ? "Confirmed" : "Confirm"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.saveContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={onSave}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.signOutButton}
            onPress={() => Auth.signOut()}
          >
            <Text style={styles.signOutButtonText}>Sign out</Text>
          </TouchableOpacity> */}
        </View>
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
    marginTop: 10
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },

  googleAutoComp: {
    padding: 20
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
    justifyContent: 'space-between',
    padding: 20,
  },
  kidName: {
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: 'green',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    elevation: 2,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 15, 
  },
  saveContainer: {
    padding: 10,
    alignItems: 'center',
    //width: '30%'
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signOutButton: {
    backgroundColor: 'red',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  signOutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: 'green',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5, // Adjust the margin as needed
  },
  okButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
export default Profile;
