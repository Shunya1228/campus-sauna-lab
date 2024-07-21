"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase/supabase";
import { useParams } from "next/navigation";

export default function Details() {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { id } = useParams(); // useParamsを使ってidを取得
  console.log("result of useParams:", id); // デバッグ用

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

  if (loading) {
    return <p className="text-center text-lg text-gray-600">Loading...</p>;
  }

  if (!task) {
    return <p className="text-center text-lg text-red-600">No task found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{task.text}</h1>
          {imageUrl && <img src={imageUrl} alt="Image" className="w-full h-48 object-cover rounded-md mb-4" />}
          <h1 className="text-4xl font-extrabold mb-4">{task.name}</h1>
          <ul className="space-y-2">
            <li><strong>営業時間:</strong> {task.openinghours}</li>
            <li><strong>アクセス:</strong> {task.access}</li>
            <li><strong>周辺の学校:</strong> {task.school}</li>
            <li><strong>料金:</strong> {task.fee}円</li>
            <li><strong>サウナ室温度:</strong> {task.saunatemperature}</li>
            <li><strong>水風呂温度:</strong> {task.watertemperature}</li>
            <li><strong>詳細:</strong> {task.details}</li>
            <li><strong>公式HP:</strong> <a href={task.HP} className="text-blue-600 hover:underline">{task.HP}</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
