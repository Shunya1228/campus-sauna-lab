"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase";
import { getFacility } from "@/components/GetFacility";
import { getDistance } from 'geolib';
import { Facility } from "@/types/supabasetype";
import Link from 'next/link';

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

        // selectedFacilityが空の場合、半径10km以内の施設のみをフィルタリング
        if (!selectedFacility && center) {
          const filteredFacilities = facilitiesData.filter((facility) =>
            getDistance(
              { latitude: center.lat, longitude: center.lng },
              { latitude: facility.lat, longitude: facility.lng }
            ) <= 10000 // 10kmは10000m
          );
          setFacilities(filteredFacilities);
        } else {
          setFacilities(facilitiesData);
        }

        // 各施設の画像URLを取得
        const imageUrls = await Promise.all(
          facilitiesData.map(async (facility) => {
            const { data } = await supabase.storage
              .from("saunaapp") // バケット名
              .getPublicUrl(`main/${facility.id}.jpg`); // メイン画像のパス

            // data.publicUrlが存在する場合のみ設定
            return { [facility.id]: data.publicUrl || "" };
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
          const { data} = await supabase.storage
            .from("saunaapp") // バケット名
            .getPublicUrl(`main/${selectedFacility.id}.jpg`); // メイン画像のパス

          // data.publicUrlが存在する場合のみ設定
          setImageUrls((prevState) => ({
            ...prevState,
            [selectedFacility.id]: data.publicUrl || "",
          }));
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      }
    };

    fetchImageUrl();
  }, [selectedFacility]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const facilityId = Number(event.currentTarget.dataset.facilityId);
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
        <div className="py-4 flex items-center justify-center bg-white shadow-sm rounded-lg hover:bg-gray-100 transition duration-200">
        <button className="flex items-center text-left cursor-pointer p-4" onClick={handleClick}>
          {imageUrls[selectedFacility.id] && (
            <img
              src={imageUrls[selectedFacility.id]}
              alt={`${selectedFacility?.name || "施設"}の画像`}
              className="w-16 h-16 object-cover rounded-full mr-4"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold">{selectedFacility.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              料金: {selectedFacility.fee}円 | 営業時間: {selectedFacility.openinghours}
            </p>
          </div>
        </button>
      </div>
      )}

      {/* 施設が選択されていないとき */}
      {!selectedFacility && (
        <ul className="divide-y divide-gray-200">
        {facilities.map((facility) => (
          <li key={facility.id} className="py-4">
            <Link
              href={`/details/${facility.id}`}
              className="flex items-center p-4 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              {imageUrls[facility.id] && (
                <img
                  src={imageUrls[facility.id]}
                  alt={`${facility.name}の画像`}
                  className="w-16 h-16 object-cover rounded-full mr-4"
                />
              )}
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{facility.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  料金: {facility.fee} | 営業時間: {facility.openinghours}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
};

export default FacilityListContainer;
