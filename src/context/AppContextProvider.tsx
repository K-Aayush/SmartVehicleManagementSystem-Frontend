import { useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import {
  AllUsersState,
  authResponse,
  tokenCheck,
  userDataProps,
} from "../lib/types";
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
  const [error, setError] = useState<string | null>("");

  //get token
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [userData, setUserData] = useState<userDataProps | null>(null);
  const [products, setProducts] = useState([]);

  //get all users states
  const [allUsers, setAllUsers] = useState<AllUsersState>({
    TOTAL: [],
    USER: [],
    VENDOR: [],
    SERVICE_PROVIDER: [],
  });

  //fetching all users
  const fetchAllUsers = async (role = "") => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/getAllUsers`, {
        params: { role },
        headers: {
          Authorization: token,
        },
      });
      if (data.success) {
        setAllUsers((prev) => ({
          ...prev,
          [role || "TOTAL"]: data.users,
        }));
      } else {
        setError(data.message);
      }
    } catch (error) {
      //Axios error
      if (error instanceof AxiosError && error.response) {
        setError(error.response.data.message);
      } else if (error instanceof Error) {
        setError(error.message || "An error occoured while fetching data");
      } else {
        setError("Internal Server Error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers("");
    fetchAllUsers("USER");
    fetchAllUsers("VENDOR");
    fetchAllUsers("SERVICE_PROVIDER");
  }, []);

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
  }, [token, backendUrl]);

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

  //fetch products
  useEffect(() => {
    const fetchProducts = async (sortBy = "createdAt", order = "desc") => {
      // setBusiness(PopularBusinessList);
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${backendUrl}/api/vendor/getProducts?sortBy=${sortBy}&order=${order}`
        );

        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error("Error Fetching Products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [backendUrl]);

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
    error,
    setError,
    allUsers,
    setAllUsers,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
