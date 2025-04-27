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
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import MapBox from "../../components/map/MapBox";

interface EmergencyRequest {
  id: string;
  assistanceType: string;
  description: string;
  status: string;
  createdAt: string;
  latitude: number;
  longitude: number;
  serviceProvider?: {
    name: string;
    phone: string;
  };
  vehicle: {
    brand: string;
    model: string;
    year: number;
  };
}

const EmergencyHistory = () => {
  const { token, backendUrl } = useContext(AppContext);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] =
    useState<EmergencyRequest | null>(null);

  useEffect(() => {
    fetchEmergencyHistory();
  }, []);

  const fetchEmergencyHistory = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/emergency/user-requests`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error("Error fetching emergency history:", error);
      toast.error("Failed to load emergency history");
    } finally {
      setLoading(false);
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
    <div className="container p-4 mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Emergency Service History</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {requests.map((request) => (
            <Card
              key={request.id}
              className={`cursor-pointer transition-colors ${
                selectedRequest?.id === request.id ? "border-primary" : ""
              }`}
              onClick={() => setSelectedRequest(request)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">
                    {request.assistanceType}
                  </h3>
                  <Badge
                    variant={
                      request.status === "COMPLETED" ? "default" : "outline"
                    }
                  >
                    {request.status}
                  </Badge>
                </div>

                <p className="mb-2">
                  Vehicle: {request.vehicle.year} {request.vehicle.brand}{" "}
                  {request.vehicle.model}
                </p>

                <p className="text-sm text-muted-foreground">
                  {request.description}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleString()}
                  </span>

                  {request.serviceProvider && (
                    <Button variant="outline" asChild>
                      <Link to={`/user/dashboard/chat`}>Chat History</Link>
                    </Button>
                  )}
                </div>

                {request.serviceProvider && (
                  <>
                    <Separator className="my-4" />
                    <div className="text-sm">
                      <p>
                        <strong>Service Provider:</strong>{" "}
                        {request.serviceProvider.name}
                      </p>
                      <p>
                        <strong>Contact:</strong>{" "}
                        {request.serviceProvider.phone}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle>Location History</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-5rem)]">
            {selectedRequest ? (
              <MapBox
                center={{
                  latitude: selectedRequest.latitude,
                  longitude: selectedRequest.longitude,
                }}
                markers={[
                  {
                    position: {
                      latitude: selectedRequest.latitude,
                      longitude: selectedRequest.longitude,
                    },
                    title: "Emergency Location",
                    description: `${selectedRequest.vehicle.year} ${selectedRequest.vehicle.brand} ${selectedRequest.vehicle.model}`,
                  },
                ]}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select an emergency request to view its location
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyHistory;
