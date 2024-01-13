import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { GetKidByParentEmail } from "../../graphql/queries";
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
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default PickScreen;
