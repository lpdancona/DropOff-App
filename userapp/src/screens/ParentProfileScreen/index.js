import { View, Text, TextInput, StyleSheet, Button, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Auth, DataStore } from "aws-amplify";
import { User, Kid } from '../../models'
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const { dbUser, userEmail } = useAuthContext();
  
  const [name, setName] = useState(dbUser?.name || "");
  const [kids, setKids] = useState([]);
  const [streetAddress, setStreetAddress] = useState(dbUser?.streetAddress || "");
  const [unitNumber, setUnitNumber] = useState(dbUser?.streetAddress || "");
  //const [lat, setLat] = useState(dbUser ? dbUser.lat + "" : "0");
  //const [lng, setLng] = useState(dbUser ? dbUser.lng + "" : "0");

  const { sub, setDbUser } = useAuthContext();

  const navigation = useNavigation();

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
    navigation.goBack();
  };

  const updateUser = async () => {
    const user = await DataStore.save(
      User.copyOf(dbUser, (updated) => {
        updated.name = name;
        updated.unitNumber = unitNumber;
        updated.streetAddress = streetAddress;
        updated.city = city;
        updated.province = province;
        updated.postalCode = postalCode;
        updated.phoneNumber = phoneNumber;
        //updated.lat = parseFloat(lat);
        //updated.lng = parseFloat(lng);
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
          streetAddress,
          city,
          province,
          postalCode,
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
      <TextInput
        value={streetAddress}
        onChangeText={setStreetAddress}
        placeholder="Street Address"
        style={styles.input}
      />
      {/* <TextInput
        value={lat}
        onChangeText={setLat}
        placeholder="Latitude"
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        value={lng}
        onChangeText={setLng}
        placeholder="Longitude"
        style={styles.input}
        keyboardType="numeric"
      /> */}
      <Text style={styles.subTitle}>Please confirm your kid's name:</Text>
      {kids.map((kid, index) => (
        <View key={index} style={styles.kidContainer}>
          <Text>{kid.name}</Text>
          <Button
            title={kid.confirmed ? "Confirmed" : "Confirm"}
            onPress={() => toggleConfirmation(index)}
          />
        </View>
      ))}
      <Button onPress={onSave} title="Save" />
      <Text
        onPress={() => Auth.signOut()}
        style={{ textAlign: "center", color: "red", margin: 10 }}
      >
        Sign out
      </Text>
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
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
  kidContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 10,
  },
});

export default Profile;
