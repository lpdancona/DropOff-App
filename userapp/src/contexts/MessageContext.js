import { createContext, useContext, useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { onCreateMessage } from "../graphql/subscriptions";
import { listMessages } from "../graphql/queries";
import { useAuthContext } from "./AuthContext";

const MessageContext = createContext({});

const MessageContextProvider = ({ children }) => {
  //const [messages, setMessages] = useState([]);
  //const { kids } = useAuthContext();
  const [allMessages, setAllMessages] = useState({});

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // const variables = {
        //   filter: {
        //     or: [{ senderID: { eq: kidID } }, { receiverIDs: { eq: kidID } }],
        //   },
        // };
        const response = await API.graphql({
          query: listMessages,
          // variables: variables,
        });
        const allKidMessages = response.data.listMessages.items;

        setAllMessages(allKidMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();

    // subscribe to get new messages
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
    ).subscribe({
      next: ({ provider, value }) => {
        const newMessage = value.data.onCreateMessage;
        // Update allMessages state with the new message
        setAllMessages((prevMessages) => [...prevMessages, newMessage]);
      },
      error: (error) => console.error("Subscription error:", error),
    });

    return () => subscription.unsubscribe();
  }, []);

  // const fetchMessages = async () => {
  //   try {
  //     const allMessages = {};
  //     //const unreadCount = {};

  //     for (const kid of kids) {
  //       const variables = {
  //         filter: {
  //           receiverIDs: { eq: kid.id },
  //           //isRead: { eq: false },
  //           // or: [{ senderID: { eq: kid.id } }, { receiverIDs: { eq: kid.id } }],
  //           // and: [{ isRead: { eq: false } }],
  //         },
  //       };

  //       const response = await API.graphql({
  //         query: listMessages,
  //         variables: variables,
  //       });

  //       const kidAllMessages = response.data.listMessages.items;
  //       //unreadCount[kid.id] = kidUnreadMessages.length;
  //       allMessages[kid.id] = kidAllMessages;
  //     }

  //     setAllMessages(allMessages);
  //     //setUnreadCountMessages(unreadCount);
  //   } catch (error) {
  //     console.error("Error fetching messages:", error);
  //   }
  // };

  // const fetchMessageData = async () => {
  //   await fetchMessages();
  // };

  // useEffect(() => {
  //   if (kids) {
  //     fetchMessageData();
  //   }
  // }, [kids]);

  return (
    <MessageContext.Provider value={{ allMessages }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContextProvider;

export const useMessageContext = () => useContext(MessageContext);
