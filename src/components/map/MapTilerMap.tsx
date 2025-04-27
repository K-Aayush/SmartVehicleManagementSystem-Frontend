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

    const initialCenter = center ? [center.longitude, center.latitude] : [0, 0];

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${
        import.meta.env.VITE_MAPTILER_API_KEY
      }`,
      center: initialCenter as [number, number],
      zoom: 13,
    });

    map.current.on("load", () => {
      map.current?.addControl(new maptilersdk.NavigationControl());

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
            const userMarker = new maptilersdk.Marker({
              color: "#FF0000",
              scale: 0.8,
            })
              .setLngLat([location.longitude, location.latitude])
              .addTo(map.current!);

            const popup = new maptilersdk.Popup({
              closeButton: false,
              closeOnClick: false,
              offset: [0, -30],
            }).setHTML(
              '<div class="p-2 text-sm font-medium">You are here</div>'
            );

            userMarker.setPopup(popup);
            popup.addTo(map.current!);

            map.current?.flyTo({
              center: [location.longitude, location.latitude],
              zoom: 14,
              essential: true,
            });

            if (showDirections && destination) {
              addRoute(location, destination);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }

      // Add markers
      markers.forEach((marker) => {
        const markerElement = new maptilersdk.Marker({
          color: "#3b82f6",
          scale: 0.8,
        })
          .setLngLat([marker.position.longitude, marker.position.latitude])
          .addTo(map.current!);

        if (marker.title || marker.description) {
          const popup = new maptilersdk.Popup({
            closeButton: true,
            offset: [0, -30],
          }).setHTML(
            `<div class="p-2">
              <h3 class="font-bold text-sm">${marker.title}</h3>
              ${
                marker.description
                  ? `<p class="text-sm mt-1">${marker.description}</p>`
                  : ""
              }
            </div>`
          );

          markerElement.setPopup(popup);
        }
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [center, markers, showDirections, destination, showCurrentLocation]);

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

        if (map.current) {
          map.current.setCenter([location.longitude, location.latitude]);
        }
      },
      (error) => console.error("Error watching position:", error),
      { enableHighAccuracy: true, timeout: 10000 }
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
              "line-opacity": 0.8,
            },
          });
        }

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
