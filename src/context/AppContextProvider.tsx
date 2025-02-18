import { AppContext } from "./AppContext";

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const value = {
    backendUrl,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
