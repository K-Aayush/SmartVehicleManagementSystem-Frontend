import { useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

interface Location {
  latitude: number;
  longitude: number;
}

interface MarkerData {
  position: Location;
  title: string;
  description?: string;
}

interface MapTilerMapProps {
  center: Location;
  markers?: MarkerData[];
  showDirections?: boolean;
  destination?: Location;
  onMarkerClick?: (marker: MarkerData) => void;
}

const MapTilerMap = ({
  center,
  markers = [],
  showDirections = false,
  destination,
  onMarkerClick,
}: MapTilerMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const markersRef = useRef<maptilersdk.Marker[]>([]);
  const routeRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [center.longitude, center.latitude],
      zoom: 13,
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach((marker) => {
      const markerElement = new maptilersdk.Marker({
        color: marker.title.includes("Emergency") ? "#ff4444" : "#4444ff",
      })
        .setLngLat([marker.position.longitude, marker.position.latitude])
        .addTo(map.current!);

      if (marker.title || marker.description) {
        const popup = new maptilersdk.Popup({ offset: 25 }).setHTML(
          `<div class="p-2 text-gray-800">
            <h3 class="font-bold">${marker.title}</h3>
            ${
              marker.description
                ? `<p class="text-sm mt-1 whitespace-pre-line">${marker.description}</p>`
                : ""
            }
          </div>`
        );
        markerElement.setPopup(popup);
      }

      if (onMarkerClick) {
        markerElement.getElement().addEventListener("click", () => {
          onMarkerClick(marker);
        });
      }

      markersRef.current.push(markerElement);
    });
  }, [markers, onMarkerClick]);

  useEffect(() => {
    if (!map.current || !showDirections || !destination) {
      if (routeRef.current) {
        map.current?.removeLayer(routeRef.current.id);
        map.current?.removeSource(routeRef.current.id);
        routeRef.current = null;
      }
      return;
    }

    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://api.maptiler.com/directions/v1/driving/${center.longitude},${
            center.latitude
          };${destination.longitude},${destination.latitude}?key=${
            import.meta.env.VITE_MAPTILER_API_KEY
          }`
        );
        const data = await response.json();

        if (data.routes && data.routes[0]) {
          const route = data.routes[0];
          const coordinates = route.geometry.coordinates;

          // Remove existing route if any
          if (routeRef.current) {
            map.current?.removeLayer(routeRef.current.id);
            map.current?.removeSource(routeRef.current.id);
          }

          const routeId = `route-${Date.now()}`;
          map.current?.addSource(routeId, {
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

          map.current?.addLayer({
            id: routeId,
            type: "line",
            source: routeId,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#3b82f6",
              "line-width": 4,
              "line-dasharray": [2, 2],
            },
          });

          routeRef.current = { id: routeId };

          // Fit the map to show the entire route
          const bounds = new maptilersdk.LngLatBounds();
          coordinates.forEach((coord: number[]) => {
            bounds.extend(coord as [number, number]);
          });
          map.current?.fitBounds(bounds, { padding: 50 });
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, [center, destination, showDirections]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
};

export default MapTilerMap;
