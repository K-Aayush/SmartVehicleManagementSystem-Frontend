import { createContext } from "react";
import { AllUsersState, userDataProps } from "../lib/types";
import { registerFormData } from "../lib/validator";

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
  logout: () => void;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  allUsers: AllUsersState;
  setAllUsers: React.Dispatch<React.SetStateAction<AllUsersState>>;

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
  logout: () => {},
  error: "",
  setError: () => {},
  allUsers: { TOTAL: [], USER: [], SERVICE_PROVIDER: [], VENDOR: [] },
  setAllUsers: () => {},

};

export const AppContext = createContext<AppContextType>(defaultValue);
