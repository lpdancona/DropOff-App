import React, { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styles from "./styles";
import { useRoute } from "@react-navigation/native";
import SideDrawer from "../SideDrawer/SideDrawer";
import { Auth, API, graphqlOperation } from "aws-amplify";
import { createMessage, updateMessage } from "../../graphql/mutations";
import { useAuthContext } from "../../contexts/AuthContext";
import { useMessageContext } from "../../contexts/MessageContext";
import { useStaffContext } from "../../contexts/StaffContext";

const ChatUserScreen = () => {
  const route = useRoute();
  const kidID = route.params?.id;
  const { kids } = useAuthContext();
  const { staff } = useStaffContext();
  const { allMessages } = useMessageContext();
  const [messages, setMessages] = useState([]);
  const [isSideDrawerVisible, setSideDrawerVisible] = useState(false);
  const [currentKid, setCurrentKid] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);

  useEffect(() => {
    // Set current kid
    const actualKid = kids.find((kid) => kid.id === kidID);
    setCurrentKid(actualKid);
  }, [kids]);

  // get the messages from messageContext and format to giftedchat
  useEffect(() => {
    if (allMessages && currentKid && staff) {
      const allMessagesFromStaffAndKid = allMessages.filter(
        (message) =>
          message.senderID === currentKid.id ||
          message.receiverIDs === currentKid.id
      );

      // Format messages for GiftedChat
      const formattedMessages = allMessagesFromStaffAndKid.map((message) => ({
        _id: message.id,
        text: message.content,
        createdAt: new Date(message.sentAt),
        user: {
          _id: message.senderID,
          avatar:
            message.senderID === currentKid.id
              ? currentKid.uriKid
              : staff.find((staffMember) => staffMember.id === message.senderID)
                  ?.uriStaff,
        },
        received: message.isRead && message.senderID === kidID, //message.senderID === kidID, //message.isRead, //readMessages.includes(message.id),
        sent: message.sentAt && message.senderID === kidID,
      }));

      // Sort messages by createdAt timestamp in ascending order
      const sortedMessages = formattedMessages
        .sort((a, b) => a.createdAt - b.createdAt)
        .reverse();

      setMessages(sortedMessages);
    }
  }, [allMessages, currentKid]);

  const updateMessagesAsRead = async (id) => {
    try {
      const messageDetails = {
        id: id,
        isRead: true,
      };
      const updatedMessage = await API.graphql({
        query: updateMessage,
        variables: { input: messageDetails },
      });

      // setUnreadMessages((prevState) =>
      //   prevState.filter((msg) => msg.id !== id)
      // );
    } catch (error) {
      console.error("error mark as read messages", error);
    } finally {
      console.log("message isRead updated successfully!");
    }
  };

  useEffect(() => {
    //update the unreadMessages when get a new message
    try {
      // if (unreadMessages.length === 0) {
      //   return;
      // }
      const unreadMessagesFromOthers = allMessages.filter(
        (message) =>
          message.receiverIDs === kidID &&
          message.senderID !== kidID &&
          message.isRead === false
      );

      //console.log("Unread Messages Ids", unreadMessagesFromOthers);
      setUnreadMessages(unreadMessagesFromOthers);
    } catch (error) {
      console.log("error updating the unread Message", error);
    }
  }, [messages]);

  const markMessagesAsRead = async () => {
    if (unreadMessages.length === 0) return; // Return if there are no unread messages
    //console.log("unreadMessages", unreadMessages);

    const timer = setTimeout(async () => {
      for (const message of unreadMessages) {
        if (message.senderID !== kidID) {
          await updateMessagesAsRead(message.id);
          setUnreadMessages((prevUnreadMessages) =>
            prevUnreadMessages.filter((msg) => msg.id !== message.id)
          );
        }
      }
    }, 5000); //5 seconds

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    // Call the function to start marking messages as read if there are unread messages
    //if (unreadMessages && unreadMessages.length !== 0) {
    markMessagesAsRead();
    //}
  }, [unreadMessages]);

  const onSend = useCallback(async (newMessages = []) => {
    const newMessage = newMessages[0];

    try {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );

      await API.graphql(
        graphqlOperation(createMessage, {
          input: {
            senderID: kidID, //currentKid.id,
            receiverIDs: kidID, //currentKid.id,
            content: newMessage.text,
            sentAt: new Date().toISOString(),
            isRead: false,
          },
        })
      );
    } catch (error) {
      console.error("Error creating message:", error);
    } finally {
      console.log("message saved successfully!");
    }
  }, []);

  if (!currentKid) {
    return <ActivityIndicator style={{ padding: 50 }} size={"large"} />;
  }

  const renderSend = (props) => (
    <Send {...props}>
      <View>
        <MaterialCommunityIcons
          name="send-circle"
          style={{ marginBottom: 5, marginRight: 5 }}
          size={32}
          color="#FF7276"
        />
      </View>
    </Send>
  );

  const renderTicks = (message) => {
    return (
      (message.received || message.sent) && (
        <MaterialIcons
          name={message.received ? "done-all" : "done"}
          size={16}
          style={{ paddingRight: 5 }}
          color={message.received ? "#03ff39" : "#d1d1d1"}
        />
      )
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#FF7276",
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
          },
        }}
        renderTicks={renderTicks}
      ></Bubble>
    );
  };

  const scrollToBottomComponent = () => (
    <FontAwesome name="angle-double-down" size={22} color="#333" />
  );

  const toggleSideDrawer = () => {
    setSideDrawerVisible(!isSideDrawerVisible);
  };

  const handleLogout = async () => {
    try {
      // Sign out the user using Amplify Auth
      await Auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setSideDrawerVisible(false); // Fix: Close the side drawer after logout
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerMenu}>
        <TouchableOpacity onPress={toggleSideDrawer}>
          <MaterialIcons name="menu" size={30} color="white" />
        </TouchableOpacity>

        <SideDrawer
          isVisible={isSideDrawerVisible}
          onClose={toggleSideDrawer}
          onLogout={handleLogout}
        />
      </View>
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: kidID,
          }}
          renderBubble={(props) => renderBubble(props)}
          alwaysShowSend
          renderSend={renderSend}
          showUserAvatar
          showAvatarForEveryMessage
          scrollToBottom
          scrollToBottomComponent={scrollToBottomComponent}
          isLoadingEarlier={true}
        />
      </View>
    </View>
  );
};

export default ChatUserScreen;
