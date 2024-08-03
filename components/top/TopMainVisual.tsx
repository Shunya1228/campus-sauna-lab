"use client";

import { supabase } from "@/utils/supabase/supabase";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import UniversityModal from "./UniversityModal";
import useStore from "@/store";

const TopMainVisual = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setSelectedUniversity } = useStore();

  // 画像の取得
  const fetchImage = async () => {
    const { data } = supabase.storage
      .from("saunaapp") // バケット名
      .getPublicUrl(`Top/TopVisual2.jpg`); // idからメイン画像を取得

    // 公開URLを設定
    setImageUrl(data.publicUrl);
  };

  // コンポーネントのマウント時に画像を取得
  useEffect(() => {
    fetchImage();
  }, []);

  // モーダルを開くハンドラー
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // モーダルを閉じるハンドラー
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 現在地から探すボタンのハンドラー
  const handleFindFromCurrentLocation = () => {
    setSelectedUniversity(""); // Zustandの状態を空にする
  };

  return (
    <div className="relative h-full">
      <>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Image"
            className="w-full h-screen object-cover"
          />
        ) : (
          <p>Loading...</p>
        )}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center px-2">
          <h1 className="text-white text-4xl sm:text-5xl font-bold ">
            Campus Sauna Lab
          </h1>
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">
            大学生のためのサウナ検索サイト
          </h2>
          <div className="bg-white bg-opacity-0 p-4 sm:p-8 rounded-lg shadow-lg">
            <Link href="/map">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:py-4 sm:px-8 rounded-lg mr-2 sm:mr-4 mb-2 sm:mb-0"
                onClick={handleFindFromCurrentLocation}
              >
                現在地から探す
              </button>
            </Link>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 sm:py-4 sm:px-8 rounded-lg"
              onClick={handleOpenModal} // モーダルを開く
            >
              大学周辺で探す
            </button>
          </div>
        </div>
        {/* モーダルの表示 */}
        <UniversityModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </>
    </div>
  );
};

export default TopMainVisual;
