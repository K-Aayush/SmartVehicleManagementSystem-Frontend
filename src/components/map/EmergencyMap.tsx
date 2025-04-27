import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import LocationMap from "./LocationMap";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Location {
  latitude: number;
  longitude: number;
}

interface ServiceProvider {
  id: string;
  name: string;
  location: Location;
  distance: number;
  isAvailable: boolean;
  lastSeen?: string;
}

const EmergencyMap = () => {
  const { backendUrl, token, userData } = useContext(AppContext);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !userData) return;

    const socket = io(backendUrl);

    const getCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCurrentLocation(location);

          // Fetch nearby service providers
          try {
            const response = await axios.get(
              `${backendUrl}/api/location/nearby`,
              {
                params: {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  radius: 10, // 10km radius
                },
                headers: { Authorization: token },
              }
            );

            if (response.data.success) {
              setProviders(response.data.providers);
            }
          } catch (error) {
            console.log(error);
            toast.error("Error finding nearby service providers");
          }
        },
        (error) => {
          toast.error("Error getting location: " + error.message);
        }
      );
    };

    getCurrentLocation();

    // Listen for provider location updates
    socket.on("provider_location_update", ({ userId, latitude, longitude }) => {
      setProviders((prev) =>
        prev.map((provider) =>
          provider.id === userId
            ? {
                ...provider,
                location: { latitude, longitude },
              }
            : provider
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [token, userData]);

  const requestEmergencyAssistance = async () => {
    if (!currentLocation || !selectedProvider) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/emergency/request`,
        {
          providerId: selectedProvider,
          location: currentLocation,
          description: "Emergency assistance needed",
        },
        { headers: { Authorization: token } }
      );

      if (response.data.success) {
        toast.success("Emergency assistance requested");

        // Create initial chat message
        const chatResponse = await axios.post(
          `${backendUrl}/api/chat/send`,
          {
            receiverId: selectedProvider,
            message: "Emergency assistance needed at my location",
          },
          { headers: { Authorization: token } }
        );

        if (chatResponse.data.success) {
          // Navigate to chat with the selected provider
          navigate(
            `/user/dashboard/chat?type=service-providers&userId=${selectedProvider}`
          );
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to request assistance");
    } finally {
      setLoading(false);
    }
  };

  if (!currentLocation) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center h-96">
          Getting your location...
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="h-[400px]">
          <LocationMap
            center={currentLocation}
            markers={[
              {
                position: currentLocation,
                title: "Your Location",
                description: "You are here",
              },
              ...providers.map((provider) => ({
                position: provider.location,
                title: provider.name,
                description: `${provider.distance.toFixed(2)}km away${
                  provider.isAvailable ? " - Available" : ""
                }`,
              })),
            ]}
            showCurrentLocation={true}
            zoom={13}
          />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Nearby Service Providers</h3>
        <div className="space-y-2">
          {providers.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No service providers found nearby. Please try again later.
            </p>
          ) : (
            providers.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{provider.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {provider.distance.toFixed(2)}km away
                    {provider.isAvailable ? (
                      <span className="ml-2 text-green-500">• Available</span>
                    ) : (
                      <span className="ml-2 text-gray-500">
                        • Last seen{" "}
                        {new Date(provider.lastSeen || "").toLocaleTimeString()}
                      </span>
                    )}
                  </p>
                </div>
                <Button
                  variant={
                    selectedProvider === provider.id ? "default" : "outline"
                  }
                  onClick={() => setSelectedProvider(provider.id)}
                  disabled={!provider.isAvailable}
                >
                  Select
                </Button>
              </div>
            ))
          )}
        </div>

        {selectedProvider && (
          <Button
            className="w-full mt-4"
            onClick={requestEmergencyAssistance}
            disabled={loading}
          >
            {loading ? "Requesting..." : "Request Emergency Assistance"}
          </Button>
        )}
      </Card>
    </div>
  );
};

export default EmergencyMap;
