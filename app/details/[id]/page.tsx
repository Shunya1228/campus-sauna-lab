"use client";

import React from "react";
import FacilityDetails from "@/components/facilityDetails/FacilityDetails";
import { useParams } from "next/navigation";

interface Params {
  id: string;
}

const DetailsPage: React.FC = () => {

  // useParams フックを使ってパラメータを取得し、型アサーションを適用
  //TypeScriptが型の一致を強制的に確認しないようにするために一度 unknown 型に変換 ※要相談
  const params = useParams() as unknown as Params;
  const { id } = params;
  
  console.log("result of useParams:", id); // デバッグ用

  return (
    <div>
      <FacilityDetails id={id} />
    </div>
  );
};

export default DetailsPage;
