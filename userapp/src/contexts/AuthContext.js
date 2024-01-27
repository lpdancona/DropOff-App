import { createContext, useState, useEffect, useContext } from "react";
import { Auth } from "aws-amplify";
import { API } from "aws-amplify";
import { listUsers, listKids, getUser } from "../graphql/queries";
import { usePushNotificationsContext } from "./PushNotificationsContext";
import { usePicturesContext } from "./PicturesContext";
import { updateUser } from "../graphql/mutations";
import { useNavigation } from "@react-navigation/native";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const sub = authUser?.attributes?.sub;
  const [userEmail, setUserEmail] = useState(null);
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState(null);
  const { expoPushToken } = usePushNotificationsContext();
  const { getPhotoInBucket } = usePicturesContext();
  const navigation = useNavigation();

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true })
      .then((user) => {
        setAuthUser(user);
        setUserEmail(user.attributes.email);
      })
      .catch((error) => {
        console.error("Error fetching authenticated user:", error);
      });
  }, []);

  const listUserFromQl = async () => {
    const getUserBySub = await API.graphql({
      query: listUsers,
      variables: { filter: { sub: { eq: sub } } },
    });
    const response = getUserBySub.data.listUsers.items[0];
    setDbUser(response);
    setLoading(false);
  };
  const updatePushToken = async (id, updatedPushToken) => {
    try {
      const userDetails = {
        id: id,
        pushToken: updatedPushToken,
      };
      const updatedUser = await API.graphql({
        query: updateUser,
        variables: { input: userDetails },
      });
    } catch (error) {
      console.log("error updating token", error);
    }
  };
  const getCurrentUserData = async () => {
    // get current user data and check the expoPushToken
    const responseGetUser = await API.graphql({
      query: getUser,
      variables: { id: dbUser.id },
    });
    if (expoPushToken) {
      //console.log(expoPushToken);
      const actualPushToken = responseGetUser.data.getUser.pushToken;
      if (actualPushToken !== expoPushToken.data || actualPushToken === null) {
        await updatePushToken(
          responseGetUser.data.getUser.id,
          expoPushToken.data
        );
      }
    }
    setCurrentUserData(responseGetUser.data.getUser);
  };

  const fetchKidsData = async (userEmail) => {
    if (userEmail) {
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
        const fetchedKids = response.data.listKids.items;
        //console.log(fetchedKids);

        if (fetchedKids.length === 0) {
          navigation.navigate("Wait");
          //await Auth.signOut();
        } else {
          const kidsWithPhotos = await Promise.all(
            fetchedKids.map(async (kid) => {
              if (kid.photo) {
                const uriKid = await getPhotoInBucket(kid.photo);
                return { ...kid, uriKid };
              } else {
                return kid;
              }
            })
          );

          // Set the kids state if there is data
          setKids(kidsWithPhotos);
        }
        // setKids(response.data.listKids.items);
      } catch (error) {
        console.error("Error fetching kids:", error);
      } finally {
        //setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!sub) {
      return;
    }
    listUserFromQl();
  }, [sub]);

  useEffect(() => {
    //console.log(dbUser);
    if (dbUser) {
      getCurrentUserData();
    }
  }, [dbUser]);

  useEffect(() => {
    fetchKidsData(userEmail);
    //console.log(isEmailVerified);
  }, [userEmail]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        dbUser,
        setDbUser,
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
