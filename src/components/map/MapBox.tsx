import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

// Set your Mapbox token here
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface Location {
  latitude: number;
  longitude: number;
}

interface MapBoxProps {
  center?: Location;
  markers?: Array<{
    position: Location;
    title: string;
    description?: string;
  }>;
  showDirections?: boolean;
  destination?: Location;
  onLocationUpdate?: (location: Location) => void;
}

const MapBox = ({
  center,
  markers = [],
  showDirections = false,
  destination,
  onLocationUpdate,
}: MapBoxProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [center?.longitude || 0, center?.latitude || 0],
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Add directions if needed
    if (showDirections && destination) {
      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: "metric",
        profile: "mapbox/driving",
      });

      map.current.addControl(directions, "top-left");

      // Set origin and destination
      if (currentLocation) {
        directions.setOrigin([
          currentLocation.longitude,
          currentLocation.latitude,
        ]);
        directions.setDestination([
          destination.longitude,
          destination.latitude,
        ]);
      }
    }

    // Get user's location
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

        // Add user marker
        new mapboxgl.Marker({ color: "#FF0000" })
          .setLngLat([location.longitude, location.latitude])
          .setPopup(new mapboxgl.Popup().setHTML("You are here"))
          .addTo(map.current!);

        // Center map on user's location
        map.current?.flyTo({
          center: [location.longitude, location.latitude],
        });
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true }
    );

    // Add markers
    markers.forEach((marker) => {
      new mapboxgl.Marker()
        .setLngLat([marker.position.longitude, marker.position.latitude])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<h3>${marker.title}</h3>${marker.description || ""}`
          )
        )
        .addTo(map.current!);
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [center, markers, showDirections, destination]);

  // Watch position for live tracking
  useEffect(() => {
    if (!onLocationUpdate) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCurrentLocation(location);
        onLocationUpdate(location);

        // Update user marker position
        if (map.current) {
          map.current.setCenter([location.longitude, location.latitude]);
        }
      },
      (error) => console.error("Error watching position:", error),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [onLocationUpdate]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
};

export default MapBox;
