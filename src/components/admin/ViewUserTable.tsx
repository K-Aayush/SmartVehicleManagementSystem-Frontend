import { userDataProps } from "../../lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface viewUserTableProps {
  users: userDataProps[];
}

const ViewUserTable = ({ users }: viewUserTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table className="w-full border border-gray-200">
        <TableHeader>
          <TableRow className="bg-gray-800">
            <TableHead className="text-left">ID</TableHead>
            <TableHead className="text-left">Name</TableHead>
            <TableHead className="text-left">Email</TableHead>
            <TableHead className="text-left">Phone</TableHead>
            <TableHead className="text-left">Company Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user: userDataProps) => (
              <TableRow key={user.id} className="border-t border-gray-200">
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.companyName || "N/A"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="py-4 text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ViewUserTable;
