import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import MapTilerMap from "./MapTilerMap";
import { Card } from "../ui/card";
import { toast } from "sonner";
import { io } from "socket.io-client";
import axios from "axios";

interface Location {
  latitude: number;
  longitude: number;
}

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

const ServiceProviderMap = () => {
  const { userData, token, backendUrl } = useContext(AppContext);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [emergencyRequests, setEmergencyRequests] = useState<
    EmergencyRequest[]
  >([]);

  useEffect(() => {
    if (!token || !userData) return;

    const socket = io(backendUrl);
    let watchId: number;

    const startLocationTracking = () => {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setCurrentLocation(location);

            // Update location in database
            try {
              await axios.post(`${backendUrl}/api/location/update`, location, {
                headers: { Authorization: token },
              });

              // Emit location update through socket
              socket.emit("location_update", {
                userId: userData.id,
                ...location,
              });

              // Fetch nearby emergency requests
              const response = await axios.get(
                `${backendUrl}/api/emergency/nearby-requests`,
                {
                  params: { ...location, radius: 10 },
                  headers: { Authorization: token },
                }
              );

              if (response.data.success) {
                setEmergencyRequests(response.data.requests);
              }
            } catch (error) {
              console.error("Error updating location:", error);
            }
          },
          (error) => {
            toast.error("Error tracking location: " + error.message);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      }
    };

    startLocationTracking();

    // Listen for new emergency requests
    socket.on("new_emergency_request", (request: EmergencyRequest) => {
      setEmergencyRequests((prev) => [...prev, request]);
    });

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      socket.disconnect();
    };
  }, [token, userData]);

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
    <MapTilerMap
      center={currentLocation}
      markers={[
        {
          position: currentLocation,
          title: "Your Location",
          description: "You are here",
        },
        ...emergencyRequests.map((request) => ({
          position: {
            latitude: request.latitude,
            longitude: request.longitude,
          },
          title: `Emergency: ${request.user.name}`,
          description: `${request.vehicle.year} ${request.vehicle.brand} ${
            request.vehicle.model
          } - ${request.distance?.toFixed(2)}km away`,
        })),
      ]}
    />
  );
};

export default ServiceProviderMap;
