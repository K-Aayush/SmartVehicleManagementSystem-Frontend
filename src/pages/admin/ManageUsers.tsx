import { useContext } from "react";
import { AppContext } from "../../context/AppContext";


const ManageUsers = () => {
  const { error, isLoading } =
    useContext(AppContext);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  
  return <div>ManageUsers</div>;
};

export default ManageUsers;
