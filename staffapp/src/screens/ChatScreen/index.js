import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { GiftedChat, Send } from "react-native-gifted-chat";
import { API, graphqlOperation } from "aws-amplify";
import { onCreateMessage } from "../../graphql/subscriptions";
import { listMessages } from "../../graphql/queries";
import { createMessage } from "../../graphql/mutations";
import { useAuthContext } from "../../contexts/AuthContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { listKids } from "../../graphql/queries";
import { useKidsContext } from "../../contexts/KidsContext";

const ChatScreen = ({ navigation }) => {
  const { currentUserData } = useAuthContext();
  const { kids } = useKidsContext();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [users, setUsers] = useState([]);

  const getInitials = (name) => {
    const nameArray = name.split(" ");
    return nameArray
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // useEffect(() => {
  //   const subscription = API.graphql(
  //     graphqlOperation(onCreateMessage)
  //   ).subscribe({
  //     next: ({ value }) => {
  //       setMessages((prevMessages) => [
  //         ...prevMessages,
  //         value.data.onCreateMessage,
  //       ]);
  //     },
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  // const fetchMessages = async () => {
  //   try {
  //     const result = await API.graphql(graphqlOperation(listMessages));
  //     const messagesFromDB = result.data.listMessages.items;
  //     //console.log("messagesFromDB", messagesFromDB);
  //     setMessages(messagesFromDB);

  //     const uniqueSenderIDs = Array.from(
  //       new Set(messagesFromDB.map((message) => message.senderID))
  //     );

  //     const usersWithMessages = await Promise.all(
  //       uniqueSenderIDs.map(async (senderID) => {
  //         const user = await fetchUserData(senderID);
  //         return user;
  //       })
  //     );

  //     setUsers(usersWithMessages);
  //   } catch (error) {
  //     console.error("Error fetching messages:", error);
  //   }
  // };

  useEffect(() => {
    if (kids) {
      setUsers(kids);
    }
  }, [kids]);

  // const fetchUserData = async (userID) => {
  //   try {
  //     // Replace this with your actual GraphQL query to fetch user data
  //     const result = await API.graphql(
  //       graphqlOperation(listKids, {
  //         filter: { id: { eq: userID } },
  //       })
  //     );

  //     return result.data.listKids.items[0];
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //     return null;
  //   }
  // };

  // useEffect(() => {
  //   console.log("users", users);
  // }, [users]);

  const onUserPress = (user) => {
    navigation.navigate("ChatUser", { id: user.id });
  };

  const renderUserItem = ({ item: user }) => (
    <TouchableOpacity onPress={() => onUserPress(user)}>
      <View style={{ flex: 1, alignItems: "left", padding: 16 }}>
        {user.uriKid ? (
          <Image
            source={{ uri: user.uriKid }}
            style={{ width: 60, height: 60, borderRadius: 30, marginRight: 10 }}
          />
        ) : (
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "lightgray",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ color: "white" }}>{getInitials(user.name)}</Text>
          </View>
        )}
        <Text>{user.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={users}
        keyExtractor={(user) => user?.id}
        renderItem={renderUserItem}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;
