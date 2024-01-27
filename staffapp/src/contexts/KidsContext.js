import { createContext, useContext, useEffect, useState } from "react";
import { API } from "aws-amplify";
import { listKids } from "../graphql/queries";
import { usePicturesContext } from "./PicturesContext";

const KidsContext = createContext({});

const KidsContextProvider = ({ children }) => {
  const [kids, setKids] = useState([]);
  const { getPhotoInBucket } = usePicturesContext();

  const fetchKidsData = async () => {
    try {
      const response = await API.graphql({ query: listKids });
      const fetchedKids = response.data.listKids.items;
      //console.log("fetchedKids", fetchedKids);

      const kidsWithPhotos = await Promise.all(
        fetchedKids.map(async (kid) => {
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
    fetchKidsData();
  }, []);

  return (
    <KidsContext.Provider value={{ kids }}>{children}</KidsContext.Provider>
  );
};

export default KidsContextProvider;

export const useKidsContext = () => useContext(KidsContext);
