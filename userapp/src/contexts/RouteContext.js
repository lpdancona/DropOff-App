import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import { API, graphqlOperation } from "aws-amplify";
import {
  listRoutes,
  kidsByRouteID,
  getVan,
  getUser,
} from "../../src/graphql/queries";
import { useNavigation } from "@react-navigation/native";
import { onUpdateRoute } from "../graphql/subscriptions";
import { USES_DEFAULT_IMPLEMENTATION } from "react-native-maps/lib/decorateMapComponent";

const RouteContext = createContext({});

const RouteContextProvider = ({ children }) => {
  const { kids, dbUser, currentUserData, userEmail } = useAuthContext();
  const [currentRouteData, setCurrentRouteData] = useState(null);
  //const navigation = useNavigation();
  const [routesData, setRoutesData] = useState(null);
  const [noKidsAvailable, setNoKidsAvailable] = useState(false);
  const [dropOffLatLng, setDropLatLng] = useState(null);
  const [dropOffAddress, setDropOffAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [matchingKids, setMatchingKids] = useState(null);
  const [driver, setDriver] = useState(null);
  const [helper, setHelper] = useState(null);
  const [busLocation, setBusLocation] = useState(null);
  const [isRouteInProgress, setIsRouteInProgress] = useState(false);

  const getRoutesData = async () => {
    try {
      const variables = {
        filter: {
          or: [
            { status: { eq: "WAITING_TO_START" } },
            { status: { eq: "IN_PROGRESS" } }, //status: { eq: "IN_PROGRESS" }, //
            { status: { eq: "PAUSED" } }, //status: { eq: "IN_PROGRESS" }, //
          ],
        },
      };

      // Fetch route data
      const responseListRoutes = await API.graphql({
        query: listRoutes,
        variables: variables,
      });
      const routeData = responseListRoutes.data.listRoutes.items;
      if (routeData.length === 0) {
        // alert(
        //   "Hi there, there is no route in progress now! come back later or contact us for more information!"
        // );
        setIsRouteInProgress(false);
        //await navigation.navigate("Wait");
      }

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
    } catch (error) {
      console.error("Error fetching data getROutesData: ", error);
    }
  };
  const checkKidsInRoutes = () => {
    if (kids && routesData) {
      //console.log("routesData", routesData);
      // Find the first route that has at least one kid from the context
      const routeWithMatchingKids = routesData.find((item) => {
        if (item.Kid && Array.isArray(item.Kid)) {
          return item.Kid.some((routeKid) =>
            kids.some((contextKid) => routeKid.id === contextKid.id)
          );
        }
        return false;
      });

      if (routeWithMatchingKids) {
        // Update the state variable with the route that has matching kids
        setCurrentRouteData(routeWithMatchingKids);
        //
        const matchingKidsArray = kids.filter((contextKid) =>
          routeWithMatchingKids.Kid.some(
            (routeKid) => routeKid.id === contextKid.id
          )
        );
        if (matchingKidsArray.length > 0) {
          // Update the state variable with matching kids
          setMatchingKids(matchingKidsArray);

          // Loop through matching kids and extract dropOffAddress and dropOffLatLng
          matchingKidsArray.forEach((matchingKid) => {
            const { dropOffAddress, lat, lng } = matchingKid;
            setDropLatLng({ latitude: lat, longitude: lng });
            setDropOffAddress(dropOffAddress);
          });
        }
        return true;
      }
      return false;
    }
    setNoKidsAvailable(true);
    return false;
  };

  useEffect(() => {
    // Fetch initial data when the component mounts
    if (dbUser && userEmail) {
      const fetchInitialData = async () => {
        await getRoutesData();
        setIsLoading(false); // Set loading to false after data is fetched
      };
      fetchInitialData();
    }
  }, [kids]);

  const getStaffData = async () => {
    if (currentRouteData.driver) {
      const responseGetDriver = await API.graphql({
        query: getUser,
        variables: { id: currentRouteData.driver },
      });
      const driverData = responseGetDriver.data.getUser;
      setDriver(driverData);
    }
    if (currentRouteData.helper) {
      //
      const responseGetHelper = await API.graphql({
        query: getUser,
        variables: { id: currentRouteData.helper },
      });
      const helperData = responseGetHelper.data.getUser;
      setHelper(helperData);
    }
  };

  useEffect(() => {
    if (!currentRouteData) {
      return;
    }
    getStaffData();
  }, [currentRouteData]);

  useEffect(() => {
    // Fetch initial data when the component mounts
    if (routesData) {
      setIsLoading(false); // Set loading to false after data is fetched
    }
  }, [routesData]);

  useEffect(() => {
    if (routesData) {
      // Check kids in routes after fetching initial data
      if (!checkKidsInRoutes()) {
        setIsLoading(false);
        setNoKidsAvailable(true);
        // alert(
        //   `We sorry but, your child ${kids[0].name} is not on any route today!`
        // );
        setIsRouteInProgress(false);
        //navigation.navigate("Wait");
        // handleLogout();
      }
    }
  }, [routesData, kids]);

  useEffect(() => {
    // Update the bus location state when currentRouteData changes
    if (currentRouteData) {
      console.log(currentRouteData);
      const initialBusLocation = {
        latitude: currentRouteData.lat,
        longitude: currentRouteData.lng,
      };

      setBusLocation(initialBusLocation);

      if (currentRouteData.status === "IN_PROGRESS") {
        setIsRouteInProgress(true);
      }
    }
  }, [currentRouteData]);

  useEffect(() => {
    if (!busLocation) {
      return;
    }
    const sub = API.graphql(graphqlOperation(onUpdateRoute)).subscribe({
      next: ({ value }) => {
        if (value.status !== "IN_PROGRESS") {
          setIsRouteInProgress(false);
        } else if (value.status === "IN_PROGRESS") {
          setIsRouteInProgress(true);
        }
        const newBusLocation = {
          latitude: value.data.onUpdateRoute.lat,
          longitude: value.data.onUpdateRoute.lng,
        };
        if (
          newBusLocation.latitude !== busLocation.lat ||
          newBusLocation.longitude !== busLocation.lng
        ) {
          setBusLocation(newBusLocation);
        }
      },
      error: (error) => {
        console.error("Subscription Error:", error);
      },
    });

    return () => {
      // Cleanup subscription on component unmount
      sub.unsubscribe();
    };
  }, [busLocation]);

  return (
    <RouteContext.Provider
      value={{
        routesData,
        dropOffLatLng,
        dropOffAddress,
        currentRouteData,
        noKidsAvailable,
        matchingKids,
        driver,
        helper,
        checkKidsInRoutes,
        busLocation,
        isLoading,
        isRouteInProgress,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

export default RouteContextProvider;

export const useRouteContext = () => useContext(RouteContext);
