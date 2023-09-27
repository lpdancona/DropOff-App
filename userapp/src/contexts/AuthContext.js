import { createContext, useState, useEffect, useContext } from "react";
import { DataStore } from 'aws-amplify';
import { Auth } from 'aws-amplify'; 
import { User, Kid } from '../models';

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const sub = authUser?.attributes?.sub;
  const [userEmail, setUserEmail] = useState(null); //authUser?.attributes?.email
  const isEmailVerified = authUser?.attributes?.email_verified
  const [isParent,setIsParent] = useState(false)
  const [kids, setKids] = useState([]);
  
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

  useEffect(() => {
    const fetchData = async () => {
      if (userEmail) {
        //console.log(userEmail.toString())
        const queryResult = await DataStore.query(Kid, (s) =>
          s.or(s => [
            s.parent1Email.eq(userEmail),
            s.parent2Email.eq(userEmail)
          ])
        );
        
        // Assuming queryResult is an array, you can check if it contains any items
        if (queryResult.length > 0) {
          setIsParent(true);
          setKids(queryResult)
        }
        
        // You can also log the queryResult if needed
        //console.log(queryResult);
      }
    };

    fetchData();
  }, [userEmail]);

  return (
    <AuthContext.Provider value={{ authUser, dbUser, sub, setDbUser, userEmail, isParent, kids }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);