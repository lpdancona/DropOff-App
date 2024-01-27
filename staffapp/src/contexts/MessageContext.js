import { createContext, useContext, useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { onCreateMessage, onUpdateMessage } from "../graphql/subscriptions";
import { listMessages } from "../graphql/queries";

const MessageContext = createContext({});

const MessageContextProvider = ({ children }) => {
  const [allMessages, setAllMessages] = useState({});

  useEffect(() => {
    const fetchMessages = async () => {
      try {
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

    const updateSubscription = API.graphql(
      graphqlOperation(onUpdateMessage)
    ).subscribe({
      next: ({ provider, value }) => {
        //console.log("messages db updated!", value);
        const updatedMessage = value.data.onUpdateMessage;
        setAllMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === updatedMessage.id ? updatedMessage : msg
          )
        );
      },
      error: (error) => console.error("Update Subscription error:", error),
    });

    fetchMessages();

    return () => {
      subscription.unsubscribe();
      updateSubscription.unsubscribe();
    };
  }, []);

  return (
    <MessageContext.Provider value={{ allMessages }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContextProvider;

export const useMessageContext = () => useContext(MessageContext);
