import React, { useState, useEffect, useCallback } from "react";
import { View, SafeAreaView } from "react-native";
import { GiftedChat, Send, Bubble } from "react-native-gifted-chat";
import { API, graphqlOperation } from "aws-amplify";
import { createMessage } from "../../graphql/mutations";
import { useAuthContext } from "../../contexts/AuthContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
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
  const { kids } = useKidsContext();
  const [messages, setMessages] = useState([]);
  const [currentKid, setCurrentKid] = useState([]);
  const { staff } = useStaffContext();

  useEffect(() => {
    const actualKid = kids.find((kid) => kid.id === kidID);
    //console.log("actualKid", actualKid);
    setCurrentKid(actualKid);
  }, [kids, kidID]);

  useEffect(() => {
    if (allMessages && kids && currentKid && staff) {
      console.log(staff);
      // Format messages for GiftedChat
      const filteredMessages = allMessages.filter(
        (message) =>
          message.senderID === currentKid.id ||
          message.receiverIDs === currentKid.id
      );
      const formattedMessages = filteredMessages.map((message) => ({
        _id: message.id,
        text: message.content,
        createdAt: new Date(message.sentAt),
        user: {
          _id: message.senderID, // === kidID ? kidID : currentUserData.id,
          avatar:
            message.senderID === currentKid.id
              ? currentKid.uriKid
              : staff.find((staffMember) => staffMember.id === message.senderID)
                  ?.uriStaff,
        },
      }));
      console.log(formattedMessages);
      // Sort messages by createdAt timestamp in ascending order
      const sortedMessages = formattedMessages
        .sort((a, b) => a.createdAt - b.createdAt)
        .reverse();

      setMessages(formattedMessages);
      //console.log(currentUserData);
    }
  }, [allMessages, currentUserData.id, currentKid]);

  const onSend = useCallback(async (newMessages = []) => {
    const newMessage = newMessages[0];
    //console.log("newMessages", newMessages[0]);

    try {
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
    }

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
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

  const scrollToBottomComponent = () => (
    <FontAwesome name="angle-double-down" size={22} color="#333" />
  );

  const renderBubble = (props) => (
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
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        alwaysShowSend
        user={{
          _id: currentUserData.id,
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        showUserAvatar
        showAvatarForEveryMessage
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
      />
    </SafeAreaView>
  );
};

export default ChatUserScreen;
