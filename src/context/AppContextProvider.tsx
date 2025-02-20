import { useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import { authResponse, tokenCheck, userDataProps } from "../lib/types";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { registerFormData } from "../lib/validator";

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  //loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //get token
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [userData, setUserData] = useState<userDataProps | null>(null);
  const [userRole, setUserRole] = useState<string | null>(
    localStorage.getItem("role")
  );


  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const { data } = await axios.get<tokenCheck>(
            `${backendUrl}/api/auth/me`,
            { headers: { Authorization: token } }
          );

          if (data.success) {
            setUserData(data.user);
            setUserRole(data.user.role);
          } else {
            toast.error(data.message);
            logout();
          }
        } catch (error) {
          console.error("User data fetch error:", error);
          logout();
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [token]);

  //registerform
  const registerUser = async (userData: registerFormData) => {
    setIsLoading(true);
    try {
      //creating new formdata
      const formData = new FormData();

      //append each formData
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("phone", userData.phone);
      formData.append("role", userData.role);
      formData.append("profileImage", userData.profileImage);

      if (userData.role === "VENDOR" && userData.companyName) {
        formData.append("companyName", userData.companyName);
      }

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
        localStorage.setItem("role", data.user.role);
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

  //Logout function
  const logout = () => {
    setToken(null);
    setUserData(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const value = {
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    isLoading,
    setIsLoading,
    registerUser,
    logout,
    userRole,
    setUserRole,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
