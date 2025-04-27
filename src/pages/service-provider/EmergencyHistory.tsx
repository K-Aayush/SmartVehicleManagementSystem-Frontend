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
import { Separator } from "../../components/ui/separator";
import { Loader2 } from "lucide-react";
import MapTilerMap from "../../components/map/MapTilerMap";

interface EmergencyRequest {
  id: string;
  userId: string;
  assistanceType: string;
  description: string;
  status: string;
  createdAt: string;
  latitude: number;
  longitude: number;
  user: {
    name: string;
    phone: string;
  };
  vehicle: {
    brand: string;
    model: string;
    year: number;
  };
}

const ServiceEmergencyHistory = () => {
  const { token, backendUrl } = useContext(AppContext);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] =
    useState<EmergencyRequest | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 3;

  useEffect(() => {
    fetchEmergencyHistory();
  }, []);

  const fetchEmergencyHistory = async () => {
    try {
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
      console.error("Error fetching emergency history:", error);
      toast.error("Failed to load emergency history");
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = requests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

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
          {currentRequests.map((request) => (
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
                    className={`${
                      request.status === "COMPLETED"
                        ? "bg-green-500"
                        : request.status === "INPROGRESS"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
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

                <Separator className="my-4" />

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm">
                    <p>
                      <strong>Customer:</strong> {request.user.name}
                    </p>
                    <p>
                      <strong>Contact:</strong> {request.user.phone}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle>Location History</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-5rem)] text-gray-800">
            {selectedRequest ? (
              <MapTilerMap
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
                    description: `${selectedRequest.user.name} - ${selectedRequest.vehicle.year} ${selectedRequest.vehicle.brand} ${selectedRequest.vehicle.model}`,
                  },
                ]}
                showDirections={true}
                destination={{
                  latitude: selectedRequest.latitude,
                  longitude: selectedRequest.longitude,
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select an emergency request to view its location
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 text-white rounded bg-primary"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="mx-2">
          Page {currentPage} of {Math.ceil(requests.length / requestsPerPage)}
        </span>
        <button
          className="px-4 py-2 text-white rounded bg-primary"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(requests.length / requestsPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ServiceEmergencyHistory;
