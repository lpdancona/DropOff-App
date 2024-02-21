import { createContext, useContext, useEffect, useState } from "react";
import { API } from "aws-amplify";
import { listKids, getUser } from "../graphql/queries";
import { usePicturesContext } from "./PicturesContext";

const KidsContext = createContext({});

const KidsContextProvider = ({ children }) => {
  //const [loading, setLoading] = useState(true);
  const [kids, setKids] = useState([]);
  const { getPhotoInBucket } = usePicturesContext();

  const fetchKidsData = async () => {
    try {
      const response = await API.graphql({ query: listKids });
      const fetchedKids = response.data.listKids.items;
      //console.log("fetchedKids", fetchedKids);

      const kidsWithPhotos = await Promise.all(
        fetchedKids.map(async (kid) => {
          if (kid.Parent1ID !== null) {
            const parent1Data = await API.graphql({
              query: getUser,
              variables: { id: kid.Parent1ID },
            });
            kid.Parent1 = parent1Data.data.getUser;
          }

          if (kid.Parent2ID !== null) {
            const parent2Data = await API.graphql({
              query: getUser,
              variables: { id: kid.Parent2ID },
            });
            kid.Parent2 = parent2Data.data.getUser;
          }
          if (kid.photo) {
            const uriKid = await getPhotoInBucket(kid.photo);
            return { ...kid, uriKid };
          } else {
            return kid;
          }
        })
      );
      //console.log("kids with photos", kidsWithPhotos);

      setKids(kidsWithPhotos);
    } catch (error) {
      console.error("Error fetching kids data", error);
    }
  };

  useEffect(() => {
    console.log("trying to fetchKidsData");
    fetchKidsData();
  }, []);

  // // Check if all necessary data has been fetched, then set loading to false
  // useEffect(() => {
  //   if (kids) {
  //     setLoading(false);
  //   }
  // }, [kids]);

  return (
    <KidsContext.Provider value={{ kids }}>{children}</KidsContext.Provider>
  );
};

export default KidsContextProvider;

export const useKidsContext = () => useContext(KidsContext);
