import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Loader2, Ban, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  companyName?: string;
  profileImage?: string;
  createdAt: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface UserDetails extends User {
  vehicles?: any[];
  services?: any[];
  products?: any[];
  orders?: any[];
  payment?: any[];
  emergencyRequest?: any[];
}

const ManageUsers = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banLoading, setBanLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/admin/users${
          selectedRole !== "ALL" ? `?role=${selectedRole}` : ""
        }`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/admin/users/${userId}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        setSelectedUser(response.data.user);
        setShowUserDetails(true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details");
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser || !banReason) return;

    try {
      setBanLoading(true);
      const response = await axios.delete(
        `${backendUrl}/api/admin/users/${selectedUser.id}/ban`,
        {
          headers: { Authorization: token },
          data: { reason: banReason },
        }
      );

      if (response.data.success) {
        toast.success("User banned successfully");
        setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
        setShowBanDialog(false);
        setBanReason("");
        setSelectedUser(null);
      }
    } catch (error: any) {
      console.error("Error banning user:", error);
      toast.error(error.response?.data?.message || "Failed to ban user");
    } finally {
      setBanLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Users</CardTitle>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Users</SelectItem>
              <SelectItem value="USER">Customers</SelectItem>
              <SelectItem value="VENDOR">Vendors</SelectItem>
              <SelectItem value="SERVICE_PROVIDER">Service Providers</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.isOnline ? "default" : "secondary"}
                    >
                      {user.isOnline ? "Online" : "Offline"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchUserDetails(user.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowBanDialog(true);
                        }}
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="mt-1">{selectedUser.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="mt-1">{selectedUser.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="mt-1">{selectedUser.phone}</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <p className="mt-1">{selectedUser.role}</p>
                </div>
                {selectedUser.companyName && (
                  <div>
                    <Label>Company</Label>
                    <p className="mt-1">{selectedUser.companyName}</p>
                  </div>
                )}
                <div>
                  <Label>Joined</Label>
                  <p className="mt-1">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Activity Summary */}
              <div className="mt-4">
                <h3 className="mb-2 text-lg font-semibold">Activity Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedUser.role === "VENDOR" && (
                    <>
                      <div>
                        <Label>Total Products</Label>
                        <p className="mt-1">
                          {selectedUser.products?.length || 0}
                        </p>
                      </div>
                      <div>
                        <Label>Total Orders</Label>
                        <p className="mt-1">{selectedUser.orders?.length || 0}</p>
                      </div>
                    </>
                  )}
                  {selectedUser.role === "SERVICE_PROVIDER" && (
                    <>
                      <div>
                        <Label>Total Services</Label>
                        <p className="mt-1">
                          {selectedUser.services?.length || 0}
                        </p>
                      </div>
                      <div>
                        <Label>Emergency Requests</Label>
                        <p className="mt-1">
                          {selectedUser.emergencyRequest?.length || 0}
                        </p>
                      </div>
                    </>
                  )}
                  {selectedUser.role === "USER" && (
                    <>
                      <div>
                        <Label>Total Orders</Label>
                        <p className="mt-1">{selectedUser.orders?.length || 0}</p>
                      </div>
                      <div>
                        <Label>Vehicles Registered</Label>
                        <p className="mt-1">
                          {selectedUser.vehicles?.length || 0}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Ban User Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The user will be permanently removed
              from the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for ban</Label>
              <Input
                id="reason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter reason for banning user"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBanDialog(false);
                setBanReason("");
              }}
              disabled={banLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBanUser}
              disabled={!banReason || banLoading}
            >
              {banLoading ? "Banning..." : "Ban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageUsers;