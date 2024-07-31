"use client";
import FacilityDetails from "@/components/facilityDetails/FacilityDetails";
import { useParams } from "next/navigation";

interface Params {
  id: string;
}

const DetailsPage = () => {
  const { id } = useParams(); // useParamsを使ってidを取得
  const params = useParams() as Params;
  console.log("result of useParams:", id); // デバッグ用

  return (
    <div>
      <FacilityDetails id={id} />
    </div>
  );
};

export default DetailsPage;
