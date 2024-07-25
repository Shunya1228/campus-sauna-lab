"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase";
import { getFacility } from "@/components/GetFacility";
import { getDistance } from 'geolib';

interface Facility {
  id: number;
  name: string;
  lat: number;
  lng: number;
  fee: number;
  openinghours: string;
}

interface FacilityListProps {
  selectedFacility?: Facility; // 選択された施設情報を受け取る
  center?: { lat: number; lng: number }; // 現在地の座標
}

const FacilityListContainer: React.FC<FacilityListProps> = ({
  selectedFacility,
  center,
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const router = useRouter();

  console.log(center); //centerは受け取れているかを確認

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const facilitiesData = await getFacility(); //getFacilityから施設データを取得
        setFacilities(facilitiesData);

        // selectedFacilityが空の場合、半径〇〇km以内の施設のみをフィルタリング
        if (!selectedFacility && center) {
          const filteredFacilities = facilitiesData.filter((facility) =>
            getDistance(
              { latitude: center.lat, longitude: center.lng },
              { latitude: facility.lat, longitude: facility.lng }
            ) <= 15000 // 15kmは15000m
          );
          setFacilities(filteredFacilities);
        } else {
          setFacilities(facilitiesData);
        }
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    };

    fetchFacilities();
  }, [selectedFacility, center]);

  //画像の取得
  useEffect(() => {
    const fetchImageUrl = async () => {
      if (selectedFacility) {
        try {
          const { data, error } = await supabase.storage
            .from("saunaapp") // バケット名
            .getPublicUrl(`main/${selectedFacility.id}.jpg`); // メイン画像のパス

          if (error) {
            console.error(
              `Error fetching image for facility ${selectedFacility.id}:`,
              error.message
            );
          } else {
            setImageUrl(data.publicUrl || "");
          }
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      }
    };

    fetchImageUrl();
  }, [selectedFacility]);

  const handleClick = () => {
    if (selectedFacility) {
      router.push(`/details/${selectedFacility.id}`);
    }
  };

  return (
    <div className="mt-4">
       {/* 施設が選択されているとき */}
      {selectedFacility && (
        <div className="py-2 flex items-center justify-center">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={`${selectedFacility?.name || "施設"}の画像`}
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
          )}
          <div className="flex-grow">
            <button
              className="text-left block cursor-pointer"
              onClick={handleClick}
            >
              <div className="text-sm">{selectedFacility.name}</div>
              <div className="text-xs text-gray-500">
                料金: {selectedFacility.fee}円 | 営業時間:{" "}
                {selectedFacility.openinghours}
              </div>
            </button>
          </div>
        </div>
      )}

       {/* 施設が選択されていないとき */}
      {!selectedFacility && (
        <ul className="divide-y divide-gray-200">
        {facilities.map((facility) => (
          <li key={facility.id} className="py-2 flex items-center justify-center">
            <div className="flex-grow">
              <button className="text-left block cursor-pointer" onClick={() => handleClick(facility.id)}>
                <div className="text-sm">{facility.name}</div>
                <div className="text-xs text-gray-500">
                  料金: {facility.fee}円 | 営業時間: {facility.openinghours}
                </div>
              </button>
            </div>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
};

export default FacilityListContainer;
