import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";

import { AllUsersState } from "../../lib/types";
import axios, { AxiosError } from "axios";

const ManageUsers = () => {
  const { error, isLoading, setError, setIsLoading, backendUrl, token } =
    useContext(AppContext);



  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  return <div>ManageUsers</div>;
};

export default ManageUsers;
