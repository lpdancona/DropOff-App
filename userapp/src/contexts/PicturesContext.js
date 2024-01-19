import { createContext, useContext } from "react";

const PicturesContext = createContext({});

const PicturesContextProvider = ({ children }) => {
  const savePhotoInBucket = async () => {};

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};
export default PicturesContextProvider;

export const usePicturesContext = () => useContext(PicturesContext);
