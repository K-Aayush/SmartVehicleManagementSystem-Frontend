import { createContext } from "react";

//Type of AppContext
interface AppContextType {
  backendUrl: string;
}

const defaultValue: AppContextType = {
  backendUrl: "",
};

export const AppContext = createContext<AppContextType>(defaultValue);
