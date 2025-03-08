import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import ViewUserTable from "../../components/admin/ViewUserTable";

const ManageUsers = () => {
  const { error, isLoading } = useContext(AppContext);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <ViewUserTable />
    </div>
  );
};

export default ManageUsers;
