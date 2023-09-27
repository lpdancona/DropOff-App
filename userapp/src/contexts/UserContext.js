import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import { DataStore } from 'aws-amplify';
// import { Auth } from 'aws-amplify'; 
// import { User } from '../models';

const UserContext = createContext({});
const { isParent } = useAuthContext();
const [kids, setKids] = useState(null);

const UserContextProvider = ({children}) => {
    
  
  useEffect(() => {
    fetchData();
  }, [isParent]);

  const fetchData = async () => {
    try {
      const kidsData = await DataStore.query(Kid, (k) =>
        k.or(k => 
        [
          k.parent1Email.eq(userEmail),
          k.parent2Email.eq(userEmail)
        ])
      );
      setKids(kidsData);
    } catch (error) {
      console.error("Error fetching kids' names:", error);
    }
  };

  
  return (
    <UserContext.Provider value={{ kids }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

export const useUserContext = () => useContext(UserContext);