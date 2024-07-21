import React, { useEffect, useState } from 'react';
import { getFacility } from "@/components/GetFacility";
import { useRouter } from 'next/navigation'; // 'next/navigation' から 'next/router' に修正
import { supabase } from "@/utils/supabase/supabase";
import SearchUniversity from "./SearchUniversity";

interface Facility {
  id: number;
  name: string;
  lat: number;
  lng: number;
  fee: number;
  openinghours: string;
}

const FacilityListContainer: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const facilitiesData = await getFacility();
        setFacilities(facilitiesData);

        // 画像のURLを取得
        const urls: { [key: number]: string } = {};
        for (const facility of facilitiesData) {
          const { data, error } = await supabase.storage
            .from("saunaapp") // バケット名
            .getPublicUrl(`main/${facility.id}.jpg`); // メイン画像のパス
          
          if (error) {
            console.error(`Error fetching image for facility ${facility.id}:`, error.message);
          } else {
            urls[facility.id] = data.publicUrl || '';
          }
        }
        setImageUrls(urls);
      } catch (error) {
        console.error('Error fetching facilities:', error);
      }
    };

    fetchFacilities();
  }, []);

  const handleClick = (facilityId: number) => {
    router.push(`/details/${facilityId}`);
  };

  const handleMarkerClick = (facilityId: number) => {
    // マーカーがクリックされた際の処理
    // 全ての施設を保持したまま、クリックされた施設のみをフィルタリングして表示する
    const filteredFacilities = facilities.filter(facility => facility.id === facilityId);
    setFacilities(filteredFacilities);
  };

  return (
    <div className="mt-4">
      <ul className="divide-y divide-gray-200">
        {facilities.map((facility) => (
          <li key={facility.id} className="py-2 flex items-center justify-center">
            {imageUrls[facility.id] && (
              <img src={imageUrls[facility.id]} alt={`${facility.name}の画像`} className="w-16 h-16 object-cover rounded-full mr-4" />
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
    </div>
  );
};

export default FacilityListContainer;
