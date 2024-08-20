import React from "react";

export const serviceDescription = () => {
  return (
    <div>
      <section className="p-6 bg-gray-900 shadow-lg mx-auto text-white">
        {/* 特徴 */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-center">
          <div className="mt-6">
            <img
              src="mapScreen.png"
              alt="Campus Sauna Labマップ画面"
              className="w-full h-auto object-cover rounded-lg mb-4 max-w-md"
            />
          </div>

          <div className="flex flex-col text-base md:text-xl text-white">
            <h2 className="text-xl font-bold mb-2 text-center md:text-3xl">
              Campus Sauna Labの特徴
            </h2>
            <hr className="border-t-4 border-green-300 my-4 w-1/2 mx-auto" />
            <div className="text-center">
              <p className=" m-4 text-center">
                大学周辺のサウナ施設を地図で視覚的に表示できるアプリケーション。
              </p>
              <p className="m-4">
                空きコマや授業後に大学周辺のサウナで整いませんか？
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="p-6 bg-gray-900 shadow-lg mx-auto text-white">
        {/* MyMap説明 */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-center">
          <div className="mt-6">
            <img
              src="MyMap.jpg"
              alt="Campus Sauna Labお気に入り登録機能"
              className="w-full h-auto object-cover rounded-lg mb-4 max-w-md"
            />
          </div>

          <div className="flex flex-col text-base md:text-xl text-white">
            <h2 className="text-xl font-bold mb-2 text-center md:text-3xl">
              MyMap機能でお気に入り施設をコレクション
            </h2>
            <hr className="border-t-4 border-green-300 my-4 w-1/2 mx-auto" />
            <div className="text-center">
              <p className="m-4">
                無料の会員登録でMyMapが使用可能。お気に入りの施設をコレクション。
              </p>
              <p className="m-4">
                MyMapを共有して友人におすすめの施設を伝えよう！
              </p>
              <p>※シェア機能実装予定</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default serviceDescription;
