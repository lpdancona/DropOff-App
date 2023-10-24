import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import { API } from "aws-amplify";
import { listRoutes, kidsByRouteID, getVan } from "../../src/graphql/queries";

const RouteContext = createContext({});

const RouteContextProvider = ({ children }) => {
  const [routesData, setRoutesData] = useState(null);
  const [currentRouteData, setCurrentRouteData] = useState(null);
  const { dbUser, isDriver, currentUserData } = useAuthContext();

  const handleLogout = async () => {
    try {
      // Sign out the user using Amplify Auth
      await Auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getRoutesData = async () => {
    try {
      //console.log("isDriver? ", isDriver);
      const variables = {
        filter: {
          or: [
            { status: { eq: "WAITING_TO_START" } },
            { status: { eq: "IN_PROGRESS" } }, //status: { eq: "IN_PROGRESS" }, //
          ],
        },
      };

      // Fetch route data
      const responseListRoutes = await API.graphql({
        query: listRoutes,
        variables: variables,
      });
      const routeData = responseListRoutes.data.listRoutes.items;

      // Fetch kids data for each route
      const mergedData = await Promise.all(
        routeData.map(async (route) => {
          const responseKidsByRouteID = await API.graphql({
            query: kidsByRouteID,
            variables: { routeID: route.id },
          });
          const kidsData = responseKidsByRouteID.data.kidsByRouteID.items;
          // fetch the van
          const responseGetVan = await API.graphql({
            query: getVan,
            variables: { id: route.routeVanId },
          });
          const vansData = responseGetVan.data.getVan;

          return { ...route, Kid: kidsData, Van: vansData };
        })
      );

      setRoutesData(mergedData);
      return true;
    } catch (error) {
      console.error("Error fetching data getROutesData: ", error);
    }
    return false;
  };
  const checkStaffInRoutes = () => {
    //console.log("current user ", currentUserData);

    if (routesData && isDriver) {
      const roleToCheck = isDriver ? "driver" : "helper";

      const routeWithMatchingRole = routesData.find((item) => {
        if (item[roleToCheck] && item[roleToCheck] === dbUser.id) {
          return true;
        }
        return false;
      });

      if (routeWithMatchingRole) {
        // Update the state variable with the route that has matching role
        setCurrentRouteData(routeWithMatchingRole);
        return true;
      } else {
        // Handle case when no matching route is found
        console.log(
          `No route found for ${roleToCheck} with user ID ${dbUser.id}`
        );
      }
    }
    return false;
  };

  useEffect(() => {
    // Fetch initial data when the component mounts
    const fetchInitialData = async () => {
      await getRoutesData();
    };

    fetchInitialData();
  }, [dbUser]);

  useEffect(() => {
    if (routesData) {
      const isUserOnRoute = checkStaffInRoutes();
      if (!isUserOnRoute) {
        handleLogout();
      }
      //checkStaffInRoutes();
      //console.log("current route ", currentRouteData);
    }
  }, [routesData]);

  return (
    <RouteContext.Provider
      value={{
        routesData,
        currentRouteData,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

export default RouteContextProvider;

export const useRouteContext = () => useContext(RouteContext);
