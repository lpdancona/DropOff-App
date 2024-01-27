import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { useAuthContext } from "../../contexts/AuthContext";
import { useMessageContext } from "../../contexts/MessageContext";

const ChatScreen = ({ navigation }) => {
  const { kids } = useAuthContext();
  const [users, setUsers] = useState([]);
  const { allMessages } = useMessageContext();
  //const [messages, setMessages] = useState([]);

  const getInitials = (name) => {
    const nameArray = name.split(" ");
    return nameArray
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  useEffect(() => {
    if (kids) {
      //console.log("allMessages", allMessages);
      setUsers(kids);
    }
  }, [kids]);

  const getUnreadMessagesCount = (userId) => {
    if (!allMessages || !allMessages[userId]) {
      return 0;
    }
    const userMessages = allMessages[userId];
    let unreadCount = 0;

    for (const message of userMessages) {
      if (!message.isRead) {
        unreadCount++;
      }
    }

    return unreadCount;
  };

  const onUserPress = (user) => {
    navigation.navigate("ChatUser", { id: user.id });
  };

  const renderUserItem = ({ item: user }) => (
    <TouchableOpacity onPress={() => onUserPress(user)}>
      <View style={{ flex: 1, alignItems: "left", padding: 16 }}>
        {user?.uriKid ? (
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
        <Text>{user?.name}</Text>
        {getUnreadMessagesCount(user.id) > 0 && (
          <View
            style={{
              backgroundColor: "red",
              borderRadius: 10,
              padding: 5,
              marginTop: 5,
            }}
          >
            <Text style={{ color: "white" }}>
              {getUnreadMessagesCount(user.id)} Unread message
              {getUnreadMessagesCount(user.id) > 1 ? "s" : ""}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={users}
        keyExtractor={(user) => user.id}
        renderItem={renderUserItem}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;
