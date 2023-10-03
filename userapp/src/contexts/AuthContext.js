import { createContext, useState, useEffect, useContext } from "react";
import { DataStore } from 'aws-amplify';
import { Auth } from 'aws-amplify'; 
import { User, Kid } from '../models';
import { API, graphqlOperation } from 'aws-amplify';
import { listUsers } from '../../queries'

const AuthContext = createContext({});

const AuthContextProvider = ({children}) => {
  const [authUser, setAuthUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const sub = authUser?.attributes?.sub;
  const [userEmail, setUserEmail] = useState(null); //authUser?.attributes?.email
  const [isEmailVerified, setIsEmailVerified] = useState(false); //authUser?.attributes?.email_verified
  const [isParent,setIsParent] = useState(false)
  const [kids, setKids] = useState([]);
  const [userPassword,setUserPassword ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Auth.currentAuthenticatedUser({ bypassCache: true })
      .then((user) => {
        setAuthUser(user);
        setIsEmailVerified(user.attributes.email_verified);
        setUserEmail(user.attributes.email);
        // Assuming that user.attributes.sub is the unique identifier for the user
        setUserPassword(user.attributes.sub);
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
    // const gRoute = await API.graphql(graphqlOperation(listRoutes.items));
    // setDbRoute(gRoute);
  const listUserFromQl = async () =>{
    const listUsers = await API.graphql(graphqlOperation(listUsers));
    setDbUser(listUsers)
    
  }

  useEffect(() => {
    if (!sub){return}
    listUserFromQl();
  
    // DataStore.query(User, (user) => user.sub.eq(sub)).then(
    //   (users) => {
    //     setDbUser(users[0]);
    //     setLoading(false);
    //   }
    // );
    console.log('dbUser',dbUser);
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
  }, [isEmailVerified, userEmail]);

  return (
    <AuthContext.Provider value={{ authUser, dbUser, sub, setDbUser, userEmail, isParent, kids, userPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(AuthContext);