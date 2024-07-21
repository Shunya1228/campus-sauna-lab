
"use client";
import { useRouter } from "next/navigation";
import {
  useState,
  Dispatch,
  SetStateAction,
  ReactElement,
  useEffect,
} from "react";
import { supabase } from "@/utils/supabase/supabase";

function Task(props: {
  id: number;
  text: string;
  saunatemperature: string;
  fee: string;
  access: string;
  station: string;
  school: string;
  openinghours: string;
  taskList: Dispatch<SetStateAction<Array<ReactElement>>>;
}) {
  const router = useRouter();

  const id = props.id;
  const text = props.text;
  const fee = props.fee;
  const access = props.access;
  const station = props.station;
  const school = props.school;
  const openinghours = props.openinghours;

  const handleClick = () => {
    router.push(`/details/${id}`);  // ボタンをクリックして '/details' に遷移する
  };

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // 画像の取得
  const fetchImage = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("saunaapp") //バケット名
        .getPublicUrl(`main/${id}.jpg`); //idからメイン画像を取得

      if (error) {
        throw error;
      }

      // 公開URLを設定
      setImageUrl(data.publicUrl);
    } catch (error) {
      console.error("Error fetching image:", error.message);
    }
  };


  // コンポーネントのマウント時に画像を取得
  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <>
      <button
        onClick={handleClick}
        className="w-full text-left p-4 border rounded-md shadow-md hover:bg-gray-100"
      >
        <div>
          <p className="break-all">施設名:{text}</p>
          <p>ID:{id}</p>
          {imageUrl && <img src={imageUrl} alt="Image" className="m-1" />}
          <p className="text-xs ">場所：{access}</p>
          <p className="text-xs">最寄駅：{station}</p>
          <p className="text-xs">営業時間：{openinghours}</p>
          <p className="text-xs">近隣学校：{school}</p>
          <p className="text-xs">料金：{fee}円</p>
        </div>
      </button>
    </>
  );
}

export default Task;