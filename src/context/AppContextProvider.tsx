import { useState } from "react";
import { AppContext } from "./AppContext";
import { userDataProps } from "../lib/types";

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<userDataProps[]>([]);

  const value = {
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
