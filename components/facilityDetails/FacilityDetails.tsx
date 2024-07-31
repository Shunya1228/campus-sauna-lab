"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/supabase";
import { addFavoriteFacility } from "../favoriteFacility/addFavoriteFacility";
import useStore from "@/store";
import { removeFavoriteFacility } from "../favoriteFacility/removeFavoriteFacility";
import { FavoriteIconAnim } from "../FavoriteIconAnim";

interface FacilityDetailsProps {
  id: string;
}

const FacilityDetails: React.FC<FacilityDetailsProps> = ({ id }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { user } = useStore();
  const [on, setOn] = useState(false);

  const handleClick = useCallback(() => {
    setOn((prev) => !prev);
  }, []);

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
        const { data: imageData, error: imageError } = await supabase.storage
          .from("saunaapp") // バケット名
          .getPublicUrl(`main/${id}.jpg`); // idからメイン画像を取得

        if (imageError) {
          throw imageError;
        }

        // 公開URLを設定
        setImageUrl(imageData.publicUrl);
      } catch (error) {
        console.error("Error fetching task or image:", error.message);
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
          <h1 className="text-4xl font-bold mb-4">{task.name}</h1>
          <ul className="space-y-2">
            <li>
              <strong>営業時間:</strong> {task.openinghours}
            </li>
            <li>
              <strong>アクセス:</strong> {task.access}
            </li>
            <li>
              <strong>周辺の学校:</strong> {task.school}
            </li>
            <li>
              <strong>料金（最低価格）:</strong> {task.fee}円
            </li>
            <li>
              <strong>サウナ室温度:</strong> {task.saunatemperature}°C
            </li>
            <li>
              <strong>水風呂温度:</strong> {task.watertemperature}°C
            </li>
            <li>
              <strong>詳細:</strong> {task.details}
            </li>
            <li>
              <strong>公式HP:</strong>{" "}
              <a href={task.HP} className="text-blue-600 hover:underline">
                {task.HP}
              </a>
            </li>
          </ul>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                handleClick();
                handleAddFavorite();
              }}
              className="flex items-center text-white p-2 rounded-lg"
            >
              <FavoriteIconAnim on={on} />
            </button>
            <p className="text-sm text-gray-700 bg-blue-200">お気に入り登録！</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetails;
