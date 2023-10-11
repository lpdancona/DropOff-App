import { createContext, useState, useEffect, useContext } from "react";
//import { DataStore } from 'aws-amplify';
//import { User, Kid } from '../models';
import { Auth } from "aws-amplify";
import { API, graphqlOperation } from "aws-amplify";
import { listUsers, listKids, getUser } from "../graphql/queries";
import { usePushNotificationsContext } from "./PushNotificationsContext";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const sub = authUser?.attributes?.sub;
  const [userEmail, setUserEmail] = useState(null); //authUser?.attributes?.email
  //const [isEmailVerified, setIsEmailVerified] = useState(false); //authUser?.attributes?.email_verified
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState(null);
  const { expoPushToken } = usePushNotificationsContext();

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true })
      .then((user) => {
        setAuthUser(user);
        //setIsEmailVerified(user.attributes.email_verified);
        setUserEmail(user.attributes.email);
        // Assuming that user.attributes.sub is the unique identifier for the user
        //setUserPassword(user.attributes.sub);
      })
      .catch((error) => {
        console.error("Error fetching authenticated user:", error);
      });
  }, [authUser]);

  const listUserFromQl = async () => {
    //console.log('sub', sub)
    const getUserBySub = await API.graphql({
      query: listUsers,
      variables: { filter: { sub: { eq: sub } } },
    });
    //graphqlOperation(listUsers))
    const response = getUserBySub.data.listUsers.items[0];
    //console.log('getUserBysub', response[0])
    //console.log(response)
    setDbUser(response);
    setLoading(false);
  };

  const getCurrentUserData = async () => {
    const responseGetUser = await API.graphql({
      query: getUser,
      variables: { id: dbUser.id },
    });
    //const userData =
    setCurrentUserData(responseGetUser.data.getUser);
  };

  useEffect(() => {
    if (!sub) {
      return;
    }
    listUserFromQl();
  }, [sub]);

  useEffect(() => {
    if (!sub) {
      return;
    }
    getCurrentUserData();
  }, [dbUser]);

  useEffect(() => {
    console.log(expoPushToken.data);
  }, [currentUserData]);

  useEffect(() => {
    const fetchData = async () => {
      if (userEmail) {
        //console.log(userEmail);
        try {
          const variables = {
            filter: {
              or: [
                { parent1Email: { eq: userEmail } },
                { parent2Email: { eq: userEmail } },
              ],
            },
          };
          const response = await API.graphql({
            query: listKids,
            variables: variables,
          });
          //console.log(response)
          const fetchedKids = response.data.listKids.items;

          //console.log(fetchedKids);

          if (fetchedKids.length === 0) {
            // If the response is empty, sign out
            await Auth.signOut();
          } else {
            // Set the kids state if there is data
            setKids(fetchedKids);
          }
          // setKids(response.data.listKids.items);
        } catch (error) {
          console.error("Error fetching kids:", error);
        } finally {
          //setLoading(false);
        }
      }
    };
    fetchData();
    //console.log(isEmailVerified);
  }, [userEmail]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        dbUser,
        sub,
        userEmail,
        kids,
        loading,
        currentUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
