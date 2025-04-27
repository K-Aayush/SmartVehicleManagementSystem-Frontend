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
import { AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

const EmergencyService = () => {
  const { token, backendUrl } = useContext(AppContext);
  const [requesting, setRequesting] = useState(false);
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [assistanceType, setAssistanceType] = useState("");
  const [description, setDescription] = useState("");
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetchUserVehicles();
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
        navigate(`/user/dashboard/chat`);
      }
    } catch (error) {
      console.error("Error requesting emergency service:", error);
      toast.error("Failed to request emergency service");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            Emergency Service Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">
            Need immediate assistance? Find and contact nearby service
            providers. They will be notified of your location and can respond
            quickly to help.
          </p>
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
              <Select value={assistanceType} onValueChange={setAssistanceType}>
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
          </div>

          <div className="p-4 mt-4 text-sm text-yellow-800 border rounded-lg bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-200">
            <p>Important: Only use this service for genuine emergencies.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <EmergencyMap />
        </CardContent>
      </Card>

      <div className="fixed bottom-4 right-4">
        <Button
          size="lg"
          variant="destructive"
          disabled={requesting || !selectedVehicle || !assistanceType}
          onClick={handleEmergencyRequest}
        >
          {requesting ? "Requesting..." : "Request Emergency Assistance"}
        </Button>
      </div>
    </div>
  );
};

export default EmergencyService;
