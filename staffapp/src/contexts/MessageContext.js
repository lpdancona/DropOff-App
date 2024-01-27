import { createContext, useContext, useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { onCreateMessage } from "../graphql/subscriptions";
import { listMessages } from "../graphql/queries";
//import { useKidsContext } from "./AuthContext";

const MessageContext = createContext({});

const MessageContextProvider = ({ children }) => {
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

  // useEffect(() => {
  //   // Subscribe to new messages
  //   const subscription = API.graphql({ query: onCreateMessage }).subscribe({
  //     next: ({ value }) => {
  //       const newMessage = value.data.onCreateMessage;
  //       const receiverID = newMessage.receiverIDs;

  //       setAllMessages((prevMessages) => {
  //         // Create a copy of the previous messages
  //         const updatedMessages = { ...prevMessages };

  //         // Check if the receiverID exists in the messages
  //         if (updatedMessages[receiverID]) {
  //           // Update the array for the specific receiverID
  //           updatedMessages[receiverID] = [
  //             ...updatedMessages[receiverID],
  //             newMessage,
  //           ];
  //         } else {
  //           // Create a new array for the receiverID
  //           updatedMessages[receiverID] = [newMessage];
  //         }

  //         return updatedMessages;
  //       });
  //     },
  //   });

  //   // Cleanup subscription on component unmount
  //   return () => subscription.unsubscribe();
  // }, []);

  return (
    <MessageContext.Provider value={{ allMessages }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContextProvider;

export const useMessageContext = () => useContext(MessageContext);
