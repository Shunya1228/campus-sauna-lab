"use client";
import FacilityDetails from "@/components/FacilityDetails";
import { useParams } from "next/navigation";

const DetailsPage = () => {
  const { id } = useParams(); // useParamsを使ってidを取得
  console.log("result of useParams:", id); // デバッグ用

  return (
    <div>
      <FacilityDetails id={id} />
    </div>
  );
};

export default DetailsPage;
