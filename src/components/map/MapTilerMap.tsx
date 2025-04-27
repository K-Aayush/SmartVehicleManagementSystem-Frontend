import { useEffect, useRef, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

interface Location {
  latitude: number;
  longitude: number;
}

interface MapTilerMapProps {
  center?: Location;
  markers?: Array<{
    position: Location;
    title: string;
    description?: string;
  }>;
  showDirections?: boolean;
  destination?: Location;
  onLocationUpdate?: (location: Location) => void;
  showCurrentLocation?: boolean;
}

const MapTilerMap = ({
  center,
  markers = [],
  showDirections = false,
  destination,
  onLocationUpdate,
  showCurrentLocation = false,
}: MapTilerMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [center?.longitude || 0, center?.latitude || 0],
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(new maptilersdk.NavigationControl());

    // Get user's location if needed
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

          // Add user marker
          new maptilersdk.Marker({ color: "#FF0000" })
            .setLngLat([location.longitude, location.latitude])
            .setPopup(new maptilersdk.Popup().setHTML("You are here"))
            .addTo(map.current!);

          // Center map on user's location
          map.current?.flyTo({
            center: [location.longitude, location.latitude],
          });

          // If showing directions, add route
          if (showDirections && destination) {
            addRoute(location, destination);
          }
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true }
      );
    }

    // Add markers
    markers.forEach((marker) => {
      new maptilersdk.Marker()
        .setLngLat([marker.position.longitude, marker.position.latitude])
        .setPopup(
          new maptilersdk.Popup().setHTML(
            `<h3>${marker.title}</h3>${marker.description || ""}`
          )
        )
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [center, markers, showDirections, destination, showCurrentLocation]);

  // Watch position for live tracking
  useEffect(() => {
    if (!onLocationUpdate || !showCurrentLocation) return;

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
  }, [onLocationUpdate, showCurrentLocation]);

  const addRoute = async (start: Location, end: Location) => {
    if (!map.current) return;

    try {
      const response = await fetch(
        `https://api.maptiler.com/directions/v1/driving/${start.longitude},${
          start.latitude
        };${end.longitude},${end.latitude}?key=${
          import.meta.env.VITE_MAPTILER_API_KEY
        }`
      );
      const data = await response.json();

      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates;

        // Add route layer
        if (map.current.getSource("route")) {
          (map.current.getSource("route") as any).setData({
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coordinates,
            },
          });
        } else {
          map.current.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: coordinates,
              },
            },
          });

          map.current.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#3b82f6",
              "line-width": 4,
            },
          });
        }

        // Fit map to show entire route
        const bounds = new maptilersdk.LngLatBounds();
        coordinates.forEach((coord: number[]) => {
          bounds.extend(coord as [number, number]);
        });
        map.current.fitBounds(bounds, { padding: 50 });
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
};

export default MapTilerMap;
