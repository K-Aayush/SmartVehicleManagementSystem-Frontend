import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import ViewUserCard from "../../components/admin/ViewUserCard";
import { TotalUsersState } from "../../lib/types";
import axios, { AxiosError } from "axios";

const ViewAdminDashboard = () => {
  const { error, isLoading, setError, setIsLoading, backendUrl, token } =
    useContext(AppContext);

  //get all users states
  const [totalUsers, setTotalUsers] = useState<TotalUsersState>({
    TOTAL: 0,
    USER: 0,
    VENDOR: 0,
    SERVICE_PROVIDER: 0,
  });

  const fetchTotalUsers = async (role = "") => {
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
        setTotalUsers((prev) => ({
          ...prev,
          [role || "TOTAL"]: data.totalUsers,
        }));
        console.log(data.totalUsers);
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
    fetchTotalUsers("");
    fetchTotalUsers("USER");
    fetchTotalUsers("VENDOR");
    fetchTotalUsers("SERVICE_PROVIDER");
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 gap-3 mx-4 md:grid-cols-2 lg:grid-cols-3">
      <ViewUserCard totalUsers={totalUsers.TOTAL} title="Total Users" />
      <ViewUserCard totalUsers={totalUsers.USER} title="Total Customers" />
      <ViewUserCard totalUsers={totalUsers.VENDOR} title="Total Vendors" />
      <ViewUserCard
        totalUsers={totalUsers.SERVICE_PROVIDER}
        title="Total Mechanics"
      />
    </div>
  );
};

export default ViewAdminDashboard;
