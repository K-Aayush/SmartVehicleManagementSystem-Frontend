import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import ViewUserTable from "../../components/admin/ViewUserTable";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const ManageUsers = () => {
  const { error, isLoading, allUsers } = useContext(AppContext);
  const [selectedRole, setSelectedRole] =
    useState<keyof typeof allUsers>("TOTAL");

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 mx-4">
      <Select
        defaultValue={selectedRole}
        onValueChange={(value) =>
          setSelectedRole(value as keyof typeof allUsers)
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue>
            {selectedRole === "TOTAL" ? "All Users" : selectedRole}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="TOTAL">All Users</SelectItem>
            <SelectItem value="USER">Customers</SelectItem>
            <SelectItem value="VENDOR">Vendors</SelectItem>
            <SelectItem value="SERVICE_PROVIDER">Mechanics</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="mt-4">
        <ViewUserTable users={allUsers[selectedRole]} />
      </div>
    </div>
  );
};

export default ManageUsers;
