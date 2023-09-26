import { createContext, useState, useEffect, useContext } from "react";
import { DataStore } from 'aws-amplify';
import { Auth } from 'aws-amplify'; 
import { User } from '../models';

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const sub = authUser?.attributes?.sub;
  const [userEmail, setUserEmail] = useState(null); //authUser?.attributes?.email
  const isEmailVerified = authUser?.attributes?.email_verified

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true }).then(setAuthUser);
    //console.log(authUser.attributes.email);
  },[]);

  useEffect(() => {
    if (isEmailVerified) {
      setUserEmail(authUser?.attributes?.email)
    }
  },[authUser]);

  useEffect(() => {
    DataStore.query(User, (user) => user.sub.eq(sub)).then((users) => 
      setDbUser(users[0])
    );
  },[sub]);
  
  return (
    <AuthContext.Provider value={{ authUser, dbUser, sub, setDbUser, userEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);