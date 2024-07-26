"use client";
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// 施設データ（例）
const places = [
  { id: 1, name: '妙法湯', position: { lat: 35.7240, lng: 139.6952 } },
  { id: 2, name: '竜泉寺の湯 八王子みなみ野店', position: { lat: 35.6417, lng: 139.3323 } },
  { id: 3, name: '施設C', position: { lat: 35.6795, lng: 139.6817 } },
];

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
  borderRadius: '10px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
};

function Map() {
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        console.error("Error fetching location");
      }
    );
  }, []);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={currentPosition}
        zoom={15}
        className="w-full h-screen sm:h-3/4 rounded-lg shadow-md" // 追加
      >
        {places.map(place => (
          <Marker 
            key={place.id} 
            position={place.position}
            onClick={() => setSelectedPlace(place)}
          />
        ))}

        {selectedPlace && (
          <InfoWindow
            position={selectedPlace.position}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div>
              <h2>{selectedPlace.name}</h2>
              <p>詳細情報</p>
              <p className="text-blue-500"><a href="/details/6">施設詳細ページへ</a></p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;
