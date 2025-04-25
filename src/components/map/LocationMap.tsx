import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "sonner";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationMapProps {
  center?: Location;
  markers?: Array<{
    position: Location;
    title: string;
    description?: string;
  }>;
  onLocationUpdate?: (location: Location) => void;
  showCurrentLocation?: boolean;
  zoom?: number;
}

// Component to handle map center updates
const MapUpdater = ({ center }: { center: Location }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.latitude, center.longitude]);
  }, [center, map]);
  return null;
};

const LocationMap = ({
  center = { latitude: 0, longitude: 0 },
  markers = [],
  onLocationUpdate,
  showCurrentLocation = false,
  zoom = 13,
}: LocationMapProps) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (showCurrentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCurrentLocation(location);
          if (onLocationUpdate) {
            onLocationUpdate(location);
          }
        },
        (error) => {
          toast.error("Error getting location: " + error.message);
        }
      );
    }
  }, [showCurrentLocation, onLocationUpdate]);

  return (
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={zoom}
      style={{ height: "100%", width: "100%", minHeight: "400px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {currentLocation && (
        <Marker
          position={[currentLocation.latitude, currentLocation.longitude]}
        >
          <Popup>Your current location</Popup>
        </Marker>
      )}

      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.position.latitude, marker.position.longitude]}
        >
          <Popup>
            <div>
              <h3 className="font-semibold">{marker.title}</h3>
              {marker.description && <p>{marker.description}</p>}
            </div>
          </Popup>
        </Marker>
      ))}

      <MapUpdater center={center} />
    </MapContainer>
  );
};

export default LocationMap;
