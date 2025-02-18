import { createContext } from "react";
import { userDataProps } from "../lib/types";

//Type of AppContext
interface AppContextType {
  backendUrl: string;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  userData: userDataProps | null;
  setUserData: React.Dispatch<React.SetStateAction<userDataProps | null>>;
}

const defaultValue: AppContextType = {
  backendUrl: "",
  token: "",
  setToken: () => {},
  userData: null,
  setUserData: () => {},
};

export const AppContext = createContext<AppContextType>(defaultValue);
