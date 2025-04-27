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
import ServiceProviderMap from "../../components/map/ServiceProviderMap";
import { Link, useNavigate } from "react-router-dom";

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

const ServiceProviderDashboardPage = () => {
  const { userData, token, backendUrl } = useContext(AppContext);
  const [emergencyRequests, setEmergencyRequests] = useState<
    EmergencyRequest[]
  >([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchEmergencyRequests();
    }
  }, [token]);

  const fetchEmergencyRequests = async () => {
    try {
      // Get current location
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const response = await axios.get(
          `${backendUrl}/api/emergency/nearby-requests`,
          {
            params: { latitude, longitude, radius: 10 },
            headers: { Authorization: token },
          }
        );

        if (response.data.success) {
          setEmergencyRequests(response.data.requests);
        }
      });
    } catch (error) {
      console.error("Error fetching emergency requests:", error);
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
        // Redirect to chat with the user
        const request = emergencyRequests.find((r) => r.id === requestId);
        if (request) {
          window.location.href = `/service-provider/chat?userId=${request.userId}`;
        }
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {userData?.name}!</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Location</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] text-gray-800">
          <ServiceProviderMap />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center">Loading requests...</div>
          ) : emergencyRequests.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No emergency requests nearby
            </div>
          ) : (
            <div className="space-y-4">
              {emergencyRequests.slice(0, 2).map((request) => (
                <div
                  key={request.id}
                  className="p-4 space-y-2 border rounded-lg"
                >
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
                    {request.status === "PENDING" && (
                      <Button onClick={() => handleAcceptRequest(request.id)}>
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

              {emergencyRequests.length > 3 && (
                <div className="flex justify-center">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/service-provider/emergency")}
                  >
                    View More Requests
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceProviderDashboardPage;
