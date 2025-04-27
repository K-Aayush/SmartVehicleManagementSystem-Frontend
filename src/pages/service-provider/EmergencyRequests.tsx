import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface EmergencyRequest {
  id: string;
  userId: string;
  vehicleId: string;
  assistanceType: string;
  description: string;
  status: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  user: {
    name: string;
    phone: string;
  };
  vehicle: {
    brand: string;
    model: string;
    year: number;
  };
  distance?: number;
}

const EmergencyRequests = () => {
  const { token, backendUrl } = useContext(AppContext);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/emergency/provider-requests`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load emergency requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/emergency/accept/${requestId}`,
        {},
        { headers: { Authorization: token } }
      );

      if (response.data.success) {
        toast.success("Emergency request accepted");

        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === requestId ? { ...req, status: "INPROGRESS" } : req
          )
        );
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request");
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/emergency/complete/${requestId}`,
        {},
        { headers: { Authorization: token } }
      );

      if (response.data.success) {
        toast.success(`Completed Emergency Request`);

        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === requestId ? { ...req, status: "COMPLETED" } : req
          )
        );
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      toast.error("Failed to update request status");
    }
  };

  const filteredRequests =
    filter === "ALL"
      ? requests
      : requests.filter((req) => req.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Emergency Requests</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Requests</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="INPROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Emergency Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-4 space-y-2 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {request.user.name} - {request.assistanceType}
                  </h3>
                  <Badge>{request.status}</Badge>
                </div>
                <p>
                  Vehicle: {request.vehicle.year} {request.vehicle.brand}{" "}
                  {request.vehicle.model}
                </p>
                <p className="text-sm text-muted-foreground">
                  {request.description}
                </p>
                <p className="text-sm">
                  Distance: {request.distance?.toFixed(2)}km away
                </p>
                <div className="flex gap-2 mt-2">
                  {request.status === "INPROGRESS" && (
                    <Button onClick={() => handleCompleteRequest(request.id)}>
                      Complete Request
                    </Button>
                  )}

                  {request.status === "PENDING" && (
                    <Button
                      className="bg-green-600"
                      onClick={() => handleAcceptRequest(request.id)}
                    >
                      Accept Request
                    </Button>
                  )}
                  <Button variant="outline" asChild>
                    <Link
                      to={`/service-provider/chat?userId=${request.userId}`}
                    >
                      Chat with User
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
            {filteredRequests.length === 0 && (
              <p className="text-center text-muted-foreground">
                No emergency requests found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyRequests;
