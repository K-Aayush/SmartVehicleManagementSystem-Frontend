import { createContext } from "react";
import { registerFormData, userDataProps } from "../lib/types";

//Type of AppContext
interface AppContextType {
  backendUrl: string;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  userData: userDataProps | null;
  setUserData: React.Dispatch<React.SetStateAction<userDataProps | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  registerUser: (userData: registerFormData) => void;
}

const defaultValue: AppContextType = {
  backendUrl: "",
  token: "",
  setToken: () => {},
  userData: null,
  setUserData: () => {},
  isLoading: false,
  setIsLoading: () => {},
  registerUser: () => {},
};

export const AppContext = createContext<AppContextType>(defaultValue);
