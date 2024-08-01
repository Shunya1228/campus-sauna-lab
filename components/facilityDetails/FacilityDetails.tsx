"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { addFavoriteFacility } from "../favoriteFacility/addFavoriteFacility";
import useStore from "@/store";
import { removeFavoriteFacility } from "../favoriteFacility/removeFavoriteFacility";
import { Tables } from "@/types/supabasetype";

interface FacilityDetailsProps {
  id: string;
}

const FacilityDetails: React.FC<FacilityDetailsProps> = ({ id }) => {
  const [task, setTask] = useState<Tables<'tasks'> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { user } = useStore();
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  useEffect(() => {
    async function fetchTask() {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("id", id)
          .single(); // 指定されたIDのタスクを一つだけ取得

        if (error) {
          throw error;
        }

        setTask(data);

        // タスクが取得された後に画像を取得
        const { data: imageData} = await supabase.storage //getPublicUrl メソッドの戻り値に error プロパティが存在しない
          .from("saunaapp") // バケット名
          .getPublicUrl(`main/${id}.jpg`); // idからメイン画像を取得

        // 公開URLを設定
        setImageUrl(imageData.publicUrl);
      } catch (error) {
        console.error('Error fetching task or image:', (error as Error).message); //error を Error 型にキャストし、message プロパティにアクセス
      } finally {
        setLoading(false);
      }
    }

    fetchTask();
  }, [id]);

  //お気に入り登録の処理を実行して、メッセージを表示する
  const handleAddFavorite = async () => {
    
    if (user?.id && id) {
      const response = await addFavoriteFacility(user.id, id);
      alert(response.message); // メッセージをアラートで表示
    } else {
      alert("ログインをしてから実行してください。");
    }
  };

  //お気に入り解除の処理を実行して、メッセージを表示する
  const handleRemoveFavorite = async () => {
    if (user?.id && id) {
      const response = await removeFavoriteFacility(user.id, id);
      alert(response.message); // メッセージをアラートで表示
    } else {
      alert("ログインをしてから実行してください。");
    }
  };

  const handleClick = () => {
    setIsFavorited(!isFavorited);
    if (isFavorited) {
      handleRemoveFavorite();
    } else {
      handleAddFavorite();
    }
  };

  if (loading) {
    return <p className="text-center text-lg text-gray-600">読み込み中...</p>;
  }

  if (!task) {
    return (
      <p className="text-center text-lg text-red-600">
        施設が見つかりませんでした。
      </p>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Image"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          )}
          <h1 className="text-4xl font-bold mb-4 ">{task.name}</h1>

          <div className="max-w-lg mx-auto p-2">
            <div className="grid grid-cols-2 gap-4 border-b py-2">
              <div className="font-bold">営業時間</div>
              <div>{task.openinghours}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b py-2">
              <div className="font-bold">アクセス</div>
              <div>{task.access}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b py-2">
              <div className="font-bold">料金（最低価格）</div>
              <div>{task.fee}円</div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b py-2">
              <div className="font-bold">サウナ室温度</div>
              <div>{task.saunatemperature}°C</div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b py-2">
              <div className="font-bold">水風呂温度</div>
              <div>{task.watertemperature}°C</div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b py-2">
              <div className="font-bold">詳細</div>
              <div>{task.details}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b py-2">
              <div className="font-bold">公式HP</div>
              <div>
                <a
                  href={task.HP}
                  className="text-blue-600 hover:underline text-xs break-words"
                >
                  {task.HP}
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={handleClick}
              className={`
        rounded-full
        transition-transform
        duration-200
        ease-in-out
        hover:scale-125
        ${isFavorited ? "bg-red-500 text-white" : "bg-white text-red-500"}
        text-center
        border
      `}
            >
              <HeartIcon className="h-7 w-7" />
              <span className="sr-only">
                {isFavorited ? "Remove from favorites" : "Add to favorites"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetails;

function HeartIcon(props: React.SVGProps<SVGSVGElement>)  {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
