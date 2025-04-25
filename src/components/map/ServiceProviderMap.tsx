import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import LocationMap from "./LocationMap";
import { Card } from "../ui/card";
import { toast } from "sonner";
import { io } from "socket.io-client";
import axios from "axios";

interface Location {
  latitude: number;
  longitude: number;
}

const ServiceProviderMap = () => {
  const { backendUrl, token, userData } = useContext(AppContext);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

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
    <Card className="p-4">
      <LocationMap
        center={currentLocation}
        markers={[
          {
            position: currentLocation,
            title: "Your Location",
            description: "You are here",
          },
        ]}
        showCurrentLocation
      />
    </Card>
  );
};

export default ServiceProviderMap;
