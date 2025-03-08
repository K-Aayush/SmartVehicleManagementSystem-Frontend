import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import ViewUserTable from "../../components/admin/ViewUserTable";

const ManageUsers = () => {
  const { error, isLoading, allUsers } = useContext(AppContext);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 mx-4">
      {Object.entries(allUsers).map(([role, users]) => (
        <div key={role}>
          <h2 className="my-4 text-lg font-bold">{role} Users</h2>
          <ViewUserTable users={users} />
        </div>
      ))}
    </div>
  );
};

export default ManageUsers;
