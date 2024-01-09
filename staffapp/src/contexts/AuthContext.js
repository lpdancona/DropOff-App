import { createContext, useState, useEffect, useContext } from "react";
import { Auth } from "aws-amplify";
import { API } from "aws-amplify";
import { listUsers, getUser } from "../graphql/queries";
import { Modal, View, Text, TouchableOpacity } from "react-native";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const sub = authUser?.attributes?.sub;
  const [userEmail, setUserEmail] = useState(null); //authUser?.attributes?.email
  const [loading, setLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [showParentModal, setShowParentModal] = useState(false);

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
      if (userResponse.userType === "PARENT") {
        setShowParentModal(true);
      } else {
        setDbUser(userResponse);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const getCurrentUserData = async () => {
    const responseGetUser = await API.graphql({
      query: getUser,
      variables: { id: dbUser.id },
    });
    setCurrentUserData(responseGetUser.data.getUser);
  };

  const handleCloseParentModal = () => {
    // Close the modal and navigate back to the login screen
    setShowParentModal(false);
    Auth.signOut()
      .then(() => {})
      .catch((error) => {
        console.error("Error signing out:", error);
      });
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={showParentModal}
        onRequestClose={handleCloseParentModal}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: "blue",
            }}
          >
            <Text>
              Dear Parent, this app is for our After School Staff. Please
              download the ASP drop-off user.
            </Text>
            <TouchableOpacity
              onPress={handleCloseParentModal}
              style={{
                marginTop: 20,
                backgroundColor: "blue",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);
