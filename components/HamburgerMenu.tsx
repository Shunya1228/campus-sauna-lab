"use client";
import React from "react";
import Link from "next/link";

const HamburgerMenu: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="md:flex md:items-center w-full">
          <div className="flex space-x-4">
            <Link href="/signup">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                新規登録
              </button>
            </Link>
            <Link href="/login">
            <button className="bg-green-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              ログイン
            </button>
            </Link>
          </div>
          <a className="block mt-4 md:inline-block md:mt-0 text-white hover:text-gray-400 mr-4">
            ホーム
          </a>
          <Link href="/mypage">
          <p className="block mt-4 md:inline-block md:mt-0 text-white hover:text-gray-400 mr-4">
            マイページ
          </p>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default HamburgerMenu;
