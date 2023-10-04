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
  const [isEmailVerified, setIsEmailVerified] = useState(false); //authUser?.attributes?.email_verified
  const [userPassword,setUserPassword ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true })
      .then((user) => {
        setAuthUser(user);
        setIsEmailVerified(user.attributes.email_verified);
        setUserEmail(user.attributes.email);
        // Assuming that user.attributes.sub is the unique identifier for the user
        //setUserPassword(user.attributes.sub);
      })
      .catch((error) => {
        console.error('Error fetching authenticated user:', error);
      });
  }, [authUser]);


  // useEffect(() => {
  //   Auth.currentAuthenticatedUser({ bypassCache: true }).then(setAuthUser);
  // },[]);

  // useEffect(() => {
  //   if (isEmailVerified) {
  //     setUserEmail(authUser?.attributes?.email)
  //     setUserPassword()
  //   }
  // },[authUser]);

  useEffect(() => {
    if (!sub){return}
    
    DataStore.query(User, (user) => user.sub.eq(sub)).then(
      (users) => {
        setDbUser(users[0]);
        setLoading(false);
      }
    );
  },[sub]);


  return (
    <AuthContext.Provider value={{ authUser, dbUser, sub, setDbUser, userEmail, userPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);