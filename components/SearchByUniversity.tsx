import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { getUniversities } from "@/components/GetUniversity";
import FacilityList from './FacilityList';
import { getFacility } from "@/components/GetFacility";
import { AppProps } from 'next/app';
import { FacilityProvider } from './FacilityContext';

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

interface SearchByUniversityProps {
  university: string;
}

const SearchByUniversity: React.FC<SearchByUniversityProps> = ({ university }) => {
  const [selectedUniversity, setSelectedUniversity] = useState(university);
  const [coordinates, setCoordinates] = useState<{ lat: number, lng: number }>({ lat: 0, lng: 0 }); // 初期値を仮の値に設定
  const [universities, setUniversities] = useState<University[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      const universityList = await getUniversities();
      setUniversities(universityList);

      const initialUniversity = universityList.find(univ => univ.name === university);
      if (initialUniversity) {
        setCoordinates({ lat: initialUniversity.lat, lng: initialUniversity.lng });
      } else {
        handleCurrentLocation(); // 初期の大学が見つからない場合、現在地を使用する
      }

      const facilitiesData = await getFacility();
      setFacilities(facilitiesData);
    };

    fetchUniversities();
  }, [university]);

  const handleUniversityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = universities.find(univ => univ.name === event.target.value);
    if (selected) {
      setSelectedUniversity(selected.name);
      setCoordinates({ lat: selected.lat, lng: selected.lng });

      getFacility().then(facilitiesData => {
        setFacilities(facilitiesData);
      });
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setSelectedUniversity('');

        getFacility().then(facilitiesData => {
          setFacilities(facilitiesData);
        });
      });
    }
  };

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: coordinates.lat,
    lng: coordinates.lng,
  };

  const handleMarkerClick = (facilityId: number) => {
    // マーカーがクリックされたときの処理
    console.log(`Marker clicked: Facility ID ${facilityId}`);
  
    // 全ての施設を保持したまま、クリックされた施設のみをフィルタリングする
    const filteredFacilities = facilities.filter(facility => facility.id === facilityId);
  
    // フィルタリングされた施設リストを状態として更新する
    setFacilities(filteredFacilities);
  };

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
          value={selectedUniversity}
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
          {/* 現在地のマーカー */}
          {selectedUniversity ? (
            <Marker
              position={center}
              icon={{
                url: "https://maps.gstatic.com/mapfiles/place_api/icons/v2/school_pinlet.svg", // 大学のアイコン
                scaledSize: { width: 40, height: 40 },
                optimized: false
              }}
            />
          ) : (
            <Marker
              position={center}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/micons/man.png", //人型アイコン
                scaledSize: { width: 40, height: 40 },
                optimized: false
              }}
            />
          )}

          {/* 施設のマーカー */}
          {facilities.map((facility) => (
            <Marker
              key={facility.id}
              position={{ lat: facility.lat, lng: facility.lng }}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: { width: 40, height: 40 },
                optimized: false
              }}
              onClick={() => handleMarkerClick(facility.id)} // マーカーがクリックされた際にコールバック関数を呼び出す
            />
          ))}
        </GoogleMap>
      </LoadScript>

      <FacilityList
        facilities={facilities}
        onMarkerClick={handleMarkerClick} // FacilityListContainer にコールバック関数を渡す
      />
    </div>
  );
};

export default SearchByUniversity;
