import { useState } from "react";
import { AppContext } from "./AppContext";
import { authResponse, registerFormData, userDataProps } from "../lib/types";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  //loading state
  const [loading, setIsLoading] = useState<boolean>(false);

  //get token
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<userDataProps | null>(null);

  //registerform
  const registerUser = async (userData: registerFormData) => {
    setIsLoading(true);
    try {
      //creating new formdata
      const formData = new FormData();

      //append each formData
      Object.entries(userData).forEach(([Key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(Key, value);
        }
      });

      //calling register api
      const { data } = await axios.post<authResponse>(
        backendUrl + "/api/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        console.log(data);
        setUserData(data.user);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);

        if (data.user.role === "USER") {
          navigate("/user/dashboard");
        } else if (data.user.role === "VENDOR") {
          navigate("/vendor/dashboard");
        } else if (data.user.role === "SERVICE_PROVIDER") {
          navigate("/service-provider/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      //Error handling
      if (error instanceof AxiosError && error.response) {
        //400, 401 or 500 error
        toast.error(error.response.data.message);
      } else if (error instanceof Error) {
        //unexpected error
        toast.error(error.message || "An error occured while registering");
      } else {
        toast.error("Internal Server Error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loading,
    setIsLoading,
    registerUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
