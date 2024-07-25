"use client";

import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { getUniversities } from "@/components/GetUniversity";
import FacilityList from './FacilityList';
import { getFacility } from "@/components/GetFacility";
import useStore from '@/store';

interface University {
  name: string;
  lat: number;
  lng: number;
}

interface Facility {
  id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
}

const SearchByUniversity: React.FC = () => {
  const { selectedUniversity, setSelectedUniversity } = useStore();
  const [universities, setUniversities] = useState<University[]>([]);
  const [coordinates, setCoordinates] = useState<{ lat: number, lng: number }>({ lat: 0, lng: 0 });
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | undefined>(undefined);

  useEffect(() => {
    const fetchUniversities = async () => {
      const universityList = await getUniversities();
      setUniversities(universityList);

      if (selectedUniversity) {
        const initialUniversity = universityList.find(univ => univ.name === selectedUniversity);
        if (initialUniversity) {
          setCoordinates({ lat: initialUniversity.lat, lng: initialUniversity.lng });
        } else {
          handleCurrentLocation();
        }
      } else {
        handleCurrentLocation();
      }

      const facilitiesData = await getFacility();
      setFacilities(facilitiesData);
    };

    fetchUniversities();
  }, [selectedUniversity]);

  const handleUniversityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUniversityName = event.target.value;
    const universitySelector = universities.find(univ => univ.name === selectedUniversityName);

    if (universitySelector) {
      setSelectedUniversity(universitySelector.name);
      setCoordinates({ lat: universitySelector.lat, lng: universitySelector.lng });
      getFacility().then(facilitiesData => {
        setFacilities(facilitiesData);
      });
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          setSelectedUniversity('');

          getFacility().then(facilitiesData => {
            setFacilities(facilitiesData);
          });
        },
        error => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleMarkerClick = (facilityId: number) => {
    const facility = facilities.find(fac => fac.id === facilityId);
    if (facility) {
      setSelectedFacility(facility); // クリックしたマーカーの施設を選択状態にする
    }
  };


  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = coordinates.lat && coordinates.lng ? {
    lat: coordinates.lat,
    lng: coordinates.lng,
  } : { lat: 0, lng: 0 };

  return (
    <div className="px-4 py-3">
      <div className="mb-4 flex gap-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          onClick={handleCurrentLocation}
        >
          現在地
        </button>
        <select
          value={selectedUniversity || ''}
          onChange={handleUniversityChange}
          className="form-select py-2 px-4 rounded-lg border border-gray-300"
        >
          <option value="">大学を選択</option>
          {universities.map(univ => (
            <option key={univ.name} value={univ.name}>
              {univ.name}
            </option>
          ))}
        </select>
      </div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={14}
          className="rounded-lg shadow-md"
        >
          <Marker
            position={center}
            icon={{
              url: selectedUniversity
                ? "https://maps.gstatic.com/mapfiles/place_api/icons/v2/school_pinlet.svg"
                : "http://maps.google.com/mapfiles/ms/micons/man.png",
              scaledSize: { width: 40, height: 40 },
              optimized: false
            }}
          />

          {facilities.map((facility) => (
            <Marker
              key={facility.id}
              position={{ lat: facility.lat, lng: facility.lng }}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: { width: 40, height: 40 },
                optimized: false
              }}
              onClick={() => handleMarkerClick(facility.id)}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      <FacilityList selectedFacility={selectedFacility} center={center} />
    </div>
  );
};

export default SearchByUniversity;
