"use client";

import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import useFavoriteFacilities from "../GetFavoriteFacilities";
import { useRouter } from "next/navigation";

interface FavoriteFacilitiesMapProps {
  userId: string;
}

const FavoriteFacilitiesMap: React.FC<FavoriteFacilitiesMapProps> = ({
  userId,
}) => {
  const favoriteFacilities = useFavoriteFacilities(userId || "");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [userId]);

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: coordinates.lat,
    lng: coordinates.lng,
  };

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const handleMarkerClick = (facility: any) => {
    if (map) {
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div>
            <strong>${facility.name}</strong><br>
            <a href="/details/${facility.id}" style="color: blue; text-decoration: underline;">施設詳細</a>
          </div>`,
      });

      // Ensure InfoWindow is opened over the correct marker
      const marker = new google.maps.Marker({
        position: { lat: facility.lat, lng: facility.lng },
        map: map,
      });

      infoWindow.open(map, marker);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-4">My Map</h1>
      <p className="text-sm text-center mb-2">※お気に入り登録した施設が表示されています。</p>
      <div className="rounded-lg overflow-hidden shadow-lg">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
          onLoad={handleMapLoad}
        >
          <Marker
            position={center}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/micons/man.png",
              scaledSize: { width: 40, height: 40 },
              optimized: false,
            }}
          />
          {favoriteFacilities.map((facility) => (
            <Marker
              key={facility.id}
              position={{ lat: facility.lat, lng: facility.lng }}
              onClick={() => handleMarkerClick(facility)}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      </div>
    </div>
  );
};

export default FavoriteFacilitiesMap;
