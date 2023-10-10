import { createContext, useState, useEffect, useContext } from "react";
//import { DataStore } from 'aws-amplify';
import { Auth } from "aws-amplify";
import { User } from "../models";
import { API, graphqlOperation } from "aws-amplify";
import { listUsers, getUser } from "../graphql/queries";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const sub = authUser?.attributes?.sub;
  const [userEmail, setUserEmail] = useState(null); //authUser?.attributes?.email
  //const [isEmailVerified, setIsEmailVerified] = useState(false); //authUser?.attributes?.email_verified
  const [userPassword, setUserPassword] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDriver, setIsDriver] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);

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
    if (response.userType === "DRIVER") {
      setIsDriver(true);
    }
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

  return (
    <AuthContext.Provider
      value={{
        authUser,
        dbUser,
        sub,
        setDbUser,
        userEmail,
        userPassword,
        loading,
        isDriver,
        currentUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
