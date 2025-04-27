import { useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

interface Location {
  latitude: number;
  longitude: number;
}

interface MapTilerMapProps {
  center: Location;
  markers?: Array<{
    position: Location;
    title: string;
    description?: string;
  }>;
  showDirections?: boolean;
  destination?: Location;
}

const MapTilerMap = ({
  center,
  markers = [],
  showDirections = false,
  destination,
}: MapTilerMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    maptilersdk.config.apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [center.longitude, center.latitude],
      zoom: 13,
    });

    map.current.on("load", () => {
      // Add markers
      markers.forEach((marker) => {
        const markerElement = new maptilersdk.Marker()
          .setLngLat([marker.position.longitude, marker.position.latitude])
          .addTo(map.current!);

        if (marker.title || marker.description) {
          const popup = new maptilersdk.Popup({ offset: 25 }).setHTML(
            `<h3>${marker.title}</h3>${
              marker.description ? `<p>${marker.description}</p>` : ""
            }`
          );
          markerElement.setPopup(popup);
        }
      });

      // Add directions if needed
      if (showDirections && destination) {
        addRoute(center, destination);
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [center, markers, showDirections, destination]);

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

        // Fit the map to show the entire route
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
