import React, { useState, useEffect, useCallback } from "react";
import { View, SafeAreaView } from "react-native";
import { GiftedChat, Send, Bubble } from "react-native-gifted-chat";
import { API, graphqlOperation } from "aws-amplify";
import { createMessage, updateMessage } from "../../graphql/mutations";
import { useAuthContext } from "../../contexts/AuthContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useRoute } from "@react-navigation/native";
import { useMessageContext } from "../../contexts/MessageContext";
import { useKidsContext } from "../../contexts/KidsContext";
import { useStaffContext } from "../../contexts/StaffContext";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const ChatUserScreen = ({ navigation }) => {
  const route = useRoute();
  const kidID = route.params?.id;
  const { allMessages } = useMessageContext();
  const { currentUserData } = useAuthContext();
  const { staff } = useStaffContext();
  const { kids } = useKidsContext();
  const [messages, setMessages] = useState([]);
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
        received: message.isRead && message.senderID === currentUserData.id, //message.senderID === kidID, //message.isRead, //readMessages.includes(message.id),
        sent: message.sentAt && message.senderID === currentUserData.id,
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
      //console.log(currentKid.id);
      const unreadMessagesFromOthers = allMessages.filter(
        (message) =>
          //message.receiverIDs !== currentKid.id &&
          message.senderID === currentKid.id && message.isRead === false
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
        if (message.senderID === kidID) {
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
    //console.log("newMessages", newMessages[0]);

    try {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );

      await API.graphql(
        graphqlOperation(createMessage, {
          input: {
            senderID: currentUserData.id,
            receiverIDs: kidID,
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

  if (!currentKid) {
    return <ActivityIndicator style={{ padding: 50 }} size={"large"} />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        alwaysShowSend
        user={{
          _id: currentUserData.id,
        }}
        renderBubble={(props) => renderBubble(props)}
        renderSend={renderSend}
        showUserAvatar
        showAvatarForEveryMessage
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        isLoadingEarlier={true}
      />
    </SafeAreaView>
  );
};

export default ChatUserScreen;
