import { createContext, useState, useEffect, useContext } from "react";
import { Auth } from "aws-amplify";
import { API, graphqlOperation } from "aws-amplify";
import { listUsers, getUser } from "../graphql/queries";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const sub = authUser?.attributes?.sub;
  const [userEmail, setUserEmail] = useState(null); //authUser?.attributes?.email
  const [loading, setLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true })
      .then((user) => {
        //console.log("execute the authUser");
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
    const response = getUserBySub.data.listUsers.items;
    if (response.length > 0) {
      const userResponse = response[0];

      // if (userResponse.userType === "DRIVER") {
      //   setIsDriver(true);
      // }
      setDbUser(userResponse);
    }
    setLoading(false);
  };

  const getCurrentUserData = async () => {
    const responseGetUser = await API.graphql({
      query: getUser,
      variables: { id: dbUser.id },
    });
    setCurrentUserData(responseGetUser.data.getUser);
  };

  useEffect(() => {
    if (!sub) {
      return;
    }
    listUserFromQl();
  }, [sub]);

  useEffect(() => {
    if (!dbUser) {
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
