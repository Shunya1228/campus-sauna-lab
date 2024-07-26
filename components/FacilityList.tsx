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
  const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({});
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const router = useRouter();

  console.log(center); //centerは受け取れているかを確認

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const facilitiesData = await getFacility(); //getFacilityから施設データを取得

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

        // 各施設の画像URLを取得
        const imageUrls = await Promise.all(
          facilitiesData.map(async (facility) => {
            const { data, error } = await supabase.storage
              .from("saunaapp") // バケット名
              .getPublicUrl(`main/${facility.id}.jpg`); // メイン画像のパス

            if (error) {
              console.error(
                `Error fetching image for facility ${facility.id}:`,
                error.message
              );
              return { [facility.id]: "" };
            } else {
              return { [facility.id]: data.publicUrl || "" };
            }
          })
        );
        setImageUrls(Object.assign({}, ...imageUrls));
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
            setImageUrls((prevState) => ({
              ...prevState,
              [selectedFacility.id]: data.publicUrl || "",
            }));
          }
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      }
    };

    fetchImageUrl();
  }, [selectedFacility]);

  const handleClick = (facilityId: number) => {
    if (selectedFacility) {
      router.push(`/details/${selectedFacility.id}`);
    } else {
      router.push(`/details/${facilityId}`);
    }
  };

  return (
    <div className="mt-4">
      {/* 施設が選択されているとき */}
      {selectedFacility && (
        <div className="py-2 flex items-center justify-center">
          {imageUrls[selectedFacility.id] && (
            <img
              src={imageUrls[selectedFacility.id]}
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
              {imageUrls[facility.id] && (
                <img
                  src={imageUrls[facility.id]}
                  alt={`${facility.name}の画像`}
                  className="w-16 h-16 object-cover rounded-full mr-4"
                />
              )}
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
