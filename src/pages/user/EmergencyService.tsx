import { useContext, useState } from "react";
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

const EmergencyService = () => {
  const { token, backendUrl } = useContext(AppContext);
  const [requesting, setRequesting] = useState(false);
  const navigate = useNavigate();

  const handleEmergencyRequest = async (providerId: string) => {
    if (!token) {
      toast.error("Please login to request emergency service");
      return;
    }

    try {
      setRequesting(true);

      // Mock data for testing - replace with actual vehicle selection
      const emergencyData = {
        vehicleId: "test-vehicle-id", 
        assistanceType: "MECHANIC", 
        description: "Emergency mechanical assistance needed",
        latitude: 0, 
        longitude: 0,
      };

      // Get current location
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      emergencyData.latitude = position.coords.latitude;
      emergencyData.longitude = position.coords.longitude;

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
          <div className="p-4 mb-4 text-sm text-yellow-800 border rounded-lg bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-200">
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
          disabled={requesting}
          onClick={() => handleEmergencyRequest("nearest")}
        >
          {requesting ? "Requesting..." : "Request Emergency Assistance"}
        </Button>
      </div>
    </div>
  );
};

export default EmergencyService;
