import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import EmergencyMap from "../../components/map/EmergencyMap";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, History } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

interface EmergencyRequest {
  id: string;
  assistanceType: string;
  description: string;
  status: string;
  createdAt: string;
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

const EmergencyService = () => {
  const { token, backendUrl } = useContext(AppContext);
  const [requesting, setRequesting] = useState(false);
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [assistanceType, setAssistanceType] = useState("");
  const [description, setDescription] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [emergencyHistory, setEmergencyHistory] = useState<EmergencyRequest[]>(
    []
  );

  useEffect(() => {
    fetchUserVehicles();
    fetchEmergencyHistory();
  }, []);

  const fetchUserVehicles = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/vehicle/getAllVehicles`,
        {
          headers: { Authorization: token },
        }
      );
      if (response.data.success) {
        setVehicles(response.data.vehicles);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to load vehicles");
    }
  };

  const fetchEmergencyHistory = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/emergency/user-requests`,
        {
          headers: { Authorization: token },
        }
      );
      if (response.data.success) {
        setEmergencyHistory(response.data.requests);
      }
    } catch (error) {
      console.error("Error fetching emergency history:", error);
      toast.error("Failed to load emergency history");
    }
  };

  const handleEmergencyRequest = async () => {
    if (!token) {
      toast.error("Please login to request emergency service");
      return;
    }

    if (!selectedVehicle || !assistanceType) {
      toast.error("Please select a vehicle and assistance type");
      return;
    }

    try {
      setRequesting(true);

      // Get current location
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const emergencyData = {
        vehicleId: selectedVehicle,
        assistanceType,
        description,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      const response = await axios.post(
        `${backendUrl}/api/emergency/request`,
        emergencyData,
        { headers: { Authorization: token } }
      );

      if (response.data.success) {
        toast.success("Emergency service requested successfully");
        if (response.data.nearbyProviders > 0) {
          toast.success(
            `${response.data.nearbyProviders} service providers notified`
          );
        }
        await fetchEmergencyHistory();
      }
    } catch (error) {
      console.error("Error requesting emergency service:", error);
      toast.error("Failed to request emergency service");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="container p-4 mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            Emergency Service Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="vehicle">Select Vehicle</Label>
                <Select
                  value={selectedVehicle}
                  onValueChange={setSelectedVehicle}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.brand} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assistanceType">Type of Assistance</Label>
                <Select
                  value={assistanceType}
                  onValueChange={setAssistanceType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assistance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MECHANIC">Mechanical Issue</SelectItem>
                    <SelectItem value="TOWING">Towing Service</SelectItem>
                    <SelectItem value="FUEL">Fuel Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your emergency..."
                  className="h-24"
                />
              </div>

              <Button
                className="w-full"
                onClick={handleEmergencyRequest}
                disabled={requesting || !selectedVehicle || !assistanceType}
              >
                {requesting ? "Requesting..." : "Request Emergency Assistance"}
              </Button>
            </div>

            <div className="h-[400px]">
              <EmergencyMap />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-6 h-6" />
            Emergency Request History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergencyHistory.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No emergency requests yet
              </p>
            ) : (
              emergencyHistory.map((request) => (
                <div
                  key={request.id}
                  className="p-4 space-y-2 border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {request.vehicle.year} {request.vehicle.brand}{" "}
                      {request.vehicle.model}
                    </h3>
                    <Badge
                      variant={
                        request.status === "COMPLETED" ? "default" : "secondary"
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {request.assistanceType}
                  </p>
                  {request.serviceProvider && (
                    <p>
                      <span className="font-medium">Service Provider:</span>{" "}
                      {request.serviceProvider.name} (
                      {request.serviceProvider.phone})
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {request.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(request.createdAt).toLocaleString()}
                  </p>
                  <Separator />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyService;
